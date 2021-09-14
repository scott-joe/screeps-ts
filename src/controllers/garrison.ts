import { CreepRole } from 'types/main'
import { isEqual, isGtOrEqual } from 'utils/base'
import { creepTemplates } from '../constants'
import Census, { CensusRecords } from './Census'

const { HARVESTER } = CreepRole

/*
    THE GARRISON IS RESPONSIBLE FOR UNIT PRODUCTION
*/
export class Garrison {
    private room: Room
    private spawn: StructureSpawn
    private energyAvailable: number
    private energyCapacity: number
    private controllerLevel: number
    public spawnQueue: CreepRole[]
    public census: Census

    constructor(spawn: StructureSpawn, room: Room, controllerLevel: number) {
        this.room = room
        this.spawn = spawn
        this.controllerLevel = controllerLevel
        this.energyAvailable = spawn.room.energyAvailable
        this.energyCapacity = spawn.room.energyCapacityAvailable
        this.census = new Census(room)
        this.spawnQueue = room.memory.spawnQueue || undefined

        if (this.spawnQueue === undefined)
            this.spawnQueue = this.generateSpawnQueue(this.controllerLevel, isGtOrEqual)
    }

    private generateCreepRecipe(template: BodyPartConstant[], energy: number): BodyPartConstant[] {
        let parts: BodyPartConstant[] = []

        while (energy > 0 && parts.length < 50) {
            // Get next part in the template.
            let next = template[parts.length % template.length] // returns 0...2

            // If next part cost > energy remaining, try to build remaining template
            if (BODYPART_COST[next] > energy) {
                // Get parts in template after expensive one
                const start = template.indexOf(next) + 1
                const remainingTemplate = template.slice(start, template.length)
                // If there's anything left, try again
                if (remainingTemplate.length > 0) {
                    // Run this function with the partial template
                    const result = this.generateCreepRecipe(remainingTemplate, energy)
                    // Add that output list to the 'main' parts list
                    parts = parts.concat(result)
                }

                // Clean up the energy at this level bc it was used up in a recusion
                energy -= energy
            } else {
                // Add part to recipe and subtract energy cost
                energy -= BODYPART_COST[next]
                parts.push(next)
            }
        }

        // SORT PARTS BASED ON ORIGINAL TEMPLATE?
        //  FILTER PARTS INTO SUB-ARRAYS AND THEN CONCAT THEM BACK TOGETHER?
        return parts
    }

    public generateSpawnQueue(controllerLevel: number, predicate: Function): CreepRole[] {
        const output: CreepRole[] = []
        const census: CensusRecords = this.census.getRecords()

        for (const id in census) {
            // Get the config for that role
            const cfg = census[id]
            // Get a typesafe role name
            const role = id as CreepRole
            // If our the creep should spawn yet
            if (predicate(cfg.unlock, controllerLevel)) {
                for (let i = 1; i <= cfg.max; i++) {
                    output.push(role)
                }
            }
        }

        return output
    }

    public updateSpawnQueue(controllerLevel: number): void {
        // Get the new creeps if any are unlocked at this level
        const newCreeps = this.generateSpawnQueue(controllerLevel, isEqual)
        // Add them to the end of the queue
        this.spawnQueue = [...this.spawnQueue, ...newCreeps]
        this.save()
    }

    public buryTheDead(): void {
        for (const name in Memory.creeps) {
            if (!(name in Game.creeps)) {
                this.census.remove(Memory.creeps[name].role)
                this.removeFromMemory(name, Memory.creeps[name].role)
            }
        }

        this.save()
    }

    private removeFromMemory(name: string, role: CreepRole): void {
        if (delete Memory.creeps[name]) {
            // Put this creep's role back at the front of the queue
            this.spawnQueue.unshift(role)
        }
    }

    private spawnCreep(role: CreepRole): void {
        const name: string = `${role}-${Game.time}`
        const template: BodyPartConstant[] = creepTemplates[role]
        const body = this.generateCreepRecipe(template, this.spawn.room.energyAvailable)
        const opts = { memory: { role } }

        if (this.spawn.spawnCreep(body, name, opts) === 0) {
            // Remove the creep's role from the queue
            this.spawnQueue.shift()
            // Add the role to the census
            this.census.add(role)
        }
    }

    public recruit(): void {
        const role: CreepRole = this.spawnQueue[0]
        const hasNoHarvesters = this.census.getCount(HARVESTER) === 0
        const hasMinimumEnergy = this.energyAvailable >= 300

        // If Harvesters all die off don't wait for other roles to build
        //  as it'll take forever to build everything else in the queue
        //  before the 1st Harvester
        if (hasNoHarvesters && hasMinimumEnergy) {
            // Move the Harvester queue entry to the front of the queue
            this.spawnQueue.splice(this.spawnQueue.indexOf(HARVESTER), 1)
            this.spawnQueue.unshift(HARVESTER)
            this.spawnCreep(HARVESTER)
        } else if (role) {
            // Do we have room for another creep of this role?
            const haveRoom = this.census.hasRoomFor(role)
            // Are we at max energy, so they're the biggest and best they can be?
            const atFullEnergy = this.energyAvailable === this.energyCapacity

            if (haveRoom && atFullEnergy) {
                // Spawn a creep
                this.spawnCreep(role)
            }
        }

        this.save()
    }

    private save(): void {
        this.room.memory.spawnQueue = this.spawnQueue
        this.room.memory.census = this.census.getRecords()
    }
}

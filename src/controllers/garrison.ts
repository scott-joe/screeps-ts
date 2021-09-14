import { CreepRole } from 'types/main'
import { creepTemplates } from '../constants'
import Census, { CensusRecords } from './Census'

/*
    THE GARRISON IS RESPONSIBLE FOR UNIT PRODUCTION
*/
export class Garrison {
    private spawn: StructureSpawn
    private energyAvailable: number
    private energyCapacity: number
    public census: Census

    constructor(spawn: StructureSpawn, room: Room) {
        this.spawn = spawn
        this.energyAvailable = spawn.room.energyAvailable
        this.energyCapacity = spawn.room.energyCapacityAvailable
        this.census = new Census(room)
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

    public generateSpawnQueue(controllerLevel: number, condition: Function): CreepRole[] {
        const output: CreepRole[] = []
        const census: CensusRecords = this.census.getRecords()

        for (const id in census) {
            // Get the config for that role
            const cfg = census[id]
            // Get a typesafe role name
            const role = id as CreepRole
            // If our the creep should spawn yet
            if (condition(cfg.unlock, controllerLevel)) {
                for (let i = 1; i <= cfg.max; i++) {
                    output.push(role)
                }
            }
        }

        return output
    }

    private spawnCreep(role: CreepRole): boolean {
        const name: string = `${role}-${Game.time}`
        const template: BodyPartConstant[] = creepTemplates[role]
        const body = this.generateCreepRecipe(template, this.spawn.room.energyAvailable)

        const result = this.spawn.spawnCreep(body, name, {
            memory: { role }
        })

        return result === 0 ? true : false
    }

    public recruit(role: CreepRole): boolean {
        const censusRecords: CensusRecords = this.census.getRecords()
        // Do we have room for another creep of this role?
        const haveRoom = censusRecords[role].cur < censusRecords[role].max
        // Are we at max energy, so they're the biggest and best they can be?
        const atFullEnergy = this.energyAvailable === this.energyCapacity

        if (haveRoom && atFullEnergy) {
            // Spawn a creep
            return this.spawnCreep(role)
        } else {
            // Don't spawn
            return false
        }
    }
}

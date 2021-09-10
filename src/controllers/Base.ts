import { censusDefaults } from '../constants'
import { harvester, builder } from 'roles'
import { Census, CreepRole } from 'types/main'
import { Garrison } from './Garrison'

// TODO: IF THERE ARE NO SPAWNS THAT NEED ENERGY, UPGRADE RC

export default class Base {
    private room: Room
    private spawns: StructureSpawn[]
    private garrison: Garrison

    private memory: RoomMemory
    private spawnQueue: CreepRole[]
    private census: Census
    private controllerLevel: number

    constructor(room: Room) {
        this.room = room
        this.spawns = this.room.find(FIND_MY_SPAWNS) // <= 3
        this.memory = this.room.memory
        this.spawnQueue = this.memory.spawnQueue || []
        this.controllerLevel = this.memory.controllerLevel || room.controller?.level!
        this.garrison = new Garrison(this.spawns[0])
        this.census = this.memory.census || censusDefaults
    }

    private applyCreepRoleBehavior(): void {
        const creeps: { [name: string]: Creep } = Game.creeps
        for (const name in creeps) {
            const creep = creeps[name]

            // Creeps show up in the list while spawning...
            if (!creep.spawning) {
                switch (creep.memory.role) {
                    case CreepRole.HARVESTER:
                        harvester.run(creep)
                        break
                    case CreepRole.BUILDER:
                        builder.run(creep)
                        break
                    // case CreepRole.MECHANIC:
                    //     mechanic.run(creep)
                    //     break
                    // case CreepRole.GRUNT:
                    //     grunt.run(creep)
                    //     break
                    // case CreepRole.RANGER:
                    //     ranger.run(creep)
                    //     break
                    // case CreepRole.MEDIC:
                    //     medic.run(creep)
                    //     break
                    // case CreepRole.SCOUT:
                    //     scout.run(creep)
                    //     break
                    default:
                        break
                }
            }
        }
    }

    // TODO: Move to census.remove
    private removeFromCensus(role: CreepRole): void {
        // Put this creep's role back at the front of the queue
        this.spawnQueue.unshift(role)
        // Remove them from the census
        this.census[role].cur -= 1
    }

    // TODO: Move use of this up to top level?
    private save() {
        this.memory.controllerLevel = this.controllerLevel
        this.memory.spawnQueue = this.spawnQueue
        this.memory.census = this.census
    }

    // TODO: Move to memory.remove?
    private removeFromMemory(name: string, role: CreepRole) {
        if (delete Memory.creeps[name]) {
            console.log(`🔶 Removing ${name} from Memory & Census`)
            this.removeFromCensus(role)
        }
    }

    // TODO: Move to Base utils?
    private isSpawning(spawn: StructureSpawn): boolean {
        // Will be a creep object if spawning and null if not
        return spawn.spawning !== null
    }

    private updateRCL(room: Room): number {
        // Check for existing value in Memory
        const prevRCL = this.controllerLevel
        // Check live RCL
        const curRCL = room.controller?.level!
        // If there is a prevRCL set...
        if (!!prevRCL) {
            // And it's changed since last tick
            if (prevRCL !== curRCL) {
                // Comparison by which to decide to add the creep role to the queue
                const isEqual = (unlockLevel: number, controllerLevel: number): boolean => controllerLevel === unlockLevel
                // Get the new creeps if any are unlocked at this level
                const newCreeps = this.garrison.generateSpawnQueue(this.census, curRCL, isEqual)
                // Add them to the end of the queue
                this.spawnQueue.concat(newCreeps)
            }
        }

        // Return current controller level
        return curRCL
    }

    public main(): void {
        // Make sure the Base has a spawn queue
        const isGtOrEqual = (unlockLevel: number, controllerLevel: number): boolean => controllerLevel >= unlockLevel
        this.spawnQueue = this.spawnQueue.length > 0 ? this.spawnQueue : this.garrison.generateSpawnQueue(this.census, this.controllerLevel, isGtOrEqual)
        this.controllerLevel = this.updateRCL(this.room)

        // Recruit new creep and add to census
        for (const id in this.spawns) {
            const spawn: StructureSpawn = this.spawns[id]

            // Is the Spawn busy?
            if (!this.isSpawning(spawn)) {
                const nextCreep: CreepRole = this.spawnQueue[0]
                if (nextCreep) {
                    this.garrison.recruit(nextCreep, this.census, this.spawnQueue)
                }
            }
        }

        this.applyCreepRoleBehavior()

        // Clean up Memory with dead creeps
        for (const name in Memory.creeps) {
            if (!(name in Game.creeps)) {
                this.removeFromMemory(name, Memory.creeps[name].role)
            }
        }

        this.save()
    }
}

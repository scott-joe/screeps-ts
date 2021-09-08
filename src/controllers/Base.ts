import { censusDefaults } from '../constants'
import { harvester, builder } from 'roles'
import { Census, CreepRole, Size } from 'types/main'
import { Garrison } from './Garrison'

// TODO: IF THERE ARE NO SPAWNS THAT NEED ENERGY, UPGRADE RC

export default class Base {
    private room: Room
    private spawns: StructureSpawn[]
    private garrison: Garrison

    private memory: RoomMemory
    private spawnQueue: CreepRole[]
    private baseSize: Size
    private census: Census

    constructor(room: Room) {
        this.room = room
        this.spawns = this.room.find(FIND_MY_SPAWNS) // <= 3
        this.memory = this.room.memory
        this.baseSize = this.calculateBaseSize()
        this.census = this.memory.census || censusDefaults
        this.spawnQueue = this.memory.spawnQueue || []
        this.garrison = new Garrison(this.spawns[0], this.baseSize)
    }

    private applyCreepRoleBehavior(): void {
        const creeps: { [creepName: string]: Creep } = Game.creeps
        for (const name in creeps) {
            const creep = creeps[name]

            if (!creep.spawning) {
                switch (creep.memory.role) {
                    case CreepRole.HARVESTER:
                        harvester.run(creep)
                        break
                    case CreepRole.BUILDER:
                        builder.run(creep)
                        break
                    default:
                        break
                }
            }
        }
    }

    private calculateBaseSize(): Size {
        const capacity: number = this.room.energyCapacityAvailable
        switch (true) {
            case capacity >= 2600:
                return Size.LARGE
            case capacity >= 550:
                return Size.MEDIUM
            case capacity >= 300:
            default:
                return Size.SMALL
        }
    }

    private removeFromCensus(role: CreepRole): void {
        // Put this creep's role back at the front of the queue
        this.spawnQueue.unshift(role)
        // Remove them from the census
        this.census[role].cur -= 1
    }

    private save() {
        this.memory.spawnQueue = this.spawnQueue
        this.memory.census = this.census
    }

    // private rebuildCensus(): void {
    //     const census = censusDefaults

    //     for (const name in Memory.creeps) {
    //         const role: CreepRole = Game.creeps[name].memory.role
    //         census[role].cur++
    //     }

    //     this.census = census
    // }

    private removeFromMemory(name: string, role: CreepRole) {
        if (delete Memory.creeps[name]) {
            console.log(`🔶 Removing ${name} from Memory & Census`)
            this.removeFromCensus(role)
        }
    }

    private isSpawning(spawn: StructureSpawn): boolean {
        // Will be a creep object if spawning and null if not
        return spawn.spawning !== null
    }

    public main(): void {
        // Make sure the Base has a spawn queue
        this.spawnQueue = this.spawnQueue.length > 0 ? this.spawnQueue : this.garrison.generateSpawnQueue(this.census)

        // Recruit new creep and add to census
        for (const id in this.spawns) {
            const spawn = this.spawns[id]

            // Is the Spawn busy?
            if (!this.isSpawning(spawn)) {
                const role: CreepRole = this.spawnQueue[0]
                this.garrison.recruit(role, this.census, this.spawnQueue)
            }
        }

        this.applyCreepRoleBehavior()

        for (const name in Memory.creeps) {
            if (!(name in Game.creeps)) {
                this.removeFromMemory(name, Memory.creeps[name].role)
            }
        }

        this.save()
    }
}

// const structures: { [structureName: string]: Structure } = Game.structures
// Towers do tower things, and so on
// for (const id in structures) {
//     const structure: Structure = structures[id]
//
//     switch (structure.structureType) {
//         case STRUCTURE_TOWER:
//             guard.run(structure)
//             break
//         default:
//             break
//     }
// }

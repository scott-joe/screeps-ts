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
        switch (true) {
            case this.room.energyCapacityAvailable === 300:
                return Size.SMALL
            case this.room.energyCapacityAvailable === 550:
                return Size.MEDIUM
            case this.room.energyCapacityAvailable === 800:
            case this.room.energyCapacityAvailable === 1200:
            case this.room.energyCapacityAvailable === 1600:
            case this.room.energyCapacityAvailable === 2000:
            case this.room.energyCapacityAvailable === 2400:
            case this.room.energyCapacityAvailable === 2600:
                return Size.LARGE
            default:
                return Size.SMALL
        }
    }

    private removeFromCensus(role: CreepRole): void {
        this.spawnQueue.unshift(role)
        this.census[role].cur -= 1
    }

    private addToCensus(role: CreepRole): void {
        this.spawnQueue.shift()
        this.census[role].cur += 1
    }

    private save() {
        this.memory.spawnQueue = this.spawnQueue
        this.memory.census = this.census

        if (Game.time % 50 === 0) {
            console.log('---- Census ----')
            for (const role in this.memory.census) {
                console.log(`${role}: ${this.memory.census[role].cur}`)
            }
            console.log('----------------')
        }
    }

    private rebuildCensus(): void {
        const census = censusDefaults

        for (const name in Memory.creeps) {
            const role: CreepRole = Game.creeps[name].memory.role
            census[role].cur++
        }

        this.census = census
    }

    private removeFromMemory(name: string, role: CreepRole) {
        if(delete Memory.creeps[name]) {
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
        this.spawnQueue =
            this.spawnQueue.length > 0
                ? this.spawnQueue
                : this.garrison.generateSpawnQueue(100)

        // Recruit new creep and add to census
        for (const id in this.spawns) {
            const spawn = this.spawns[id]

            if (!this.isSpawning(spawn)) {
                const role: CreepRole = this.spawnQueue[0]
                // console.log(`🟢 Attempting to Recruit ${role}`)
                const result = this.garrison.recruit(role, this.census)
                if (result) {
                    console.log(`🟢 Updating Census for ${role}`)
                    this.addToCensus(role)
                }
            } else {
                // console.log(`🔴 Spawn busy`)
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

//     switch (structure.structureType) {
//         case STRUCTURE_TOWER:
//             guard.run(structure)
//             break

//         default:
//             break
//     }

// }

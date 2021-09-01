import { censusDefaults } from '../constants'
import { harvester, builder } from 'roles'
import { Census, CreepRole, Size } from 'types/main'
import { Garrison } from './Garrison'
import { result } from 'lodash'

export default class Base {
    private room: Room
    private spawns: StructureSpawn[]

    private memory: RoomMemory
    private spawnQueue: CreepRole[]

    private baseSize: Size
    private census: Census

    private garrison: Garrison

    constructor(room: Room) {
        this.room = room
        this.spawns = this.room.find(FIND_MY_SPAWNS) // <= 3
        this.memory = this.room.memory
        this.baseSize = this.calculateBaseSize()
        this.census = this.memory.census || censusDefaults
        this.spawnQueue = this.memory.spawnQueue || [CreepRole.HARVESTER]
        this.garrison = new Garrison(this.spawns[0], this.census, this.baseSize)
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
        switch (this.room.controller?.level) {
            case 1:
            case 2:
                return Size.SMALL
            case 3:
            case 4:
            case 5:
            case 6:
                return Size.MEDIUM
            case 7:
            case 8:
                return Size.LARGE
            default:
                return Size.ZERO
        }
    }

    private updateState(role: CreepRole): void {
        console.log(`Updating census data for ${role}`)
        this.spawnQueue.shift()
        this.census[role].cur += 1
    }

    private save() {
        this.memory.spawnQueue = this.spawnQueue
        this.memory.census = this.census
    }

    public main(): void {
        // Make sure the Base has a spawn queue
        console.log(`${Game.time}`)

        this.spawnQueue =
            this.spawnQueue.length > 0
                ? this.spawnQueue
                : this.garrison.generateSpawnQueue(100)

        // Recruit new creep and add to census
        for (const id in this.spawns) {
            const spawn = this.spawns[id]

            // Will be a creep object if spawning and null if not
            if (spawn.spawning === null) {
                const role: CreepRole = this.spawnQueue[0]

                const result = this.garrison.recruit(role)
                console.log(`result ${result}`)

                if (result) {
                    this.updateState(role)
                }
            }
        }

        this.applyCreepRoleBehavior()

        this.save()
    }
}

// const spawns: { [spawnName: string]: StructureSpawn } = Game.spawns
// const structures: { [structureName: string]: Structure } = Game.structures

// • Find other energy sources if this one is taken
// • Queue priority directions that override roles
// • Harvesters and Builders?...
// • Setting intent via creep memory to it only has to look
//       up "what to do" every so often
// • Prioritization or formula of base building
//       Do X until Y, then A until B

// ASK HOW MANY CREEPS THERE ARE
// SET CREEP CENSUS LEVEL BASED ON
// REQUEST MORE FROM GARRISON IF NECESSARY
// CHECK IF BUILDINGS NEED REPAIR
// SET PRIORITY BASED ON STATE OF THE ROOM

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

//     // console.log(`structure.id: ${structure.id}`)
// }

// Based on Controller level? Total energy available? LVL of each role to x1 x2 x3... roles
//       Based on need? Change roles based on what's needed and keep everyone fairly generlized
//       Based on room? Do this whole loop per room? Or operate the whole thing together
// room.memory.census = room.memory.census || censusConfig
// Room should know it's plan
// Room should know the creeps in it
// Room should tell the spawn to add a new creep if needed
// Creep management (e.g., numbers and spawning)
// for (const id in spawns) {
//     const spawn = spawns[id]
//     garrison.run(spawn)
// }

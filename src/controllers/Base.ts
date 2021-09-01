import { censusDefaults } from "../constants"
import { harvester, builder } from "roles"
import { Census, CreepRole, Size } from "types/main"
import { Garrison } from "./garrison"

export default class Base {
    private room: Room
    private memory: RoomMemory

    private baseSize: Size
    private census: Census

    private spawns: StructureSpawn[]
    private garrison: Garrison
    private spawnQueue: CreepRole[]

    constructor (room: Room) {
        this.room = room
        this.spawns = this.room.find(FIND_MY_SPAWNS) // <= 3
        this.memory = this.room.memory
        this.baseSize = this.calculateBaseSize()
        this.census = this.memory.census || censusDefaults
        this.garrison = new Garrison(this.spawns[0], this.census, this.baseSize)
        this.spawnQueue = this.memory.spawnQueue || []
    }

    private applyCreepRoleBehavior(): void {
        const creeps: { [creepName: string]: Creep } = Game.creeps
        for (const name in creeps) {
            const creep = creeps[name]

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

    private updateCensus(role: CreepRole | undefined): void {
        if (!!role && CreepRole[role]) {
            this.census[role].cur += 1
        }
    }

    private save() {
        // UPDATE ROOM MEMORY WITH BASE INFO
    }

    public main (): void {
        // Make sure the Base has a spawn queue
        this.spawnQueue = this.spawnQueue.length > 0
            ? this.spawnQueue
            : this.garrison.generateSpawnQueue(100)

        this.updateCensus(this.garrison.recruit())

        this.applyCreepRoleBehavior()
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

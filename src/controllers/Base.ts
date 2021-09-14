import { harvester, builder, mechanic } from 'roles'
import { CreepRole } from 'types/main'
import { isEqual } from 'utils/base'
import { Garrison } from './Garrison'

/*
    THE BASE IS RESPONSIBLE FOR CONTROLLING THE ROOM
*/
export default class Base {
    private garrison: Garrison
    private room: Room
    private memory: RoomMemory
    private spawns: StructureSpawn[]
    private controllerLevel: number

    constructor(room: Room) {
        this.room = room
        this.spawns = room.find(FIND_MY_SPAWNS) // <= 3
        this.memory = room.memory
        this.controllerLevel = this.memory.controllerLevel || room.controller?.level! || 1
        this.garrison = new Garrison(this.spawns[0], room, this.controllerLevel)
    }

    private applyCreepRoles(): void {
        const creeps: { [name: string]: Creep } = Game.creeps
        for (const name in creeps) {
            const creep: Creep = creeps[name]

            // Creeps show up in the list while spawning,
            //  so we have to check that they're ready
            if (!creep.spawning) {
                switch (creep.memory.role) {
                    case CreepRole.HARVESTER:
                        harvester.run(creep)
                        break
                    case CreepRole.BUILDER:
                        builder.run(creep)
                        break
                    case CreepRole.MECHANIC:
                        mechanic.run(creep)
                        break
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

    private save(): void {
        this.memory.controllerLevel = this.controllerLevel
    }

    private updateRCL(room: Room): number {
        // Check existing and live values
        const prev = this.controllerLevel
        const cur = room.controller?.level!
        // If there is a prev set...
        if (!!prev) {
            // And it's changed since last tick
            if (prev !== cur) {
                // Add the newly unlocked creeps
                this.garrison.updateSpawnQueue(cur)
            }
        }

        // Return current controller level
        return cur
    }

    public main(): void {
        // Set controller level and update spawn queue if lvl increased
        this.controllerLevel = this.updateRCL(this.room)

        // For each spawn, try to receuit a new creep
        for (const id in this.spawns) {
            const spawn: StructureSpawn = this.spawns[id]

            // Is the Spawn busy?
            if (!spawn.isSpawning(spawn)) {
                this.garrison.recruit()
            }
        }

        // Clean up Memory of dead creeps
        this.garrison.buryTheDead()

        // Get the creeps moving
        this.applyCreepRoles()

        // Make sure everything is saved to Memory
        this.save()
    }
}

import { harvester, builder, mechanic } from 'roles'
import { CreepRole } from 'types/main'
import { Garrison } from './Garrison'

/*
    THE BASE IS RESPONSIBLE FOR CONTROLLING THE ROOM
*/
export default class Base {
    private garrison: Garrison
    private room: Room
    private memory: RoomMemory
    private spawns: StructureSpawn[]
    private spawnQueue: CreepRole[]
    private controllerLevel: number

    constructor(room: Room) {
        this.room = room
        this.spawns = room.find(FIND_MY_SPAWNS) // <= 3
        this.memory = room.memory
        this.spawnQueue = this.memory.spawnQueue || undefined
        this.controllerLevel = this.memory.controllerLevel || room.controller?.level!
        this.garrison = new Garrison(this.spawns[0], room)
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

    private save() {
        this.memory.controllerLevel = this.controllerLevel
        this.memory.spawnQueue= this.spawnQueue
    }

    private removeFromMemory(name: string, role: CreepRole) {
        if (delete Memory.creeps[name]) {
            console.log(`🔶 Removing ${name} from Memory & Census`)
            // Put this creep's role back at the front of the queue
            this.spawnQueue.unshift(role)
        }
    }

    private updateRCL(room: Room): number {
        // Check for existing value in Memory
        const prev = this.controllerLevel
        // Check live RCL
        const cur = room.controller?.level!
        // If there is a prev set...
        if (!!prev) {
            // And it's changed since last tick
            if (prev !== cur) {
                // Comparison by which to decide to add the creep role to the queue
                const isEqual = (unlockLevel: number, controllerLevel: number): boolean =>
                    controllerLevel === unlockLevel
                // Get the new creeps if any are unlocked at this level
                const newCreeps = this.garrison.generateSpawnQueue(cur, isEqual)
                // Add them to the end of the queue
                this.spawnQueue = [...this.spawnQueue, ...newCreeps]
            }
        }

        // Return current controller level
        return cur
    }

    public main(): void {
        // Make sure the Base has a spawn queue
        const isGtOrEqual = (unlockLevel: number, controllerLevel: number): boolean => controllerLevel >= unlockLevel
        if (this.spawnQueue === undefined)
            this.spawnQueue = this.garrison.generateSpawnQueue(this.controllerLevel, isGtOrEqual)
        this.controllerLevel = this.updateRCL(this.room)

        // Recruit new creep and add to census
        for (const id in this.spawns) {
            const spawn: StructureSpawn = this.spawns[id]

            // Is the Spawn busy?
            if (!spawn.isSpawning(spawn)) {
                const role: CreepRole = this.spawnQueue[0]
                if (role) {
                    const result = this.garrison.recruit(role)
                    // Did it succeed?
                    if (result) {
                        console.log(`🟢 Spawning ${role}`)
                        // Remove the creep's role from the queue
                        this.spawnQueue.shift()
                        // Add the role to the census
                        this.garrison.census.add(role)
                    }
                }
            }
        }

        this.applyCreepRoles()

        // Clean up Memory with dead creeps
        for (const name in Memory.creeps) {
            if (!(name in Game.creeps)) {
                this.garrison.census.remove(Memory.creeps[name].role)
                this.removeFromMemory(name, Memory.creeps[name].role)
            }
        }

        this.save()
    }
}

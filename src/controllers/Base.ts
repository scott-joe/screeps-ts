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
    // TODO: COULD MOVE SPAWN QUEUE TO ROOM.MEMORY?
    private spawnQueue: CreepRole[]
    private census: Census

    constructor(room: Room) {
        this.room = room
        this.spawns = this.room.find(FIND_MY_SPAWNS) // <= 3
        this.memory = this.room.memory
        this.census = this.memory.census || censusDefaults
        this.spawnQueue = this.memory.spawnQueue || []
        this.garrison = new Garrison(this.spawns[0])
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

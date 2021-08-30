import { Census, CreepRole } from 'types/main'
import { creepRecipes, creepSize, minEnergy } from '../constants'

const shouldSpawn = (role: CreepRole, census: Census): boolean => {
    return census[role].cur < census[role].min
}

const spawnCreep = (spawn: StructureSpawn, role: CreepRole, census: Census): void => {
    const name: string = `${role}-${Game.time}`
    // TODO: Get body from constants/enums
    const body = creepRecipes[role].SM
    census[role].cur += 1
    spawn.spawnCreep(body, name, {
        memory: { role }
    })
}

const HARVESTER_FREQUENCY = 3
const BUILDER_FREQUENCY = 2
const generateSpawnOrder = (size: any, room: Room): CreepRole[] => {
    const spawnOrder = []
    for (let i = 1; i <= size; i++) {
        if (i % HARVESTER_FREQUENCY === 0) {
            spawnOrder.push(CreepRole.HARVESTER)
        } else if (i % BUILDER_FREQUENCY === 0) {
            spawnOrder.push(CreepRole.BUILDER)
        }
    }
    return spawnOrder
}

export default {
    run: (spawn: StructureSpawn): void => {
        const census: Census = spawn.room.memory.census
        const room: Room = spawn.room
        const spawnQueue: CreepRole[] = room.memory.spawnOrder || []
        if (spawnQueue.length === 0) {
            room.memory.spawnOrder = generateSpawnOrder(100, room)
        }

        if (!spawn.spawning) {
            if (spawn.store.energy >= minEnergy) {
                switch (true) {
                    case shouldSpawn(CreepRole.HARVESTER, census):
                        spawnCreep(spawn, CreepRole.HARVESTER, census)
                        break
                    case shouldSpawn(CreepRole.UPGRADER, census):
                        spawnCreep(spawn, CreepRole.UPGRADER, census)
                        break
                    case shouldSpawn(CreepRole.BUILDER, census):
                        spawnCreep(spawn, CreepRole.BUILDER, census)
                        break
                    default:
                        break
                }
            }
        } else {
            const newCreepName = spawn.spawning.name
            spawn.room.visual.text(
                `🛠️ ${newCreepName}`,
                spawn.pos.x + 1,
                spawn.pos.y,
                { align: 'left', opacity: 0.8 }
            )
        }
    }
}

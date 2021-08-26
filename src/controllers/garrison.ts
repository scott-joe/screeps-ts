import { CreepRole } from 'types/main'
import { creepRecipes, creepSize, minEnergy } from '../constants'

const shouldSpawn = (role: CreepRole): boolean => {
    return Memory.census[role].cur < Memory.census[role].min
}

const spawnCreep = (spawn: StructureSpawn, role: CreepRole): void => {
    const name: string = `${role}-${Game.time}`
    // TODO: Get body from constants/enums
    const body = creepRecipes[role].SM
    Memory.census[role].cur += 1
    spawn.spawnCreep(body, name, {
      memory: { role }
    })
}

export default {
    run: (spawn: StructureSpawn): void => {
        if (!spawn.spawning) {
            if (spawn.store.energy >= minEnergy) {
                switch (true) {
                    case shouldSpawn(CreepRole.HARVESTER):
                        spawnCreep(spawn, CreepRole.HARVESTER)
                        break
                    case shouldSpawn(CreepRole.UPGRADER):
                        spawnCreep(spawn, CreepRole.UPGRADER)
                        break
                    case shouldSpawn(CreepRole.BUILDER):
                        spawnCreep(spawn, CreepRole.BUILDER)
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

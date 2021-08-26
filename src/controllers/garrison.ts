import { CreepRole } from 'types/main'
import { creepRecipes, creepSize, minEnergy } from '../constants'

const shouldSpawn = (role: CreepRole): boolean => {
    return Memory.census[role].cur < Memory.census[role].min
}

const spawnCreep = (spawn: StructureSpawn, role: CreepRole): void => {
    const name: string = `${role}-${Game.time}`
    // TODO: Get body from constants/enums
    const body = creepRecipes[role].SM
    spawn.spawnCreep(body, name, {
        memory: { role }
    })
}

export default {
    run: (spawn: StructureSpawn): void => {
        // if not actively spawning
        if (!spawn.spawning) {
            // TODO: spawn.renewCreep
            if (spawn.store.energy >= minEnergy) {
                // Check if creeps are needed
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
                    case shouldSpawn(CreepRole.SOLDIER):
                        spawnCreep(spawn, CreepRole.SOLDIER)
                        break
                    default:
                        break
                }
            }
        } else {
            const newCreepName = spawn.spawning.name
            const newCreep = Game.creeps[newCreepName]
            spawn.room.visual.text(
                `🛠️ ${newCreepName}`,
                spawn.pos.x + 1,
                spawn.pos.y,
                { align: 'left', opacity: 0.8 }
            )
        }
    }
}

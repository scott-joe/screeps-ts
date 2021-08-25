import { CreepRole } from 'types/main'
import { creepRecipes, creepSize, minEnergy } from '../constants'

export default {
    new: (spawn: StructureSpawn, role: CreepRole): void => {
        if (!spawn.spawning) {
            // TODO: spawn.renewCreep
            if (spawn.store.energy >= minEnergy) {
                console.log(`Spawning: ${role}`)
                const name: string = `${role}-${Game.time}`
                const body: Array<BodyPartConstant> = creepRecipes[role].SM
                spawn.spawnCreep(body, name, { memory: { role: role } })
            }
        }
    }
}

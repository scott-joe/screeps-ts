import { type } from 'os'
import { exit } from 'process'
import {
    Census,
    CensusStatus,
    CreepRecipe,
    CreepRole,
    Division
} from 'types/main'
import { creepRecipes, creepSize, minEnergy } from '../constants'

export default {
    new: (spawn: StructureSpawn, role: CreepRole): void => {
        // if not actively spawning
        if (!spawn.spawning) {
            // TODO: spawn.renewCreep
            if (spawn.store.energy >= minEnergy) {
                console.log('building a ' + role)
                const name: string = `${role}-${Game.time}`
                // TODO: Get body from constants/enums
                const body = creepRecipes[role].SM
                spawn.spawnCreep(body, name, { memory: { role: role } })
            }
        }
    }
}

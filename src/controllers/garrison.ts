import { type } from 'os'
import {
    Census,
    CensusStatus,
    CreepRecipe,
    CreepRole,
    Division
} from 'types/main'
import { creepRecipes, creepSize } from '../constants'

export default {
    run: (spawn: StructureSpawn, census: any): void => {
        // if not actively spawning
        if (!spawn.spawning) {
            // TODO: spawn.renewCreep
            if (spawn.store.energy > 300) {
                // Check if creeps are needed
                for (const t in census) {
                    const ROLE = t as CreepRole
                    if (census[ROLE].cur < census[ROLE].min) {
                        const name: string = `${ROLE}-${Game.time}`
                        // TODO: Get body from constants/enums
                        const body = creepRecipes[ROLE].SM
                        spawn.spawnCreep(body, name, { memory: { role: ROLE } })
                    }
                }
            }
        }
    }
}

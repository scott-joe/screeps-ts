import { type } from 'os'
import {
    Census,
    CensusStatus,
    CreepRecipe,
    CreepRole,
    Division
} from 'types/main'
import { creepRecipes, creepSize, minEnergy } from '../constants'

export default {
    run: (spawn: StructureSpawn, census: any): void => {
        // if not actively spawning
        if (!spawn.spawning) {
            // TODO: spawn.renewCreep
            if (spawn.store.energy >= minEnergy) {
                // Check if creeps are needed
                // for (const t in census) {
                census.forEach((member: any) => {
                    if (member.cur < member.min) {
                        const role = member.role as CreepRole
                        const name: string = `${role}-${Game.time}`
                        // TODO: Get body from constants/enums
                        const body = creepRecipes[role].SM
                        spawn.spawnCreep(body, name, { memory: { role: role } })
                    }
                })
                // const ROLE = t as CreepRole
                // }
            }
        }
    }
}

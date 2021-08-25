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
    run: (spawn: StructureSpawn, census: any): void => {
        // if not actively spawning
        if (!spawn.spawning) {
            // TODO: spawn.renewCreep
            if (spawn.store.energy >= minEnergy) {
                // Check if creeps are needed
                census.forEach((member: any) => {
                    if (member.cur < member.min) {
                        const role = member.role as CreepRole
                        console.log('building a ' + role)
                        const name: string = `${role}-${Game.time}`
                        // TODO: Get body from constants/enums
                        const body = creepRecipes[role].SM
                        spawn.spawnCreep(body, name, { memory: { role: role } })
                        return
                    }
                })
            }
        }
    }
}

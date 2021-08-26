import { CreepRole } from 'types/main'
import { creepRecipes, creepSize, minEnergy } from '../constants'

export default {
    run: (spawn: StructureSpawn): void => {
        let busy = false
        // if not actively spawning
        if (!spawn.spawning) {
            // TODO: spawn.renewCreep
            if (!busy && spawn.store.energy >= minEnergy) {
                // Check if creeps are needed
                for (const role in Memory.census) {
                    const creepRole = role as CreepRole
                    const member = Memory.census[role]
                    if (member.cur < member.min) {
                        console.log('building a ' + role)
                        const name: string = `${role}-${Game.time}`
                        // TODO: Get body from constants/enums
                        const body = creepRecipes[creepRole].SM
                        spawn.spawnCreep(body, name, {
                            memory: { role: creepRole }
                        })
                        busy = true
                    }
                }
            }
        }
    }
}

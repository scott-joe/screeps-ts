import { type } from 'os'
import { Census, CreepRole, Division } from 'types/main'

export default {
    run: (spawn: StructureSpawn, census: Census): void => {
        // if not actively spawning
        if (!spawn.spawning) {
            for (const t in census) {
                const ROLE = t as CreepRole
                if (census[ROLE].cur < census[ROLE].min) {
                    const name: string = `${ROLE}-${Game.time}`
                    // TODO: Get body from constants/enums
                    const body: Array<BodyPartConstant> = [WORK, CARRY, MOVE]
                    spawn.spawnCreep(body, name, { memory: { role: ROLE } })
                }
            }
        }
    }
}

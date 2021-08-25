import { type } from 'os'
import { Census, CreepRole } from 'types/main'

export default {
    run: (spawn: StructureSpawn, census: Census): void => {
        // if not actively spawning creep
        // if (!spawn.spawning) {
        //     for (const type in census) {
        //         // const { BUILDER } = CreepRole
        //         // const type = CreepRole.BUILDER]
        //         switch (type) {
        //             case CreepRole.BUILDER:
        //                 if census[type].cur < census[type].min
        //                 const name = `${CreepRole[type]-${Game.time}}
        //                 const opts = { memory: { role: CreepRole[type] } }
        //                 spawn.spawnCreep(body, name, opts)
        //                 break;
        //             default:
        //                 break;
        //         }
        //         // TODO: Get body from constants/enums
        //     }
        // }
    }
}

import { Census, CreepRole } from "types/main";

export default {
    run: (spawn: StructureSpawn, census: Census): void => {
        // if not actively spawning creep
        if (!spawn.spawning)
          for (const type in census) {
              console.log(type)
              // if census[type].cur < census[type].min
                // TODO: Get body from constants/enums
                // const name = `${CreepRole[type]-${Game.time}}
                // const opts = { memory: { role: CreepRole[type] } }
                // spawn.spawnCreep(body, name, opts)
            }
          }
    },
}

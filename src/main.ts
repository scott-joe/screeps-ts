import { ErrorMapper } from 'utils/ErrorMapper'
require('extensions/index')

import Base from 'controllers/Base'
import { CreepRole, Division } from 'types/main'

declare global {
    /*
      Example types, expand on these or remove them and add your own.
      Note: Values, properties defined here do not fully *exist* by this type definiton alone.
            You must also give them an implemention if you would like to use them. (ex. actually setting a `role` property in a Creeps memory)

      Types added in this `global` block are in an ambient, global context. This is needed because `main.ts` is a module file (uses import or export).
      Interfaces matching on name from @types/screeps will be merged. This is how you can extend the 'built-in' interfaces from @types/screeps.
    */
    // Memory extension samples
    interface Memory {
        uuid: number
        log: any
    }

    interface CreepMemory {
        room?: string
        role: CreepRole
        division?: Division
        working?: boolean
        building?: boolean
        upgrading?: boolean
    }

    interface Creep {
        renew: Function
    }

    interface RoomMemory {
        census: { [x: string]: { min: number; cur: number } }
        spawnQueue: CreepRole[],
        creepId: number
    }

    interface Room {
        base: Function
        size: number
    }

    // Syntax for adding proprties to `global` (ex "global.log")
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace NodeJS {
        interface Global {
            log: any
        }
    }
}

export const loop = ErrorMapper.wrapLoop(() => {
    for (const id in Game.rooms) {
        new Base(Game.rooms[id]).main()
    }

    // Memory cleanup
    for (const name in Memory.creeps) {
        if (!(name in Game.creeps)) {
            console.log(`Removing ${name} from Memory`)
            delete Memory.creeps[name]
        }
    }
})

import { ErrorMapper } from 'utils/ErrorMapper'
import Base from 'controllers/Base'

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

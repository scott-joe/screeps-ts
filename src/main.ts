import { ErrorMapper } from 'utils/ErrorMapper'
import Base from 'controllers/Base'

export const loop = ErrorMapper.wrapLoop(() => {
    // Initialize each room's AI
    for (const id in Game.rooms) {
        new Base(Game.rooms[id]).main()
    }
})

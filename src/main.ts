import 'extensions/Creep' // Extend the Screeps API
import { ErrorMapper } from 'utils/ErrorMapper'
import Base from 'controllers/Base'
import { env } from 'process'
import { logLvl } from './constants'

const log = (msg: any): void => {
    if (logLvl === 'ALL') console.log(msg)
}

export const loop = ErrorMapper.wrapLoop(() => {
    // Initialize each room's AI
    for (const id in Game.rooms) {
        new Base(Game.rooms[id]).main()
    }
})

import 'extensions/Creep' // Extend the Screeps API
import Base from 'controllers/Base'

export const loop = () => {
    // Initialize each room's AI
    for (const id in Game.rooms) {
        new Base(Game.rooms[id]).main()
    }
}

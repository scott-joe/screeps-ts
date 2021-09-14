import 'extensions' // Extend Screeps classes
import Base from 'controllers/Base'

export const loop = () => {
    // Initialize each room's AI
    for (const id in Game.rooms) {
        new Base(Game.rooms[id]).main()
    }
}

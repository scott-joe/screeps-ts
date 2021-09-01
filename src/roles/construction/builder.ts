export default {
    run(creep: Creep): void {
        const constructionSites = creep.room.find(FIND_CONSTRUCTION_SITES)

        if (creep.store[RESOURCE_ENERGY] === 0) {
            const sources = creep.room.find(FIND_SOURCES)
            creep.say('🔄 harvest')
            if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {
                    visualizePathStyle: { stroke: '#ffaa00' }
                })
            }
        }
        if (
            constructionSites.length > 0 &&
            creep.store.getFreeCapacity() === 0
        ) {
            creep.say('🚧 build')
            if (creep.build(constructionSites[0]) === ERR_NOT_IN_RANGE) {
                creep.moveTo(constructionSites[0], {
                    visualizePathStyle: { stroke: '#ffffff' }
                })
            }
        }
        if (
            constructionSites.length === 0 &&
            creep.store.getFreeCapacity() === 0
        ) {
            creep.say('⚡ upgrade')
            if (creep.room.controller) {
                if (
                    creep.upgradeController(creep.room.controller) ===
                    ERR_NOT_IN_RANGE
                ) {
                    creep.moveTo(creep.room.controller, {
                        visualizePathStyle: { stroke: '#ffffff' }
                    })
                }
            }
        }

        if (creep.memory.building) {
            if (constructionSites.length) {
            }
        } else if (creep.memory.upgrading) {
        }
    }
}

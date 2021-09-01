export default {
    run(creep: Creep): void {
        const sites = creep.room.find(FIND_CONSTRUCTION_SITES)

        if (creep.store[RESOURCE_ENERGY] === 0) {
            const sources = creep.room.find(FIND_SOURCES)
            creep.say('🔄 harvest')
            if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {
                    visualizePathStyle: { stroke: '#ffaa00' }
                })
            }
        } else if (sites.length > 0 && creep.store.getFreeCapacity() === 0) {
            creep.say('🚧 build')
            if (creep.build(sites[0]) === ERR_NOT_IN_RANGE) {
                creep.moveTo(sites[0], {
                    visualizePathStyle: { stroke: '#ffffff' }
                })
            }
        } else if (sites.length === 0 && creep.store.getFreeCapacity() === 0) {
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
    }
}

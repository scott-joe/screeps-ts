export default {
    run(creep: Creep): void {
        const targets = creep.room.find(FIND_CONSTRUCTION_SITES)

        if (creep.store[RESOURCE_ENERGY] === 0) {
            creep.memory.building = false
            creep.say('🔄 harvest')
        }
        if (targets.length > 0 && creep.store.getFreeCapacity() === 0) {
            creep.memory.building = true
            creep.say('🚧 build')
        }
        if (targets.length === 0 && creep.store.getFreeCapacity() === 0) {
            creep.memory.upgrading = true
            creep.say('⚡ upgrade')
        }

        if (creep.memory.building) {
            if (targets.length) {
                if (creep.build(targets[0]) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {
                        visualizePathStyle: { stroke: '#ffffff' }
                    })
                }
            }
        } else if (creep.memory.upgrading) {
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
        } else {
            const sources = creep.room.find(FIND_SOURCES)
            if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {
                    visualizePathStyle: { stroke: '#ffaa00' }
                })
            }
        }
    }
}

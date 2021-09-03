import { Activity } from "types/main"

export default {
    run(creep: Creep) {
        if (creep.memory.activity === Activity.upgrading && creep.store[RESOURCE_ENERGY] === 0) {
            creep.memory.activity === Activity.upgrading = false
            creep.say('🔄 harvest')
        }
        if (!creep.memory.activity === Activity.upgrading && creep.store.getFreeCapacity() === 0) {
            creep.memory.activity === Activity.upgrading = true
            creep.say('⚡ upgrade')
        }

        if (creep.memory.activity === Activity.upgrading) {
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

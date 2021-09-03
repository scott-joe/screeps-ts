import { Activity } from "types/main"

export default {
    run(creep: Creep): void {
        const sites = creep.room.find(FIND_CONSTRUCTION_SITES)
        // TODO: IS RC FLASHING?, GO UPGRADE TO KEEP IT FROM FALLING RCL

        if (creep.store[RESOURCE_ENERGY] === 0) {
            creep.memory.activity = Activity.HARVEST
        } else if (creep.store[RESOURCE_ENERGY] === creep.store.getCapacity()) {
            if (sites.length > 0) {
                creep.memory.activity = Activity.BUILD
            } else {
                creep.memory.activity = Activity.UPGRADE
            }
        }

        if (creep.memory.activity === Activity.HARVEST) {
            const sources = creep.room.find(FIND_SOURCES)
            if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {
                    visualizePathStyle: { stroke: '#ffaa00' }
                })
            }
        } else if (creep.memory.activity === Activity.BUILD) {
            // creep.say('🚧 build')
            if (creep.build(sites[0]) === ERR_NOT_IN_RANGE) {
                creep.moveTo(sites[0], {
                    visualizePathStyle: { stroke: '#ffffff' }
                })
            }
        } else if (creep.memory.activity === Activity.UPGRADE) {
            // creep.say('⚡ upgrade')
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

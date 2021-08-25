export default {
    run(creep: Creep) {
        console.log(creep.store.getFreeCapacity())
        // If there's room, go harvest more
        if (creep.store.getFreeCapacity() > 0) {
            const sources = creep.room.find(FIND_SOURCES)
            if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {
                    visualizePathStyle: { stroke: '#ffaa00' }
                })
            }
            // return to the nearest strucuture capable of receiving energy
        } else {
            // get all strucutures capable of receiving energy
            const targets = creep.room.find(FIND_STRUCTURES, {
                filter: structure => {
                    return (
                        (structure.structureType === STRUCTURE_EXTENSION ||
                            structure.structureType === STRUCTURE_SPAWN ||
                            structure.structureType === STRUCTURE_TOWER) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                    )
                }
            })
            // if there are any, move there
            if (targets.length > 0) {
                if (
                    creep.transfer(targets[0], RESOURCE_ENERGY) ===
                    ERR_NOT_IN_RANGE
                ) {
                    creep.moveTo(targets[0], {
                        visualizePathStyle: { stroke: '#ffffff' }
                    })
                }
            }
        }
    }
}

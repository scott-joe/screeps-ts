export const findStructures = (creep: Creep): Array<AnyStructure> => {
    return creep.room.find(FIND_STRUCTURES, {
        filter: structure => {
            return (
                (structure.structureType === STRUCTURE_EXTENSION ||
                    structure.structureType === STRUCTURE_SPAWN ||
                    structure.structureType === STRUCTURE_TOWER) &&
                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
            )
        }
    })
}

export const harvest = (creep: Creep): void => {
    const sources = creep.room.find(FIND_SOURCES)
    if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[0], {
            visualizePathStyle: { stroke: '#ffaa00' }
        })
    }
}

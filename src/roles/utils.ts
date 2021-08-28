export const renew = (creep: Creep) => {
    const spawns = creep.room.find(FIND_MY_SPAWNS)
    if (spawns[0].renewCreep(creep) === ERR_NOT_IN_RANGE) {
        creep.moveTo(spawns[0], {
            visualizePathStyle: { stroke: '#ffaa00' }
        })
    }
}

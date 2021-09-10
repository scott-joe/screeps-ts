import { CreepActions } from "types/main"

Creep.prototype.energyFull = function () {
    return this.store[RESOURCE_ENERGY] === this.store.getCapacity(RESOURCE_ENERGY)
}

Creep.prototype.energyEmpty = function () {
    return this.store[RESOURCE_ENERGY] === 0
}

Creep.prototype.renew = function () {
    const spawn: StructureSpawn = this.pos.findClosestByPath(FIND_MY_SPAWNS, {
        filter: (item: StructureSpawn) => item.store.getUsedCapacity(RESOURCE_ENERGY) > 100
    })!

    if (spawn.renewCreep(this) === ERR_NOT_IN_RANGE) {
        this.moveTo(spawn, {
            visualizePathStyle: { stroke: '#ffaa00' }
        })
    }
}

import { minTTL } from '../constants'

Creep.prototype.energyFull = function () {
    return this.store[RESOURCE_ENERGY] === this.store.getCapacity(RESOURCE_ENERGY)
}

Creep.prototype.energyEmpty = function () {
    return this.store[RESOURCE_ENERGY] === 0
}

Creep.prototype.needsRenew = function () {
    return (
        // DOESN'T CONTAIN CLAIM BODY PART
        this.ticksToLive! <= minTTL
    )
}

Creep.prototype.renew = function (spawn: StructureSpawn) {
    if (spawn.renewCreep(this) === ERR_NOT_IN_RANGE) {
        this.moveTo(spawn, {
            visualizePathStyle: { stroke: '#ffaa00' }
        })
    }
}

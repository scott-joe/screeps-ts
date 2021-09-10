import { minTTL } from '../constants'
import { upgrade, harvest, transfer } from './utils'

// TODO: FIND BASED ON DIVISION[MILITARY|CIVILIAN]
// TODO: PRIORITIZE CONSTRUCTION
const transferTargetList: StructureConstant[] = [STRUCTURE_SPAWN, STRUCTURE_EXTENSION, STRUCTURE_CONTAINER, STRUCTURE_STORAGE]
const transferTargetFilter = (item: Structure) => {
    return (
        transferTargetList.includes(item.structureType)
        // @ts-ignore
        && (item.store.getFreeCapacity(RESOURCE_ENERGY) > 0)
    )
}

export default {
    run(creep: Creep) {
        // If about to die, go get renewed
        if (creep.ticksToLive! <= minTTL) {
            creep.renew()
        // If we're out of energy, go get more
        } else if (creep.store[RESOURCE_ENERGY] === 0) {
            harvest(creep)
        // If we're full on energy, use it
        } else if (creep.energyFull()) {
            // Find the things a Harvester creep would want to give energy to
            const transferTarget: Structure = creep.room.find(FIND_STRUCTURES, {filter: transferTargetFilter})[0]

            // If we have some sort of storage that needs energy
            if (transferTarget) {
                transfer(creep, transferTarget)
            // Help upgrade the controller
            } else {
                upgrade(creep, creep.room?.controller!)
            }
        }
    }
}

import { downgradeThreshold } from '../constants'
import { CreepActions } from 'types/main'

const { TRANSFER, HARVEST, UPGRADE } = CreepActions
type storageStructureType = StructureSpawn | StructureExtension | StructureContainer | StructureStorage

const getValidTransferTarget = (creep: Creep): storageStructureType | null => {
    const storageStructureTypeConsts: StructureConstant[] = [
        STRUCTURE_SPAWN,
        STRUCTURE_EXTENSION,
        STRUCTURE_CONTAINER,
        STRUCTURE_STORAGE
    ]
    // Filter down to just the few structure types we're looking for
    //  Bc not all structures have a .store prop, this is a 2 step filter
    const list: storageStructureType[] = creep.room.find(FIND_STRUCTURES, {
        filter: (structure: Structure): boolean => storageStructureTypeConsts.includes(structure.structureType)
    })
    // Filter down to just those with some open capacity
    // let transferTargets: storageStructureType[] = list.filter((item: storageStructureType) => item.store.getFreeCapacity(RESOURCE_ENERGY) > 0)
    const transferTarget: storageStructureType | undefined = list.find(
        item => item.store.getFreeCapacity(RESOURCE_ENERGY)! > 0
    )
    // Send the 1st result or null
    return !!transferTarget ? transferTarget : null
}

// The Transfer method is instant and complete, so we only have to
//  test to see if they're not full to see if they should gather more.
export default {
    run(creep: Creep) {
        const downgradeImminent = creep.room.controller?.ticksToDowngrade! <= downgradeThreshold
        // Get a transfer target or false if there are none
        const transferTarget = getValidTransferTarget(creep)
        // Handler for the controller
        const controller = creep.room?.controller!
        // Pull the creep's action or default to HARVEST
        let action = creep.memory.action || HARVEST

        if (action !== HARVEST && creep.energyEmpty()) {
            // If doing anything other than harvesting, and energy is empty,
            // go harvest
            action = HARVEST
        } else if (downgradeImminent && !creep.energyEmpty()) {
            // If controller is flashing and you're not empty,
            // go add some energy to the controller
            action = UPGRADE
        } else if (action === HARVEST && creep.energyFull()) {
            // If you're done harvesting,
            // go transfer it to a structure
            if (!!transferTarget) {
                // If you have a structure...
                action = TRANSFER
            } else {
                // Otherwise, upgrade the Controller
                action = UPGRADE
            }
        } else if (action === TRANSFER && !!!transferTarget) {
            // If you're ready to transfer but they're all full...
            // use it to upgrade the Controller
            action = UPGRADE
        }

        // Implement the above decided action
        if (action === UPGRADE) {
            creep.upgrade(controller)
        } else if (action === TRANSFER) {
            creep.transferEnergy(transferTarget!)
        } else if (action === HARVEST) {
            creep.harvestEnergy()
        } else {
            creep.upgrade(controller)
        }

        // Save the changed action into Memory
        creep.memory.action = action
    }
}

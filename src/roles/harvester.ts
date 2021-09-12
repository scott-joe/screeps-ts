import { downgradeThreshold } from '../constants'
import { harvest, transfer, upgrade } from 'roles/utils'
import { CreepActions } from 'types/main'

// TODO: FIND BASED ON DIVISION[MILITARY|CIVILIAN]
// TODO: PRIORITIZE CONSTRUCTION
type TransferTarget = StructureSpawn | StructureExtension | StructureContainer | StructureStorage
const { TRANSFER, HARVEST, UPGRADE } = CreepActions
const transferTargetList: StructureConstant[] = [
    STRUCTURE_SPAWN,
    STRUCTURE_EXTENSION,
    STRUCTURE_CONTAINER,
    STRUCTURE_STORAGE
]
const transferTargetFilter = (structure: Structure): boolean => {
    return transferTargetList.includes(structure.structureType)
    // && (structure.store && structure?.store?.getFreeCapacity(RESOURCE_ENERGY) > 0)
}

const storageFull = (transferTarget: TransferTarget): boolean => {
    return transferTarget.store.getFreeCapacity() === 0
}

// The Transfer method is instant and complete, so we only have to
//  test to see if they're not full to see if they should gather more.
export default {
    run(creep: Creep) {
        const downgradeImminent = creep.room.controller?.ticksToDowngrade! <= downgradeThreshold
        const transferTarget: TransferTarget = creep.room.find(FIND_STRUCTURES, {
            filter: transferTargetFilter
        })[0] as TransferTarget
        const controller = creep.room?.controller!
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
            // go build
            action = TRANSFER
        } else if (action === TRANSFER && storageFull(transferTarget)) {
            // If you're ready to transfer but they're all full...
            // use it to upgrade the Controller
            action = UPGRADE
        }

        // Implement the above decided action
        if (action === UPGRADE) {
            upgrade(creep, controller)
        } else if (action === TRANSFER && transferTarget) {
            transfer(creep, transferTarget)
        } else if (action === HARVEST) {
            harvest(creep)
        }

        // Save the changed action into Memory
        creep.memory.action = action
    }
}

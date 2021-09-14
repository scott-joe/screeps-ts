import { downgradeThreshold, minTTL } from '../constants'
import { CreepActions } from 'types/main'

const { BUILD, HARVEST, UPGRADE } = CreepActions

// The build method is not instant and complate, so we have to do some state mgmt
//  to manage the non-binary states between full and empty, but working.
export default {
    run(creep: Creep): void {
        // TODO: FIND BASED ON DIVISION[MILITARY|CIVILIAN]
        // TODO: PRIORITIZE CONSTRUCTION
        const constructionSite: ConstructionSite = creep.room.find(FIND_CONSTRUCTION_SITES)[0]
        const downgradeImminent = creep.room.controller?.ticksToDowngrade! <= downgradeThreshold
        const controller = creep.room?.controller!
        let action = creep.memory.action || HARVEST

        // Triggers to start doing something else
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
            action = BUILD
        }

        // Implement the above decided action
        if (action === UPGRADE) {
            creep.upgrade(controller)
        } else if (action === BUILD && constructionSite) {
            creep.buildConstructionSite(constructionSite)
        } else if (action === HARVEST) {
            creep.harvestEnergy()
        } else {
            creep.upgrade(controller)
        }

        // Save the changed action into Memory
        creep.memory.action = action
    }
}

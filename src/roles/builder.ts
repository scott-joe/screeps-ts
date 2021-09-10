import { downgradeThreshold, minTTL } from '../constants'
import { harvest, build, upgrade } from 'roles/utils'
import { CreepActions } from 'types/main'

const { BUILD, HARVEST, UPGRADE, RENEW } = CreepActions

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
        if (creep.ticksToLive! <= minTTL) {
            // If you're about to age out,
            // go get renewed at the neatest Spawn
            action = RENEW
        } else if (action !== HARVEST && creep.energyEmpty()) {
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
        if (action === RENEW){
            creep.renew()
        } else if (action === UPGRADE) {
            upgrade(creep, controller)
        } else if (action === BUILD && constructionSite) {
            build(creep, constructionSite)
        } else if (action === HARVEST) {
            harvest(creep)
        } else {
            upgrade(creep, controller)
        }

        // Save the changed action into Memory
        creep.memory.action = action
    }
}

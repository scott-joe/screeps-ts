import { downgradeThreshold, minTTL } from '../constants'
import { harvest, build, upgrade } from 'roles/utils'

export default {
    run(creep: Creep): void {
        // TODO: FIND BASED ON DIVISION[MILITARY|CIVILIAN]
        // TODO: PRIORITIZE CONSTRUCTION
        const constructionSite: ConstructionSite = creep.room.find(FIND_CONSTRUCTION_SITES)[0]

        // If about to die, go get renewed
        if (creep.ticksToLive! <= minTTL) {
            creep.renew()
            // If we're out of energy, go get more
        } else if (creep.store[RESOURCE_ENERGY] === 0) {
            harvest(creep)
            // If we're full on energy, use it
        } else if (creep.energyFull()) {
            const controllerFlashing = creep.room.controller?.ticksToDowngrade! <= downgradeThreshold

            // Is the RC about to drop a level?
            if (controllerFlashing) {
                // Go give the controller some energy
                upgrade(creep, creep.room?.controller!)
                // We have construction sites
            } else if (constructionSite) {
                // Build something
                build(creep, constructionSite)
            } else {
                // Upgrade controller
                upgrade(creep, creep.room?.controller!)
            }
        }
    }
}

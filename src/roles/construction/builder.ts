import { downgradeThreshold, minTTL } from '../../constants'
import { CreepActions } from 'types/main'
import { renew } from 'roles/utils'

export default {
    run(creep: Creep): void {
        const sites = creep.room.find(FIND_CONSTRUCTION_SITES)

        if (creep.store[RESOURCE_ENERGY] === 0) {
            creep.memory.activity = CreepActions.HARVEST
        } else if (creep.store[RESOURCE_ENERGY] === creep.store.getCapacity(RESOURCE_ENERGY)) {
            const needsUpgrade = creep.room.controller?.ticksToDowngrade!
            if (needsUpgrade <= downgradeThreshold) {
                // Is the RC about to drop a level?
                creep.memory.activity = CreepActions.MAINTAIN
            } else if (sites.length > 0) {
                // Build something
                creep.memory.activity = CreepActions.BUILD
            } else {
                // Upgrade the RC
                creep.memory.activity = CreepActions.MAINTAIN
            }
        }

        // If about to die, go get renewed
        if (creep.ticksToLive! <= minTTL) {
            renew(creep)
        }

        if (creep.memory.activity === CreepActions.HARVEST) {
            const sources = creep.room.find(FIND_SOURCES)
            if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {
                    visualizePathStyle: { stroke: '#ffaa00' }
                })
            }
        } else if (creep.memory.activity === CreepActions.BUILD) {
            if (creep.build(sites[0]) === ERR_NOT_IN_RANGE) {
                creep.moveTo(sites[0], {
                    visualizePathStyle: { stroke: '#ffffff' }
                })
            }
        } else if (creep.memory.activity === CreepActions.MAINTAIN) {
            if (creep.room.controller) {
                if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller, {
                        visualizePathStyle: { stroke: '#ffffff' }
                    })
                }
            }
        }
    }
}

import { minTTL } from '../../constants'
import builder from 'roles/construction/builder'
import { renew } from 'roles/utils'
import { findStructures, harvest } from './utils'

export default {
    run(creep: Creep) {
        // If there's room, harvest
        if (creep.store && creep.store.getFreeCapacity() > 0) {
            harvest(creep)
        } else {
            // get all strucutures capable of receiving energy
            const targets = findStructures(creep)

            // If about to die, go get renewed
            if (creep.ticksToLive! <= minTTL) {
                renew(creep)
            }

            // if there are any, move there
            if (targets.length !== 0) {
                const target = targets[0]
                // @ts-ignore
                if (target.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
                    if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, {
                            visualizePathStyle: { stroke: '#ffffff' }
                        })
                    }
                }
                // } else {
                //     // GO FIND SOMETHING TO BUILD
                //     builder.run(creep)
            }
        }
    }
}

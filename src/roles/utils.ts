// Harvest energy
export const harvest = (creep: Creep): void => {
    const source = creep.room.find(FIND_SOURCES)[0]
    if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
        creep.moveTo(source, {
            visualizePathStyle: { stroke: '#ffaa00' }
        })
    }
}

// Mine resources
export const mine = (creep: Creep): void => {
    const sources = creep.room.find(FIND_MINERALS)
    if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[0], {
            visualizePathStyle: { stroke: '#ffaa00' }
        })
    }
}

// Collect commodity from a deposit
export const extract = (creep: Creep): void => {
    const sources = creep.room.find(FIND_DEPOSITS)
    if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[0], {
            visualizePathStyle: { stroke: '#ffaa00' }
        })
    }
}

// Transfer resources to target
export const transfer = (creep: Creep, target: Structure): void => {
    // @ts-ignore
    if (target.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
        if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {
                visualizePathStyle: { stroke: '#ffffff' }
            })
        }
    }
}

// Upgrade room controller
export const upgrade = (creep: Creep, controller: StructureController): void => {
    if (creep.upgradeController(controller) === ERR_NOT_IN_RANGE) {
        creep.moveTo(controller, {
            visualizePathStyle: { stroke: '#ffffff' }
        })
    }
}

// Repair damaged structure
export const repair = (creep: Creep, target: Structure): void => {
    // @ts-ignore
    if (target.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
        if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {
                visualizePathStyle: { stroke: '#ffffff' }
            })
        }
    }
}

// Build construction site
export const build = (creep: Creep, constructionSite: ConstructionSite): void => {
    if (creep.build(constructionSite) === ERR_NOT_IN_RANGE) {
        creep.moveTo(constructionSite, {
            visualizePathStyle: { stroke: '#ffffff' }
        })
    }
}

// TODO: PRIORITIZE WHICH STRUCTURES GET ENERGY FIRST
// export const findDecayingStructures = (creep: Creep, structures: Structure[]): Array<Structure> => {
// }

// TODO: PRIORITIZE WHICH STRUCTURES GET ENERGY FIRST
// export const findDamagedStructures = (creep:Creep): Array<Structure> => {
// }

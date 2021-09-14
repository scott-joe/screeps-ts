import { minTTL } from '../constants'

const visOrange = {
    visualizePathStyle: { stroke: '#ffaa00' }
}
const visWhite = {
    visualizePathStyle: { stroke: '#ffffff' }
}

Creep.prototype.energyFull = function (): boolean {
    return this.store[RESOURCE_ENERGY] === this.store.getCapacity(RESOURCE_ENERGY)
}

Creep.prototype.energyEmpty = function (): boolean {
    return this.store[RESOURCE_ENERGY] === 0
}

Creep.prototype.needsRenew = function (): boolean {
    return (
        // DOESN'T CONTAIN CLAIM BODY PART
        this.ticksToLive! <= minTTL
    )
}

Creep.prototype.renew = function (spawn: StructureSpawn): void {
    if (spawn.renewCreep(this) === ERR_NOT_IN_RANGE) {
        this.moveTo(spawn, visOrange)
    }
}

// Pick up energy from sources, tombstones, or the ground
Creep.prototype.harvestEnergy = function (): void {
    const droppedResources: Resource = this.room.find(FIND_DROPPED_RESOURCES)[0]
    const tombestone: Tombstone = this.room.find(FIND_TOMBSTONES)[0]

    if (droppedResources) {
        if (this.pickup(droppedResources) === ERR_NOT_IN_RANGE) {
            this.moveTo(droppedResources, visOrange)
        }
    } else if (tombestone) {
        if(this.withdraw(tombestone, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            this.moveTo(tombestone);
        }
    } else {
        const energySource: Source = this.room.find(FIND_SOURCES)[0]
        if (this.harvest(energySource) === ERR_NOT_IN_RANGE) {
            this.moveTo(energySource, visOrange)
        }
    }
}

// Mine resources
Creep.prototype.mine = function (): void {
    const sources = this.room.find(FIND_MINERALS)
    if (this.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
        this.moveTo(sources[0], visOrange)
    }
}

// Collect commodity from a deposit
Creep.prototype.extract = function (): void {
    const sources = this.room.find(FIND_DEPOSITS)
    if (this.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
        this.moveTo(sources[0], visOrange)
    }
}

// Transfer resources to target
Creep.prototype.transferEnergy = function (target: Structure): void {
    // @ts-ignore
    if (target.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
        if (this.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            this.moveTo(target, visWhite)
        }
    }
}

// Upgrade room controller
Creep.prototype.upgrade = function (controller: StructureController): void {
    if (this.upgradeController(controller) === ERR_NOT_IN_RANGE) {
        this.moveTo(controller, visWhite)
    }
}

// Repair damaged structure
// Creep.prototype.repair = function (target: Structure): void {
//     // @ts-ignore
//     if (target.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
//         if (this.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
//             this.moveTo(target, visWhite)
//         }
//     }
// }

// Build construction site
Creep.prototype.buildConstructionSite = function (constructionSite: ConstructionSite): void {
    if (this.build(constructionSite) === ERR_NOT_IN_RANGE) {
        this.moveTo(constructionSite, visWhite)
    }
}

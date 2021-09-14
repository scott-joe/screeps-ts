import { Position } from 'source-map'
import { minTTL } from '../constants'

const visOrange = {
    reusePath: 30,
    serializeMemory: true,
    visualizePathStyle: { stroke: '#ffaa00' }
}
const visWhite = {
    reusePath: 30,
    serializeMemory: true,
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
    const tombstone: Tombstone = this.room.find(FIND_TOMBSTONES)[0]
    const tombstoneHasEnergy: boolean = tombstone?.store.getUsedCapacity(RESOURCE_ENERGY) > 0 || false

    if (droppedResources) {
        // If there are dropped resources in the room, get it
        if (this.pickup(droppedResources) === ERR_NOT_IN_RANGE) {
            this.moveTo(droppedResources, visOrange)
        }
    } else if (tombstoneHasEnergy) {
        // If there's a tombstone out there with energy, get it
        if (this.withdraw(tombstone, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            this.moveTo(tombstone)
        }
    } else {
        // Get energy from the nearest energy source
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
        this.moveTo(controller, visOrange)

        // const destination = controller // TEMPORARY FOR ABSTRACTION
        // LOOK FOR PATH IN MEMORY
        // let path: PathSegment[] | undefined = this.memory?.path || undefined
        // const pathEnd: PathSegment = path && path[path?.length - 1]

        // // Check to see if the XY of the stored path isn't the same as the provided target
        // //  if they are different, the stored path is bad and needs to be rebuilt
        // if (!!path || !destination.pos.isEqualTo(pathEnd)) {
        //     // IF NO, GET ONE
        //     // creep.moveByPath(path);
        //     this.pos.findPathTo(destination.pos, {
        //         maxOps: 200,
        //         ignoreCreeps: true,
        //         maxRooms: 1, // only if in simulator?
        //         // ignoreRoads: false // Pathfinder only
        //     })

        //     // THEN STORE IT IN MEMORY
        //     this.memory.path = Room.serializePath(path);
        // }
        // if (path.length) {
        //     // IF YES, USE IT
        //     this.moveByPath(path)
        // }
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

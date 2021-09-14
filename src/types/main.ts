import { CensusRecords } from 'controllers/Census'

export enum CreepRole {
    HARVESTER = 'HARVESTER',
    BUILDER = 'BUILDER',
    MECHANIC = 'MECHANIC',
    GRUNT = 'GRUNT',
    RANGER = 'RANGER',
    MEDIC = 'MEDIC',
    SCOUT = 'SCOUT'
}

export enum CreepActions {
    BASE = 'BASE',
    TRANSFER = 'TRANSFER',
    RENEW = 'RENEW',
    UPGRADE = 'UPGRADE',
    HARVEST = 'HARVEST',
    BUILD = 'BUILD',
    MAINTAIN = 'MAINTAIN',
    FIGHT = 'FIGHT',
    SHOOT = 'SHOOT',
    HEAL = 'HEAL',
    SCOUT = 'SCOUT',
    RUN = 'RUN',
    IDLE = 'IDLE'
}

// export type ICensus = {
//     [x: string]: CensusStatus
// }

// TODO: USE THIS?
export enum Division {
    DEFENSE = 'DEFENSE',
    CIVILIAN = 'CIVILIAN'
}

// TODO: USE THIS?
// export enum Strategy {
//     RAID = 'RAID',
//     CLOISTER = 'CLOISTER',
//     ENTERPRISE = 'ENTERPRISE'
// }

// TODO: USE THIS?
// export enum RecipeSort {
//     STRIPED = 'STRIPED',
//     FLAT = 'FLAT'
// }

export type CreepTemplateList = {
    [property in CreepRole]: BodyPartConstant[]
}

// TODO: USE THIS?
// export type MaintenanceTargetList = {
//     [property in Division]: StructureConstant[]
// }

declare global {
    /*
      Example types, expand on these or remove them and add your own.
      Note: Values, properties defined here do not fully *exist* by this type definiton alone.
            You must also give them an implemention if you would like to use them. (ex. actually setting a `role` property in a Creeps memory)

      Types added in this `global` block are in an ambient, global context. This is needed because `main.ts` is a module file (uses import or export).
      Interfaces matching on name from @types/screeps will be merged. This is how you can extend the 'built-in' interfaces from @types/screeps.
    */
    // Memory extension samples
    interface Memory {
        uuid: number
        log: any
    }

    interface CreepMemory {
        room?: string
        role: CreepRole
        division?: Division
        action?: CreepActions
    }

    interface Creep {
        energyFull: Function
        energyEmpty: Function
        renew: Function
        needsRenew: Function
        harvestEnergy: Function
        mine: Function
        extract: Function
        transferEnergy: Function
        upgrade: Function
        buildConstructionSite: Function
    }

    interface StructureSpawn {
        isSpawning: Function
    }

    interface RoomMemory {
        census: CensusRecords
        spawnQueue: CreepRole[]
        controllerLevel: number
    }

    interface Room {
        base: Function
        size: number
        spawnThatCanRenew: Function
    }

    // Syntax for adding proprties to `global` (ex "global.log")
    namespace NodeJS {
        interface Global {
            log: any
        }
    }
}

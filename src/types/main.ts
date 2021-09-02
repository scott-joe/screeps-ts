export type CensusStatus = {
    min: number
    cur: number
}

export enum CreepRole {
    HARVESTER = 'HARVESTER',
    BUILDER = 'BUILDER',
    SOLDIER = 'SOLDIER'
}

export enum Activity {
    HARVEST = 'HARVEST',
    BUILD = 'BUILD',
    UPGRADE = 'UPGRADE'
}
export interface Census {
    [x: string]: CensusStatus
}

export enum Division {
    CONSTRUCTION = 'CONSTRUCTION',
    DEFENSE = 'DEFENSE',
    OPERATIONS = 'OPERATIONS',
    RESOURCES = 'RESOURCES'
}

export enum Strategy {
    RAID = 'RAID',
    CLOISTER = 'CLOISTER',
    ENTERPRISE = 'ENTERPRISE'
}

export enum Size {
    ZERO = 'ZERO',
    SMALL = 'SMALL',
    MEDIUM = 'MEDIUM',
    LARGE = 'LARGE'
}

export type CreepRecipe = {
    [property in CreepRole]: {
        [property in Size]: Array<BodyPartConstant>
    }
}

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
        activity?: Activity
    }

    interface Creep {
        renew: Function
    }

    interface RoomMemory {
        census: { [x: string]: { min: number; cur: number } }
        spawnQueue: CreepRole[]
        creepId: number
    }

    interface Room {
        base: Function
        size: number
    }

    // Syntax for adding proprties to `global` (ex "global.log")
    namespace NodeJS {
        interface Global {
            log: any
        }
    }
}

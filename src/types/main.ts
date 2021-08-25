export type CensusStatus = {
    min: number
    cur: number
}

export enum CreepRole {
    HARVESTER = 'HARVESTER',
    BUILDER = 'BUILDER',
    UPGRADER = 'UPGRADER',
    SOLDIER = 'SOLDIER'
}

// export type Census = {
//     [property in CreepRole]: CensusStatus
// }

export interface Census {
	[x: string]: { min: number, cur: number }
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
    SM = 'SM',
    MED = 'MED',
    LG = 'LG'
}

export type CreepRecipe = {
    [property in CreepRole]: {
        [property in Size]: Array<BodyPartConstant>
    }
}

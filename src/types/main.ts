export type CensusStatus = {
    min: number
    cur: number
}

export enum CreepRole {
    HARVESTER = 'HARVESTER',
    BUILDER = 'BUILDER',
    SOLDIER = 'SOLDIER'
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

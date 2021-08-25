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

export interface Census {
    HARVESTER: CensusStatus
    BUILDER: CensusStatus
    UPGRADER: CensusStatus
    SOLDIER: CensusStatus
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

import { CreepTemplateList, Census } from 'types/main'

export const minTTL = 500

export const censusDefaults: Census = {
    HARVESTER: { min: 2, cur: 0 },
    BUILDER: { min: 4, cur: 0 },
    SOLDIER: { min: 0, cur: 0 }
}

export const creepTemplates: CreepTemplateList = {
    HARVESTER: {
        SMALL: [WORK, WORK, CARRY, MOVE],
        MEDIUM: [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE],
        LARGE: [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE]
    },
    BUILDER: {
        SMALL: [WORK, WORK, CARRY, MOVE],
        MEDIUM: [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE],
        LARGE: [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE]
    },
    UPGRADER: {
        SMALL: [WORK, WORK, CARRY, MOVE],
        MEDIUM: [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE],
        LARGE: [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE]
    },
    SOLDIER: {
        SMALL: [HEAL, MOVE, TOUGH, MOVE, ATTACK],
        MEDIUM: [HEAL, MOVE, TOUGH, MOVE, ATTACK, ATTACK],
        LARGE: [HEAL, TOUGH, TOUGH, MOVE, MOVE, MOVE, ATTACK, ATTACK]
    }
}

export const partCost: {
    [property in BodyPartConstant]: number
} = {
    move: 50,
    work: 100,
    carry: 50,
    attack: 80,
    ranged_attack: 150,
    tough: 10,
    heal: 250,
    claim: 600
}


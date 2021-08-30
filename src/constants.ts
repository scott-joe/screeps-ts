import { CreepRecipe, Census, Size } from 'types/main'

export const minTTL = 500
export const minEnergy = 300

export const censusConfig: Census = {
    HARVESTER: { min: 2, cur: 0 },
    BUILDER: { min: 4, cur: 0 },
    UPGRADER: { min: 0, cur: 0 },
    SOLDIER: { min: 0, cur: 0 },
}

export const creepRecipes: CreepRecipe = {
    HARVESTER: {
        ZERO: [],
        SMALL: [WORK, CARRY, MOVE],
        MEDIUM: [WORK, WORK, CARRY, CARRY, MOVE, MOVE],
        LARGE: [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE]
    },
    BUILDER: {
        ZERO: [],
        SMALL: [WORK, CARRY, MOVE],
        MEDIUM: [WORK, WORK, WORK, CARRY, CARRY, MOVE],
        LARGE: [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE]
    },
    UPGRADER: {
        ZERO: [],
        SMALL: [WORK, CARRY, MOVE],
        MEDIUM: [WORK, WORK, CARRY, CARRY, MOVE, MOVE],
        LARGE: [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE]
    },
    SOLDIER: {
        ZERO: [],
        SMALL: [HEAL, MOVE, TOUGH, MOVE, ATTACK],
        MEDIUM: [HEAL, MOVE, TOUGH, MOVE, ATTACK, ATTACK],
        LARGE: [HEAL, TOUGH, TOUGH, MOVE, MOVE, MOVE, ATTACK, ATTACK]
    }
}

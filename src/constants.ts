import { CreepRecipe, Size } from 'types/main'

export const creepSize = Size.SM
export const minEnergy = 300

export const censusConfig = {
    HARVESTER: { min: 3, cur: 0 },
    BUILDER: { min: 2, cur: 0 },
    UPGRADER: { min: 1, cur: 0 },
    SOLDIER: { min: 1, cur: 0 }
}

export const creepRecipes: CreepRecipe = {
    HARVESTER: {
        SM: [WORK, CARRY, MOVE],
        MED: [WORK, WORK, CARRY, CARRY, MOVE, MOVE],
        LG: [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE]
    },
    BUILDER: {
        SM: [WORK, CARRY, MOVE],
        MED: [WORK, WORK, WORK, CARRY, CARRY, MOVE],
        LG: [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE]
    },
    UPGRADER: {
        SM: [WORK, CARRY, MOVE],
        MED: [WORK, WORK, CARRY, CARRY, MOVE, MOVE],
        LG: [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE]
    },
    SOLDIER: {
        SM: [HEAL, TOUGH, MOVE, MOVE, ATTACK],
        MED: [HEAL, TOUGH, MOVE, MOVE, ATTACK, ATTACK],
        LG: [HEAL, TOUGH, TOUGH, MOVE, MOVE, MOVE, ATTACK, ATTACK]
    }
}

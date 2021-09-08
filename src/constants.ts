import { CreepTemplateList, Census, RecipeStyle } from 'types/main'

export const minTTL = 500
export const downgradeThreshold = 5000
export const recipeStyle = RecipeStyle.STRIPED

export const censusDefaults: Census = {
    HARVESTER: { min: 2, cur: 0, unlock: 1 },
    BUILDER: { min: 4, cur: 0, unlock: 1 },
    SOLDIER: { min: 0, cur: 0, unlock: 3 }
}

// TODO: CREEPS ARE BUILDING WITH JUST 4 PARTS FOR SOME REASON
// TODO: COMPLETE THIS IDEA ABOUT COMBINING CATEGORIES OF ACTIONS FOR EACH LEVEL OF CREEP?

// TODO: CHANGE THESE TO BE A SET OF TYPES
//  LIKE, A RANGER IS A WARRIOR AND A WARRIOR AND AN ARCHER
//  SO CONCAT THOSE ROLES AND ADD THEM TO THE RECIPE
export const creepActions = {
    BASE: [MOVE],
    HARVEST: [WORK, CARRY],
    BUILD: [WORK, CARRY],
    MAINTAIN: [WORK, CARRY],
    FIGHT: [TOUGH, ATTACK],
    SHOOT: [TOUGH, RANGED_ATTACK],
    HEAL: [HEAL, HEAL],
    SCOUT: [CLAIM, MOVE, MOVE, MOVE],
    RUN: [MOVE, MOVE, MOVE]
}

export const creepTemplates: CreepTemplateList = {
    HARVESTER: {
        SMALL: [creepActions.BASE, creepActions.HARVEST],
        MEDIUM: [creepActions.BASE, creepActions.HARVEST],
        LARGE: [creepActions.BASE, creepActions.HARVEST]
    },
    BUILDER: {
        SMALL: [WORK, CARRY, MOVE],
        MEDIUM: [WORK, CARRY, MOVE],
        LARGE: [WORK, CARRY, MOVE]
    },
    MAINTAINER: {
        SMALL: [WORK, CARRY, MOVE],
        MEDIUM: [WORK, CARRY, MOVE],
        LARGE: [WORK, CARRY, MOVE]
    },
    SOLDIER: {
        SMALL: [HEAL, MOVE, TOUGH, MOVE, ATTACK],
        MEDIUM: [HEAL, MOVE, TOUGH, MOVE, ATTACK, ATTACK],
        LARGE: [HEAL, TOUGH, TOUGH, MOVE, MOVE, MOVE, ATTACK, ATTACK]
    }
}

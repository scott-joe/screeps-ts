import { CreepTemplateList } from 'types/main'

export const logLvl: string = 'ALL'
export const minTTL = 500
export const downgradeThreshold = 5000
// export const recipeStyle = RecipeSort.STRIPED

export const creepTemplates: CreepTemplateList = {
    HARVESTER: [WORK, CARRY, MOVE],
    BUILDER: [WORK, CARRY, MOVE],
    MECHANIC: [WORK, CARRY, MOVE],
    GRUNT: [TOUGH, TOUGH, ATTACK, MOVE],
    RANGER: [TOUGH, RANGED_ATTACK, MOVE],
    MEDIC: [HEAL, MOVE],
    SCOUT: [CLAIM, MOVE]
}

// export const maintenanceTargetList: MaintenanceTargetList = {
//     DEFENSE: [STRUCTURE_TOWER, STRUCTURE_RAMPART],
//     CIVILIAN: [STRUCTURE_ROAD, STRUCTURE_CONTAINER, STRUCTURE_EXTENSION, STRUCTURE_STORAGE]
// }

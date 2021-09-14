// Comparison by which to decide to add the creep role to the queue
export const isEqual = (unlockLevel: number, controllerLevel: number): boolean => {
    return controllerLevel === unlockLevel
}
// Make sure the Base has a spawn queue
export const isGtOrEqual = (unlockLevel: number, controllerLevel: number): boolean => {
    return controllerLevel >= unlockLevel
}

// var energyAvailable = 0;
// energyAvailable += Game.spawns.Spawn1.energy;
// _.filter(Game.structures, function(structure){
//     if (structure.structureType == STRUCTURE_EXTENSION){
//         energyAvailable += structure.energy;
//     }
// });

// private rebuildCensus(): void {
//     const census = censusDefaults

//     for (const name in Memory.creeps) {
//         const role: CreepRole = Game.creeps[name].memory.role
//         census[role].cur++
//     }

//     this.census = census
// }

// const structures: { [structureName: string]: Structure } = Game.structures
// Towers do tower things, and so on
// for (const id in structures) {
//     const structure: Structure = structures[id]
//
//     switch (structure.structureType) {
//         case STRUCTURE_TOWER:
//             guard.run(structure)
//             break
//         default:
//             break
//     }
// }

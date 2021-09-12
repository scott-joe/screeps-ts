// import { spawn } from 'child_process'

// Room.prototype.spawnThatCanRenew = function (creep: Creep): StructureSpawn | null {
//     // Call creep.getBody()
//     const bodySize = 1
//     // Call creep.getCost()
//     const creepCost = 1
//     const costToRenew = Math.ceil(creepCost / 2.5 / bodySize)
//     return creep.pos.findClosestByPath(FIND_MY_SPAWNS, {
//         filter: (item: StructureSpawn) => {
//             return item.store.getUsedCapacity(RESOURCE_ENERGY) >= costToRenew && !item.spawning
//         }
//     })!
// }

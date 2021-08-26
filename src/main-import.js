var roleHarvester = require('role.harvester')
var roleUpgrader = require('role.upgrader')
var roleBuilder = require('role.builder')

module.exports.loop = function () {
    // var targets = creep.room.find(FIND_STRUCTURES, {
    //         filter: (structure) => {
    //             return (structure.structureType === STRUCTURE_EXTENSION ||
    //                     structure.structureType === STRUCTURE_SPAWN ||
    //                     structure.structureType === STRUCTURE_TOWER) &&
    //                     structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
    //         }
    // });

    // var towers = Game.structures.filter((item) => { item.structureType === 'tower'})
    // var spawns = Game.structures.filter((item) => { item.structureType === 'spawn'})
    // var controller = Game.structures.filter((item) => { item.structureType === 'controller'})

    // for (var tower in towers) {
    //     var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
    //         filter: (structure) => structure.hits < structure.hitsMax
    //     });
    //     if(closestDamagedStructure) {
    //         tower.repair(closestDamagedStructure);
    //     }

    //     if(tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS)) {
    //         tower.attack(closestHostile);
    //     }
    // }

    if (Game.spawns['spawn-1'].spawning) {
        var spawningCreep = Game.creeps[Game.spawns['spawn-1'].spawning.name]
        Game.spawns['spawn-1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['spawn-1'].pos.x + 1,
            Game.spawns['spawn-1'].pos.y,
            { align: 'left', opacity: 0.8 }
        )
    } else if (
        Game.spawns['spawn-1'].structure.store.getFreeCapacity(
            RESOURCE_ENERGY
        ) === 0
    ) {
        if (harvesters < harvestersNeeded) {
            var newName = 'Harvester' + Game.time
            console.log('Spawning new harvester: ' + newName)
            Game.spawns['spawn-1'].spawnCreep(
                [WORK, CARRY, CARRY, MOVE],
                newName,
                { memory: { role: 'harvester' } }
            )
        } else if (builders < buildersNeeded) {
            var newName = 'Builder' + Game.time
            console.log('Spawning new builder: ' + newName)
            Game.spawns['spawn-1'].spawnCreep(
                [WORK, WORK, CARRY, MOVE],
                newName,
                { memory: { role: 'builder' } }
            )
        } else if (upgraders < upgradersNeeded) {
            var newName = 'Upgrader' + Game.time
            console.log('Spawning new upgrader: ' + newName)
            Game.spawns['spawn-1'].spawnCreep([WORK, CARRY, MOVE], newName, {
                memory: { role: 'upgrader' }
            })
        }
    }
}

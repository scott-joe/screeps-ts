'use strict';Object.defineProperty(exports,'__esModule',{value:true});Creep.prototype.energyFull = function () {
    return this.store[RESOURCE_ENERGY] === this.store.getCapacity(RESOURCE_ENERGY);
};
Creep.prototype.energyEmpty = function () {
    return this.store[RESOURCE_ENERGY] === 0;
};
Creep.prototype.renew = function () {
    const spawn = this.pos.findClosestByPath(FIND_MY_SPAWNS, {
        filter: (item) => item.store.getUsedCapacity(RESOURCE_ENERGY) > 100
    });
    if (spawn.renewCreep(this) === ERR_NOT_IN_RANGE) {
        this.moveTo(spawn, {
            visualizePathStyle: { stroke: '#ffaa00' }
        });
    }
};const minTTL = 500;
const downgradeThreshold = 5000;
const censusDefaults = {
    HARVESTER: { min: 2, cur: 0, unlock: 1 },
    BUILDER: { min: 4, cur: 0, unlock: 1 },
    MECHANIC: { min: 1, cur: 0, unlock: 2 },
    GRUNT: { min: 2, cur: 0, unlock: 3 },
    RANGER: { min: 2, cur: 0, unlock: 3 },
    MEDIC: { min: 1, cur: 0, unlock: 3 },
    SCOUT: { min: 1, cur: 0, unlock: 4 }
};
const creepTemplates = {
    HARVESTER: [WORK, CARRY, MOVE],
    BUILDER: [WORK, CARRY, MOVE],
    MECHANIC: [WORK, CARRY, MOVE],
    GRUNT: [TOUGH, TOUGH, ATTACK, MOVE],
    RANGER: [TOUGH, RANGED_ATTACK, MOVE],
    MEDIC: [HEAL, MOVE],
    SCOUT: [CLAIM, MOVE]
};const harvest = (creep) => {
    const source = creep.room.find(FIND_SOURCES)[0];
    if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
        creep.moveTo(source, {
            visualizePathStyle: { stroke: '#ffaa00' }
        });
    }
};
const transfer = (creep, target) => {
    if (target.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
        if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {
                visualizePathStyle: { stroke: '#ffffff' }
            });
        }
    }
};
const upgrade = (creep, controller) => {
    if (creep.upgradeController(controller) === ERR_NOT_IN_RANGE) {
        creep.moveTo(controller, {
            visualizePathStyle: { stroke: '#ffffff' }
        });
    }
};
const build = (creep, constructionSite) => {
    if (creep.build(constructionSite) === ERR_NOT_IN_RANGE) {
        creep.moveTo(constructionSite, {
            visualizePathStyle: { stroke: '#ffffff' }
        });
    }
};var CreepRole;
(function (CreepRole) {
    CreepRole["HARVESTER"] = "HARVESTER";
    CreepRole["BUILDER"] = "BUILDER";
    CreepRole["MECHANIC"] = "MECHANIC";
    CreepRole["GRUNT"] = "GRUNT";
    CreepRole["RANGER"] = "RANGER";
    CreepRole["MEDIC"] = "MEDIC";
    CreepRole["SCOUT"] = "SCOUT";
})(CreepRole || (CreepRole = {}));
var CreepActions;
(function (CreepActions) {
    CreepActions["BASE"] = "BASE";
    CreepActions["TRANSFER"] = "TRANSFER";
    CreepActions["RENEW"] = "RENEW";
    CreepActions["UPGRADE"] = "UPGRADE";
    CreepActions["HARVEST"] = "HARVEST";
    CreepActions["BUILD"] = "BUILD";
    CreepActions["MAINTAIN"] = "MAINTAIN";
    CreepActions["FIGHT"] = "FIGHT";
    CreepActions["SHOOT"] = "SHOOT";
    CreepActions["HEAL"] = "HEAL";
    CreepActions["SCOUT"] = "SCOUT";
    CreepActions["RUN"] = "RUN";
    CreepActions["IDLE"] = "IDLE";
})(CreepActions || (CreepActions = {}));
var Division;
(function (Division) {
    Division["DEFENSE"] = "DEFENSE";
    Division["CIVILIAN"] = "CIVILIAN";
})(Division || (Division = {}));
var Strategy;
(function (Strategy) {
    Strategy["RAID"] = "RAID";
    Strategy["CLOISTER"] = "CLOISTER";
    Strategy["ENTERPRISE"] = "ENTERPRISE";
})(Strategy || (Strategy = {}));
var RecipeSort;
(function (RecipeSort) {
    RecipeSort["STRIPED"] = "STRIPED";
    RecipeSort["FLAT"] = "FLAT";
})(RecipeSort || (RecipeSort = {}));const { BUILD, HARVEST: HARVEST$1, UPGRADE: UPGRADE$1, RENEW: RENEW$1 } = CreepActions;
var builder = {
    run(creep) {
        var _a, _b;
        const constructionSite = creep.room.find(FIND_CONSTRUCTION_SITES)[0];
        const downgradeImminent = ((_a = creep.room.controller) === null || _a === void 0 ? void 0 : _a.ticksToDowngrade) <= downgradeThreshold;
        const controller = (_b = creep.room) === null || _b === void 0 ? void 0 : _b.controller;
        let action = creep.memory.action || HARVEST$1;
        if (creep.ticksToLive <= minTTL) {
            action = RENEW$1;
        }
        else if (action !== HARVEST$1 && creep.energyEmpty()) {
            action = HARVEST$1;
        }
        else if (downgradeImminent && !creep.energyEmpty()) {
            action = UPGRADE$1;
        }
        else if (action === HARVEST$1 && creep.energyFull()) {
            action = BUILD;
        }
        if (action === RENEW$1) {
            creep.renew();
        }
        else if (action === UPGRADE$1) {
            upgrade(creep, controller);
        }
        else if (action === BUILD && constructionSite) {
            build(creep, constructionSite);
        }
        else if (action === HARVEST$1) {
            harvest(creep);
        }
        else {
            upgrade(creep, controller);
        }
        creep.memory.action = action;
    }
};const { TRANSFER, HARVEST, UPGRADE, RENEW } = CreepActions;
const transferTargetList = [
    STRUCTURE_SPAWN,
    STRUCTURE_EXTENSION,
    STRUCTURE_CONTAINER,
    STRUCTURE_STORAGE
];
const transferTargetFilter = (structure) => {
    return (transferTargetList.includes(structure.structureType)
    );
};
var harvester = {
    run(creep) {
        var _a, _b;
        const transferTarget = creep.room.find(FIND_STRUCTURES, { filter: transferTargetFilter })[0];
        const downgradeImminent = ((_a = creep.room.controller) === null || _a === void 0 ? void 0 : _a.ticksToDowngrade) <= downgradeThreshold;
        const controller = (_b = creep.room) === null || _b === void 0 ? void 0 : _b.controller;
        let action = creep.memory.action || HARVEST;
        if (creep.ticksToLive <= minTTL) {
            action = RENEW;
        }
        else if (action !== HARVEST && creep.energyEmpty()) {
            action = HARVEST;
        }
        else if (downgradeImminent && !creep.energyEmpty()) {
            action = UPGRADE;
        }
        else if (action === HARVEST && creep.energyFull()) {
            action = TRANSFER;
        }
        else {
            action = HARVEST;
        }
        if (action === RENEW) {
            creep.renew();
        }
        else if (action === UPGRADE) {
            upgrade(creep, controller);
        }
        else if (action === TRANSFER && transferTarget) {
            transfer(creep, transferTarget);
        }
        else if (action === HARVEST) {
            harvest(creep);
        }
        else {
            upgrade(creep, controller);
        }
        creep.memory.action = action;
    }
};class Garrison {
    constructor(spawn) {
        this.spawn = spawn;
        this.energyAvailable = spawn.room.energyAvailable;
        this.energyCapacity = spawn.room.energyCapacityAvailable;
    }
    generateCreepRecipe(template, energy) {
        let parts = [];
        while (energy > 0 && parts.length < 50) {
            let next = template[parts.length % template.length];
            if (BODYPART_COST[next] > energy) {
                const start = template.indexOf(next) + 1;
                const remainingTemplate = template.slice(start, template.length);
                if (remainingTemplate.length > 0) {
                    const result = this.generateCreepRecipe(remainingTemplate, energy);
                    parts = parts.concat(result);
                }
                energy -= energy;
            }
            else {
                energy -= BODYPART_COST[next];
                parts.push(next);
            }
        }
        return parts;
    }
    spawnCreep(role) {
        const name = `${role}-${Game.time}`;
        const template = creepTemplates[role];
        const body = this.generateCreepRecipe(template, this.spawn.room.energyAvailable);
        const result = this.spawn.spawnCreep(body, name, {
            memory: { role }
        });
        return result === 0 ? true : false;
    }
    generateSpawnQueue(census, controllerLevel, condition) {
        const output = [];
        for (const roleId in census) {
            const cfg = census[roleId];
            const role = roleId;
            if (condition(cfg.unlock, controllerLevel)) {
                for (let i = 1; i <= cfg.min; i++) {
                    output.push(role);
                }
            }
        }
        return output;
    }
    shouldSpawn(role, census) {
        const haveRoom = census[role].cur < census[role].min;
        const atFullEnergy = this.energyAvailable === this.energyCapacity;
        return haveRoom && atFullEnergy;
    }
    recruit(role, census, spawnQueue) {
        if (this.shouldSpawn(role, census)) {
            const result = this.spawnCreep(role);
            if (result) {
                console.log(`🟢 Successfully spawned ${role}`);
                spawnQueue.shift();
                census[role].cur += 1;
            }
            else {
                console.log(`🔴 Spawning error ${result} for ${role}`);
            }
            return result;
        }
        else {
            return false;
        }
    }
}class Base {
    constructor(room) {
        var _a;
        this.room = room;
        this.spawns = this.room.find(FIND_MY_SPAWNS);
        this.memory = this.room.memory;
        this.spawnQueue = this.memory.spawnQueue || [];
        this.controllerLevel = this.memory.controllerLevel || ((_a = room.controller) === null || _a === void 0 ? void 0 : _a.level);
        this.garrison = new Garrison(this.spawns[0]);
        this.census = this.memory.census || censusDefaults;
    }
    applyCreepRoleBehavior() {
        const creeps = Game.creeps;
        for (const name in creeps) {
            const creep = creeps[name];
            if (!creep.spawning) {
                switch (creep.memory.role) {
                    case CreepRole.HARVESTER:
                        harvester.run(creep);
                        break;
                    case CreepRole.BUILDER:
                        builder.run(creep);
                        break;
                }
            }
        }
    }
    removeFromCensus(role) {
        this.spawnQueue.unshift(role);
        this.census[role].cur -= 1;
    }
    save() {
        this.memory.controllerLevel = this.controllerLevel;
        this.memory.spawnQueue = this.spawnQueue;
        this.memory.census = this.census;
    }
    removeFromMemory(name, role) {
        if (delete Memory.creeps[name]) {
            console.log(`🔶 Removing ${name} from Memory & Census`);
            this.removeFromCensus(role);
        }
    }
    isSpawning(spawn) {
        return spawn.spawning !== null;
    }
    updateRCL(room) {
        var _a;
        const prevRCL = this.controllerLevel;
        const curRCL = (_a = room.controller) === null || _a === void 0 ? void 0 : _a.level;
        if (!!prevRCL) {
            if (prevRCL !== curRCL) {
                const isEqual = (unlockLevel, controllerLevel) => controllerLevel === unlockLevel;
                const newCreeps = this.garrison.generateSpawnQueue(this.census, curRCL, isEqual);
                this.spawnQueue.concat(newCreeps);
            }
        }
        return curRCL;
    }
    main() {
        const isGtOrEqual = (unlockLevel, controllerLevel) => controllerLevel >= unlockLevel;
        this.spawnQueue =
            this.spawnQueue.length > 0
                ? this.spawnQueue
                : this.garrison.generateSpawnQueue(this.census, this.controllerLevel, isGtOrEqual);
        this.controllerLevel = this.updateRCL(this.room);
        for (const id in this.spawns) {
            const spawn = this.spawns[id];
            if (!this.isSpawning(spawn)) {
                const nextCreep = this.spawnQueue[0];
                if (nextCreep) {
                    this.garrison.recruit(nextCreep, this.census, this.spawnQueue);
                }
            }
        }
        this.applyCreepRoleBehavior();
        for (const name in Memory.creeps) {
            if (!(name in Game.creeps)) {
                this.removeFromMemory(name, Memory.creeps[name].role);
            }
        }
        this.save();
    }
}const loop = () => {
    for (const id in Game.rooms) {
        new Base(Game.rooms[id]).main();
    }
};exports.loop=loop;
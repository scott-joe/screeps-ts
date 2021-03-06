'use strict';Object.defineProperty(exports,'__esModule',{value:true});const minTTL = 500;
const downgradeThreshold = 5000;
const creepTemplates = {
    HARVESTER: [WORK, CARRY, MOVE],
    BUILDER: [WORK, CARRY, MOVE],
    MECHANIC: [WORK, CARRY, MOVE],
    GRUNT: [TOUGH, TOUGH, ATTACK, MOVE],
    RANGER: [TOUGH, RANGED_ATTACK, MOVE],
    MEDIC: [HEAL, MOVE],
    SCOUT: [CLAIM, MOVE]
};const visOrange = {
    reusePath: 30,
    serializeMemory: true,
    visualizePathStyle: { stroke: '#ffaa00' }
};
const visWhite = {
    reusePath: 30,
    serializeMemory: true,
    visualizePathStyle: { stroke: '#ffffff' }
};
Creep.prototype.energyFull = function () {
    return this.store[RESOURCE_ENERGY] === this.store.getCapacity(RESOURCE_ENERGY);
};
Creep.prototype.energyEmpty = function () {
    return this.store[RESOURCE_ENERGY] === 0;
};
Creep.prototype.needsRenew = function () {
    return (
    this.ticksToLive <= minTTL);
};
Creep.prototype.renew = function (spawn) {
    if (spawn.renewCreep(this) === ERR_NOT_IN_RANGE) {
        this.moveTo(spawn, visOrange);
    }
};
Creep.prototype.harvestEnergy = function () {
    const droppedResources = this.room.find(FIND_DROPPED_RESOURCES)[0];
    const tombstone = this.room.find(FIND_TOMBSTONES)[0];
    const tombstoneHasEnergy = (tombstone === null || tombstone === void 0 ? void 0 : tombstone.store.getUsedCapacity(RESOURCE_ENERGY)) > 0 || false;
    if (droppedResources) {
        if (this.pickup(droppedResources) === ERR_NOT_IN_RANGE) {
            this.moveTo(droppedResources, visOrange);
        }
    }
    else if (tombstoneHasEnergy) {
        if (this.withdraw(tombstone, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            this.moveTo(tombstone);
        }
    }
    else {
        const energySource = this.room.find(FIND_SOURCES)[0];
        if (this.harvest(energySource) === ERR_NOT_IN_RANGE) {
            this.moveTo(energySource, visOrange);
        }
    }
};
Creep.prototype.mine = function () {
    const sources = this.room.find(FIND_MINERALS);
    if (this.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
        this.moveTo(sources[0], visOrange);
    }
};
Creep.prototype.extract = function () {
    const sources = this.room.find(FIND_DEPOSITS);
    if (this.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
        this.moveTo(sources[0], visOrange);
    }
};
Creep.prototype.transferEnergy = function (target) {
    if (target.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
        if (this.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            this.moveTo(target, visWhite);
        }
    }
};
Creep.prototype.upgrade = function (controller) {
    if (this.upgradeController(controller) === ERR_NOT_IN_RANGE) {
        this.moveTo(controller, visOrange);
    }
};
Creep.prototype.buildConstructionSite = function (constructionSite) {
    if (this.build(constructionSite) === ERR_NOT_IN_RANGE) {
        this.moveTo(constructionSite, visWhite);
    }
};Spawn.prototype.isSpawning = function () {
    return this.spawning !== null;
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
})(Division || (Division = {}));const { BUILD: BUILD$1, HARVEST: HARVEST$2, UPGRADE: UPGRADE$2 } = CreepActions;
var builder = {
    run(creep) {
        var _a, _b;
        const constructionSite = creep.room.find(FIND_CONSTRUCTION_SITES)[0];
        const downgradeImminent = ((_a = creep.room.controller) === null || _a === void 0 ? void 0 : _a.ticksToDowngrade) <= downgradeThreshold;
        const controller = (_b = creep.room) === null || _b === void 0 ? void 0 : _b.controller;
        let action = creep.memory.action || HARVEST$2;
        if (action !== HARVEST$2 && creep.energyEmpty()) {
            action = HARVEST$2;
        }
        else if (downgradeImminent && !creep.energyEmpty()) {
            action = UPGRADE$2;
        }
        else if (action === HARVEST$2 && creep.energyFull()) {
            action = BUILD$1;
        }
        if (action === UPGRADE$2) {
            creep.upgrade(controller);
        }
        else if (action === BUILD$1 && constructionSite) {
            creep.buildConstructionSite(constructionSite);
        }
        else if (action === HARVEST$2) {
            creep.harvestEnergy();
        }
        else {
            creep.upgrade(controller);
        }
        creep.memory.action = action;
    }
};const { TRANSFER, HARVEST: HARVEST$1, UPGRADE: UPGRADE$1 } = CreepActions;
const getValidTransferTarget = (creep) => {
    const storageStructureTypeConsts = [
        STRUCTURE_SPAWN,
        STRUCTURE_EXTENSION,
        STRUCTURE_CONTAINER,
        STRUCTURE_STORAGE
    ];
    const list = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => storageStructureTypeConsts.includes(structure.structureType)
    });
    const transferTarget = list.find(item => item.store.getFreeCapacity(RESOURCE_ENERGY) > 0);
    return !!transferTarget ? transferTarget : null;
};
var harvester = {
    run(creep) {
        var _a, _b;
        const downgradeImminent = ((_a = creep.room.controller) === null || _a === void 0 ? void 0 : _a.ticksToDowngrade) <= downgradeThreshold;
        const transferTarget = getValidTransferTarget(creep);
        const controller = (_b = creep.room) === null || _b === void 0 ? void 0 : _b.controller;
        let action = creep.memory.action || HARVEST$1;
        if (action !== HARVEST$1 && creep.energyEmpty()) {
            action = HARVEST$1;
        }
        else if (downgradeImminent && !creep.energyEmpty()) {
            action = UPGRADE$1;
        }
        else if (action === HARVEST$1 && creep.energyFull()) {
            if (!!transferTarget) {
                action = TRANSFER;
            }
            else {
                action = UPGRADE$1;
            }
        }
        else if (action === TRANSFER && !!!transferTarget) {
            action = UPGRADE$1;
        }
        if (action === UPGRADE$1) {
            creep.upgrade(controller);
        }
        else if (action === TRANSFER) {
            creep.transferEnergy(transferTarget);
        }
        else if (action === HARVEST$1) {
            creep.harvestEnergy();
        }
        else {
            creep.upgrade(controller);
        }
        creep.memory.action = action;
    }
};const { BUILD, HARVEST, UPGRADE } = CreepActions;
var mechanic = {
    run(creep) {
        var _a, _b;
        const constructionSite = creep.room.find(FIND_CONSTRUCTION_SITES)[0];
        const downgradeImminent = ((_a = creep.room.controller) === null || _a === void 0 ? void 0 : _a.ticksToDowngrade) <= downgradeThreshold;
        const controller = (_b = creep.room) === null || _b === void 0 ? void 0 : _b.controller;
        let action = creep.memory.action || HARVEST;
        if (action !== HARVEST && creep.energyEmpty()) {
            action = HARVEST;
        }
        else if (downgradeImminent && !creep.energyEmpty()) {
            action = UPGRADE;
        }
        else if (action === HARVEST && creep.energyFull()) {
            action = BUILD;
        }
        if (action === UPGRADE) {
            creep.upgrade(controller);
        }
        else if (action === BUILD && constructionSite) {
            creep.buildConstructionSite(constructionSite);
        }
        else if (action === HARVEST) {
            creep.harvestEnergy();
        }
        else {
            creep.upgrade(controller);
        }
        creep.memory.action = action;
    }
};const isEqual = (unlockLevel, controllerLevel) => {
    return controllerLevel === unlockLevel;
};
const isGtOrEqual = (unlockLevel, controllerLevel) => {
    return controllerLevel >= unlockLevel;
};const defaultConfig = {
    HARVESTER: { max: 2, cur: 0, unlock: 1 },
    BUILDER: { max: 4, cur: 0, unlock: 1 },
    MECHANIC: { max: 1, cur: 0, unlock: 2 },
    GRUNT: { max: 2, cur: 0, unlock: 3 },
    RANGER: { max: 2, cur: 0, unlock: 3 },
    MEDIC: { max: 1, cur: 0, unlock: 3 },
    SCOUT: { max: 1, cur: 0, unlock: 4 }
};
class Census {
    constructor(room) {
        this.room = room;
        this.memory = room.memory.census || defaultConfig;
    }
    add(role) {
        this.memory[role].cur += 1;
    }
    remove(role) {
        this.memory[role].cur -= 1;
    }
    getRecord(role) {
        return this.memory[role];
    }
    getRecords() {
        return this.memory;
    }
    getCount(role) {
        return this.memory[role].cur;
    }
    hasRoomFor(role) {
        return this.memory[role].cur < this.memory[role].max;
    }
}const { HARVESTER } = CreepRole;
class Garrison {
    constructor(spawn, room, controllerLevel) {
        this.room = room;
        this.spawn = spawn;
        this.controllerLevel = controllerLevel;
        this.energyAvailable = spawn.room.energyAvailable;
        this.energyCapacity = spawn.room.energyCapacityAvailable;
        this.census = new Census(room);
        this.spawnQueue = room.memory.spawnQueue || undefined;
        if (this.spawnQueue === undefined)
            this.spawnQueue = this.generateSpawnQueue(this.controllerLevel, isGtOrEqual);
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
    generateSpawnQueue(controllerLevel, predicate) {
        const output = [];
        const census = this.census.getRecords();
        for (const id in census) {
            const cfg = census[id];
            const role = id;
            if (predicate(cfg.unlock, controllerLevel)) {
                for (let i = 1; i <= cfg.max; i++) {
                    output.push(role);
                }
            }
        }
        return output;
    }
    updateSpawnQueue(controllerLevel) {
        const newCreeps = this.generateSpawnQueue(controllerLevel, isEqual);
        this.spawnQueue = [...this.spawnQueue, ...newCreeps];
        this.save();
    }
    buryTheDead() {
        for (const name in Memory.creeps) {
            if (!(name in Game.creeps)) {
                this.census.remove(Memory.creeps[name].role);
                this.removeFromMemory(name, Memory.creeps[name].role);
            }
        }
        this.save();
    }
    removeFromMemory(name, role) {
        if (delete Memory.creeps[name]) {
            this.spawnQueue.unshift(role);
        }
    }
    spawnCreep(role) {
        const name = `${role}-${Game.time}`;
        const template = creepTemplates[role];
        const body = this.generateCreepRecipe(template, this.spawn.room.energyAvailable);
        const opts = { memory: { role } };
        if (this.spawn.spawnCreep(body, name, opts) === 0) {
            this.spawnQueue.shift();
            this.census.add(role);
        }
    }
    recruit() {
        const role = this.spawnQueue[0];
        const hasNoHarvesters = this.census.getCount(HARVESTER) === 0;
        const hasMinimumEnergy = this.energyAvailable >= 300;
        if (hasNoHarvesters && hasMinimumEnergy) {
            this.spawnQueue.splice(this.spawnQueue.indexOf(HARVESTER), 1);
            this.spawnQueue.unshift(HARVESTER);
            this.spawnCreep(HARVESTER);
        }
        else if (role) {
            const haveRoom = this.census.hasRoomFor(role);
            const atFullEnergy = this.energyAvailable === this.energyCapacity;
            if (haveRoom && atFullEnergy) {
                this.spawnCreep(role);
            }
        }
        this.save();
    }
    save() {
        this.room.memory.spawnQueue = this.spawnQueue;
        this.room.memory.census = this.census.getRecords();
    }
}class Base {
    constructor(room) {
        var _a;
        this.room = room;
        this.spawns = room.find(FIND_MY_SPAWNS);
        this.memory = room.memory;
        this.controllerLevel = this.memory.controllerLevel || ((_a = room.controller) === null || _a === void 0 ? void 0 : _a.level) || 1;
        this.garrison = new Garrison(this.spawns[0], room, this.controllerLevel);
    }
    applyCreepRoles() {
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
                    case CreepRole.MECHANIC:
                        mechanic.run(creep);
                        break;
                }
            }
        }
    }
    save() {
        this.memory.controllerLevel = this.controllerLevel;
    }
    updateRCL(room) {
        var _a;
        const prev = this.controllerLevel;
        const cur = (_a = room.controller) === null || _a === void 0 ? void 0 : _a.level;
        if (!!prev) {
            if (prev !== cur) {
                this.garrison.updateSpawnQueue(cur);
            }
        }
        return cur;
    }
    main() {
        this.controllerLevel = this.updateRCL(this.room);
        for (const id in this.spawns) {
            const spawn = this.spawns[id];
            if (!spawn.isSpawning(spawn)) {
                this.garrison.recruit();
            }
        }
        this.garrison.buryTheDead();
        this.applyCreepRoles();
        this.save();
    }
}const loop = () => {
    for (const id in Game.rooms) {
        new Base(Game.rooms[id]).main();
    }
};exports.loop=loop;
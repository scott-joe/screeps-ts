import { CreepRole } from 'types/main'

export type CensusRecord = {
    max: number
    cur: number
    unlock: number
}

export type CensusRecords = {
    [x: string]: CensusRecord
}

const defaultConfig: CensusRecords = {
    HARVESTER: { max: 2, cur: 0, unlock: 1 },
    BUILDER: { max: 4, cur: 0, unlock: 1 },
    MECHANIC: { max: 1, cur: 0, unlock: 2 },
    GRUNT: { max: 2, cur: 0, unlock: 3 },
    RANGER: { max: 2, cur: 0, unlock: 3 },
    MEDIC: { max: 1, cur: 0, unlock: 3 },
    SCOUT: { max: 1, cur: 0, unlock: 4 }
}

/*
    THE CENSUS IS RESPONSIBLE FOR KEEPING TRACK OF CREEP NUMBERS
*/

export default class Census {
    private room: Room
    private memory: CensusRecords

    constructor(room: Room) {
        this.room = room
        this.memory = room.memory.census || defaultConfig
    }

    public add(role: CreepRole): void {
        this.memory[role].cur += 1
        this.save()
    }

    public remove(role: CreepRole): void {
        this.memory[role].cur -= 1
        this.save()
    }

    public getRecord(role: CreepRole): CensusRecord {
        return this.memory[role]
    }

    public getRecords(): CensusRecords {
        return this.memory
    }

    public save(): void {
        this.room.memory.census = this.memory
    }
}

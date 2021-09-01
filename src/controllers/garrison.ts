import { Census, CreepRole, Size } from 'types/main'
import { creepRecipes, partCost } from '../constants'

export class Garrison {
    private spawn: StructureSpawn
    private census: Census
    private baseSize: Size

    constructor(spawn: StructureSpawn, census: Census, baseSize: Size) {
        this.spawn = spawn
        this.census = census
        this.baseSize = baseSize
    }

    private spawnCreep(role: CreepRole): ScreepsReturnCode {
        const name: string = `${role}-${Game.time}`
        const body = creepRecipes[role][this.baseSize]
        console.log(name, body)

        return this.spawn.spawnCreep(body, name, {
            memory: { role }
        })
    }

    public generateSpawnQueue(size: any): CreepRole[] {
        const HARVESTER_FREQUENCY = 5
        const BUILDER_FREQUENCY = 2
        const output = []

        for (let i = 1; i <= size; i++) {
            if (i % HARVESTER_FREQUENCY === 0) {
                output.push(CreepRole.HARVESTER)
            } else if (i % BUILDER_FREQUENCY === 0) {
                output.push(CreepRole.BUILDER)
            }
        }

        return output
    }

    private canSpawn(role: CreepRole): boolean {
        const recipe: BodyPartConstant[] = creepRecipes[role][this.baseSize]
        const reducer = (acc: number, part: BodyPartConstant) => {
            return acc + partCost[part]
        }

        const cost = recipe.reduce(reducer, 0)
        return this.spawn.store.energy >= cost
    }

    private shouldSpawn(role: CreepRole): boolean {
        return this.census[role].cur < this.census[role].min
    }

    public recruit(newRole: CreepRole): boolean {
        if (this.canSpawn(newRole) && this.shouldSpawn(newRole)) {
            return this.spawnCreep(newRole) === 0 ? true : false
        } else {
            return false
        }
    }
}

import { Census, CreepRole, Size } from 'types/main'
import { creepRecipes } from '../constants'

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

        const result = this.spawn.spawnCreep(body, name, {
            memory: { role }
        })
        console.log(`SpawnCreep result ${result}`)
        return result
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
        var bodyCost: {
            [property in BodyPartConstant]: number
        } = {
            move: 50,
            work: 100,
            carry: 50,
            attack: 80,
            ranged_attack: 150,
            tough: 10,
            heal: 250,
            claim: 600
        }

        const cost = recipe.reduce((acc: number, part: BodyPartConstant) => {
            return acc + bodyCost[part]
        }, 0)

        console.log(
            `Available: ${this.spawn.store.energy} >= Cost: ${cost}`,
            this.spawn.store.energy >= cost
        )
        return this.spawn.store.energy >= cost
    }

    private shouldSpawn(role: CreepRole): boolean {
        return this.census[role].cur < this.census[role].min
    }

    public recruit(newRole: CreepRole): boolean {
        if (this.canSpawn(newRole) && this.shouldSpawn(newRole)) {
            console.log(`recruiting ${newRole}`)
            return this.spawnCreep(newRole) === 0 ? true : false
        } else {
            return false
        }
    }
}

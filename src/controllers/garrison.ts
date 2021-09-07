import { Census, CreepRole, Size } from 'types/main'
import { creepTemplates, partCost } from '../constants'

export class Garrison {
    private spawn: StructureSpawn
    private baseSize: Size

    constructor(spawn: StructureSpawn, baseSize: Size) {
        this.spawn = spawn
        this.baseSize = baseSize
    }

    private generateCreepRecipe(template: BodyPartConstant[], energy: number): BodyPartConstant[] {
        let parts: BodyPartConstant[] = []

        while (energy > 0 && parts.length < 50) {
            // GET NEXT PART IN THE TEMPLATE
          let next = template[parts.length % template.length] // returns 0...2

          // NEXT PART TOO EXPENSIVE
          if (BODYPART_COST[next] > energy) {
            // REMOVE THE EXPENSIVE ITEM FROM THE TEMPLATE
            const start = template.indexOf(next) + 1
            const remainingTemplate = template.slice(start, template.length)
            // IF THERE'S ANYTHING LEFT IN THE LIST, TRY AGAIN
            if (remainingTemplate.length > 0) {
              // RUN THIS FUNCTION FOR REMAINING ITEMS IN THE TEMPLATE
              const result = this.generateCreepRecipe(remainingTemplate, energy)
                //   ADD THE NEW SUB-ARRAY OF PARTS TO THE END OF THIS LIST
              parts = parts.concat(result)
            }

            // CLEAN UP THE REMAINDER ENERGY
            energy -= energy
          } else {
            // ADD PART AND SUBTRACT THE ENERGY COST FROM REMAINING ENERGY
            energy -= BODYPART_COST[next]
            parts.push(next)
          }
        }

        // SORT PARTS BASED ON ORIGINAL TEMPLATE?
        //  FILTER PARTS INTO SUB-ARRAYS AND THEN CONCAT THEM BACK TOGETHER?
        return parts
      }

    private spawnCreep(role: CreepRole): ScreepsReturnCode {
        const name: string = `${role}-${Game.time}`
        const template: BodyPartConstant[] = creepTemplates[role][this.baseSize]
        const body = this.generateCreepRecipe(template, this.spawn.store[RESOURCE_ENERGY])
        console.log(`🟢 Attempting to Spawn ${role}`, name, body)

        return this.spawn.spawnCreep(body, name, {
            memory: { role }
        })
    }

    public generateSpawnQueue(size: any): CreepRole[] {
        console.log(`🟢 Generating Spawn Queue for ${this.spawn.room.name}`)
        const HARVESTER_FREQUENCY = 5
        const BUILDER_FREQUENCY = 2
        const UPGRADER_FREQUENCY = 8
        const output = [CreepRole.HARVESTER]
        const RCL = this.spawn.room.controller?.level!

        for (let i = 1 i <= size i++) {
            if (i % HARVESTER_FREQUENCY === 0) {
                output.push(CreepRole.HARVESTER)
            } else if (i % BUILDER_FREQUENCY === 0) {
                output.push(CreepRole.BUILDER)
            } else if (RCL > 1 && i % UPGRADER_FREQUENCY === 0) {
                output.push(CreepRole.UPGRADER)
            }
        }

        return output
    }

    private canSpawn(role: CreepRole): boolean {
        const recipe: BodyPartConstant[] = creepTemplates[role][this.baseSize]
        const reducer = (acc: number, part: BodyPartConstant) => {
            return acc + partCost[part]
        }

        const cost = recipe.reduce(reducer, 0)
        return this.spawn.store.energy >= cost
    }

    private shouldSpawn(role: CreepRole, census: Census): boolean {
        return census[role].cur < census[role].min
    }

    public recruit(role: CreepRole, census: Census): boolean {
        if (this.canSpawn(role) && this.shouldSpawn(role, census)) {
            console.log(`🟢 Can & Should Recruit ${role}`)
            const result = this.spawnCreep(role)

            if (result === 0) {
                console.log(`🟢 Successfuly spawned ${role}`)
            } else {
                console.log(`🔴 Spawning error ${result} for ${role}`)
            }

            return result === 0 ? true : false
        } else {
            // console.log(`🔴 Can't or Shouldn't Recruit ${role}`)
            return false
        }
    }
}

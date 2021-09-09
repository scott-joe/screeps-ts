import { Census, CreepRole } from 'types/main'
import { creepTemplates } from '../constants'

export class Garrison {
    private spawn: StructureSpawn
    private energyAvailable: number
    private energyCapacity: number

    constructor(spawn: StructureSpawn) {
        this.spawn = spawn
        this.energyAvailable = spawn.room.energyAvailable
        this.energyCapacity = spawn.room.energyCapacityAvailable
    }

    private generateCreepRecipe(template: BodyPartConstant[], energy: number): BodyPartConstant[] {
        let parts: BodyPartConstant[] = []

        while (energy > 0 && parts.length < 50) {
            // Get next part in the template.
            let next = template[parts.length % template.length] // returns 0...2

            // If next part cost > energy remaining, try to build remaining template
            if (BODYPART_COST[next] > energy) {
                // Get parts in template after expensive one
                const start = template.indexOf(next) + 1
                const remainingTemplate = template.slice(start, template.length)
                // If there's anything left, try again
                if (remainingTemplate.length > 0) {
                    // Run this function with the partial template
                    const result = this.generateCreepRecipe(remainingTemplate, energy)
                    // Add that output list to the 'main' parts list
                    parts = parts.concat(result)
                }

                // Clean up the energy at this level bc it was used up in a recusion
                energy -= energy
            } else {
                // Add part to recipe and subtract energy cost
                energy -= BODYPART_COST[next]
                parts.push(next)
            }
        }

        // SORT PARTS BASED ON ORIGINAL TEMPLATE?
        //  FILTER PARTS INTO SUB-ARRAYS AND THEN CONCAT THEM BACK TOGETHER?
        return parts
    }

    private spawnCreep(role: CreepRole): boolean {
        const name: string = `${role}-${Game.time}`
        const template: BodyPartConstant[] = creepTemplates[role]
        const body = this.generateCreepRecipe(template, this.spawn.room.energyAvailable)
        console.log(`🟢 Attempting to Spawn ${role}`, name, body)

        const result = this.spawn.spawnCreep(body, name, {
            memory: { role }
        })

        return result === 0 ? true : false
    }

    public generateSpawnQueue(census: Census, controllerLevel: number, condition: Function): CreepRole[] {
        const output: CreepRole[] = []

        console.log(`🟢 Generating Spawn Queue for ${this.spawn.room.name}`)

        for (const roleId in census) {
            // Get the config for that role
            const cfg = census[roleId]
            // Get a typesafe role name
            const role = roleId as CreepRole
            // If our the creep should spawn yet
            if (condition(cfg.unlock, controllerLevel)) {
                for (let i = 1; i <= cfg.min; i++) {
                    output.push(role)
                }
            }
        }

        return output
    }

    private shouldSpawn(role: CreepRole, census: Census): boolean {
        // Do we have room for another creep of this role?
        const haveRoom = census[role].cur < census[role].min
        // Are we at max energy? So they're the biggest and best they can be?
        const atFullEnergy = this.energyAvailable === this.energyCapacity

        return haveRoom && atFullEnergy
    }

    public recruit(role: CreepRole, census: Census, spawnQueue: CreepRole[]): boolean {
        // Do we have enough resources and room?
        if (this.shouldSpawn(role, census)) {
            console.log(`🟢 Should recruit ${role}`)
            // Spawn a creep
            const result = this.spawnCreep(role)

            // Did it succeed?
            if (result) {
                console.log(`🟢 Successfuly spawned ${role}`)
                // Remove the creep's role from the queue
                spawnQueue.shift()
                // Add the role to the census
                census[role].cur += 1
            } else {
                console.log(`🔴 Spawning error ${result} for ${role}`)
            }

            return result
        } else {
            // Don't spawn now
            // console.log(`🔴 Shouldn't Recruit ${role}`)
            return false
        }
    }
}

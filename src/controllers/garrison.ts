import { Census, CreepRole, Size } from 'types/main'
import { creepTemplates } from '../constants'

// RC1 - HARVESTER, HARVESTER, BUILDER, BUILDER, BUILDER, BUILDER
// RC2 - MAINTAINER, MAINTAINER

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
        console.log(parts)
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

    public generateSpawnQueue(census: Census): CreepRole[] {
        const output: CreepRole[] = []
        const RCL = this.spawn.room.controller?.level!

        console.log(`🟢 Generating Spawn Queue for ${this.spawn.room.name}`)
        for (const roleId in census) {
            const cfg = census[roleId]
            const role = roleId as CreepRole
            if (RCL >= cfg.unlock) {
                output.push(role)
            }
        }

        return output
    }

    private shouldSpawn(role: CreepRole, census: Census): boolean {
        // Do we have room for another creep of this role?
        const haveRoom = census[role].cur < census[role].min
        // Are we at max energy? So they're the biggest and best they can be?
        const fullEnergy = this.spawn.store.energy === this.spawn.store.getCapacity(RESOURCE_ENERGY)

        return haveRoom && fullEnergy
    }

    public recruit(role: CreepRole, census: Census, spawnQueue: CreepRole[]): boolean {
        // Do we have enough resources and room?
        if (this.shouldSpawn(role, census)) {
            console.log(`🟢 Should recruit ${role}`)
            // Spawn a creep
            const result = this.spawnCreep(role)

            // Did it succeed?
            if (result === 0) {
                console.log(`🟢 Successfuly spawned ${role}`)
                // Remove the creep's role from the queue
                spawnQueue.shift()
                // Add the role to the census
                census[role].cur += 1
            } else {
                console.log(`🔴 Spawning error ${result} for ${role}`)
            }

            return result === 0 ? true : false
        } else {
            // Don't spawn now
            // console.log(`🔴 Shouldn't Recruit ${role}`)
            return false
        }
    }
}

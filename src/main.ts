import { garrison, guard } from 'controllers'
import { builder, harvester, upgrader } from 'roles'
import { Census, CreepRole, Division } from 'types/main'
import { ErrorMapper } from 'utils/ErrorMapper'

declare global {
    /*
      Example types, expand on these or remove them and add your own.
      Note: Values, properties defined here do not fully *exist* by this type definiton alone.
            You must also give them an implemention if you would like to use them. (ex. actually setting a `role` property in a Creeps memory)

      Types added in this `global` block are in an ambient, global context. This is needed because `main.ts` is a module file (uses import or export).
      Interfaces matching on name from @types/screeps will be merged. This is how you can extend the 'built-in' interfaces from @types/screeps.
    */
    // Memory extension samples
    interface Memory {
        uuid: number
        log: any
    }

    interface CreepMemory {
        room: string
        role: CreepRole
        division: Division
        working: boolean
        building: boolean
        upgrading: boolean
    }

    // Syntax for adding proprties to `global` (ex "global.log")
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace NodeJS {
        interface Global {
            log: any
        }
    }
}

export const loop = ErrorMapper.wrapLoop(() => {
    // Timepiece
    console.log(`Current game tick is ${Game.time}`)

    const spawns: { [spawnName: string]: StructureSpawn } = Game.spawns
    const creeps: { [creepName: string]: Creep } = Game.creeps
    const structures: { [structureName: string]: Structure } = Game.structures

    // TODO: Based on Controller level? Total energy available? LVL of each role to x1 x2 x3... roles
    //       Based on need? Change roles based on what's needed and keep everyone fairly generlized
    //       Based on room? Do this whole loop per room? Or operate the whole thing together
    const census: Census = {
        HARVESTER: { min: 3, cur: 0 },
        BUILDER: { min: 1, cur: 0 },
        UPGRADER: { min: 1, cur: 0 },
        SOLDIER: { min: 2, cur: 0 }
    }

    // Creep role actions
    for (const name in creeps) {
        const creep = creeps[name]
        // console.log(`creep.id: ${creep.id}`)

        const role: CreepRole = creep.memory.role as CreepRole
        census[role].cur += 1

        switch (role) {
            case CreepRole.HARVESTER:
                harvester.run(creep)
                break
            case CreepRole.BUILDER:
                builder.run(creep)
                break
            case CreepRole.UPGRADER:
                upgrader.run(creep)
                break
            case CreepRole.SOLDIER:
                // upgrader.run(creep)
                break
            default:
                break
        }
    }

    // Creep management (e.g., numbers and spawning)
    for (const id in spawns) {
        const spawn = spawns[id]
        garrison.run(spawn, census)
        // console.log(`spawn.id: ${spawn.id}`)
    }

    // Towers do tower things, and so on
    for (const id in structures) {
        const structure: Structure = structures[id]

        switch (structure.structureType) {
            case STRUCTURE_TOWER:
                guard.run(structure)
                break

            default:
                break
        }

        // console.log(`structure.id: ${structure.id}`)
    }

    // Memory cleanup
    for (const name in Memory.creeps) {
        if (!(name in Game.creeps)) {
            console.log(`Removing ${name} from Memory`)
            delete Memory.creeps[name]
        }
    }
})

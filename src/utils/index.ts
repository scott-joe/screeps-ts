import { logLvl } from '../constants'

const log = (msg: any): void => {
    if (logLvl === 'ALL') console.log(msg)
}

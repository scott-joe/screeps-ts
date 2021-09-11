'use strict'

import clear from 'rollup-plugin-clear'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from 'rollup-plugin-typescript2'
import screeps from 'rollup-plugin-screeps'
import cfg from './screeps.json'
import cleanup from 'rollup-plugin-cleanup'
import { uglify } from 'rollup-plugin-uglify'

const dest = process.env.DEST
const output = {
    input: 'src/main.ts',
    output: {
        file: 'dist/main.js',
        format: 'cjs',
        sourcemap: false,
        compact: true
    },
    plugins: [
        clear({ targets: ['dist'] }),
        resolve({ rootDir: 'src' }),
        commonjs(),
        typescript({ tsconfig: './tsconfig.json' }),
        cleanup({
            comments: 'none',
            extensions: ['js', 'ts']
        })
        // uglify()
    ]
}

if (dest) {
    output.plugins = [...output.plugins, screeps({ config: cfg[dest], dryRun: cfg[dest] === null })]
} else if (!dest) {
    console.log('No destination specified - code will be compiled but not uploaded')
} else if (cfg[dest] === null) {
    throw new Error('Invalid upload destination')
}

export default output

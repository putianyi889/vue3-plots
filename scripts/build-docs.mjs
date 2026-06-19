import { spawn } from 'node:child_process'

import { acquireDocsLock } from './docs-lock.mjs'

const releaseLock = acquireDocsLock('docs:build')

try {
    await runCommand(npmCommand(), ['run', 'docs:api'])
    await runCommand(resolveBin('vitepress'), ['build', 'docs'])
}
finally {
    releaseLock()
}

function runCommand(command, args) {
    return new Promise((resolve, reject) => {
        const child = spawn(command, args, { stdio: 'inherit', shell: process.platform === 'win32' })

        child.on('error', reject)

        child.on('exit', (code) => {
            if (code === 0) {
                resolve()
                return
            }

            reject(new Error(`${command} ${args.join(' ')} exited with code ${code}`))
        })
    })
}

function npmCommand() {
    return process.platform === 'win32' ? 'npm.cmd' : 'npm'
}

function resolveBin(name) {
    return process.platform === 'win32' ? `${name}.cmd` : name
}

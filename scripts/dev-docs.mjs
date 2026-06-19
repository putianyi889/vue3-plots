import { dirname, resolve } from 'node:path'
import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vitepress'

import { acquireDocsLock } from './docs-lock.mjs'
import { startDocsApiWatcher } from './watch-docs-api.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const releaseLock = acquireDocsLock('docs:dev')

let isClosing = false
let watcher
let server

for (const signal of ['SIGINT', 'SIGTERM']) {
    process.on(signal, () => {
        void close(0)
    })
}

try {
    await runCommand(npmCommand(), ['run', 'docs:api'])

    watcher = startDocsApiWatcher()
    server = await createServer(resolve(root, 'docs'))

    await server.listen()
    server.printUrls()
}
catch (error) {
    await close(1)
    throw error
}

async function close(code) {
    if (isClosing) return

    isClosing = true
    await watcher?.close()
    await server?.close()
    releaseLock()
    process.exitCode = code
}

function runCommand(command, args) {
    return new Promise((resolvePromise, reject) => {
        const child = spawn(command, args, { cwd: root, stdio: 'inherit', shell: process.platform === 'win32' })

        child.on('error', reject)

        child.on('exit', (code) => {
            if (code === 0) {
                resolvePromise()
                return
            }

            reject(new Error(`${command} ${args.join(' ')} exited with code ${code}`))
        })
    })
}

function npmCommand() {
    return process.platform === 'win32' ? 'npm.cmd' : 'npm'
}

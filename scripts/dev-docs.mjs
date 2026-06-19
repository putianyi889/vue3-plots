import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vitepress'

import { startDocsApiWatcher } from './watch-docs-api.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const watcher = startDocsApiWatcher()
const server = await createServer(resolve(root, 'docs'))

let isClosing = false

for (const signal of ['SIGINT', 'SIGTERM']) {
    process.on(signal, () => {
        void close(0)
    })
}

await server.listen()
server.printUrls()

async function close(code) {
    if (isClosing) return

    isClosing = true
    await watcher.close()
    await server.close()
    process.exitCode = code
}

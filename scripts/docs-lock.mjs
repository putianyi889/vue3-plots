import { closeSync, existsSync, openSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

export const docsLockPath = resolve(process.cwd(), '.docs-task.lock')

export function acquireDocsLock(owner) {
    const lock = {
        owner,
        pid: process.pid,
        startedAt: new Date().toISOString(),
    }

    while (true) {
        try {
            const fd = openSync(docsLockPath, 'wx')
            try {
                writeFileSync(fd, `${JSON.stringify(lock, null, 2)}\n`)
            }
            finally {
                closeSync(fd)
            }

            return () => releaseDocsLock(lock)
        }
        catch (error) {
            if (error.code !== 'EEXIST') {
                throw error
            }

            const existing = readDocsLock()
            if (existing === undefined || !isProcessRunning(existing.pid)) {
                removeStaleDocsLock()
                continue
            }

            throw new Error(formatLockError(owner, existing), { cause: error })
        }
    }
}

function releaseDocsLock(lock) {
    const existing = readDocsLock()
    if (existing?.pid !== lock.pid || existing?.owner !== lock.owner) {
        return
    }

    unlinkSync(docsLockPath)
}

function removeStaleDocsLock() {
    if (!existsSync(docsLockPath)) {
        return
    }

    unlinkSync(docsLockPath)
}

function readDocsLock() {
    try {
        return JSON.parse(readFileSync(docsLockPath, 'utf8'))
    }
    catch {
        return undefined
    }
}

function isProcessRunning(pid) {
    if (!Number.isInteger(pid) || pid <= 0) {
        return false
    }

    try {
        process.kill(pid, 0)
        return true
    }
    catch (error) {
        return error.code === 'EPERM'
    }
}

function formatLockError(owner, existing) {
    return [
        `Cannot start ${owner}: docs task lock is held by ${existing.owner || 'another docs task'}.`,
        `PID: ${existing.pid || 'unknown'}`,
        `Started: ${existing.startedAt || 'unknown'}`,
        'Stop the running docs task first, then retry.',
    ].join('\n')
}

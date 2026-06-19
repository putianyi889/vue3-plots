import chokidar from 'chokidar'
import { cpSync, existsSync, readFileSync, readdirSync, rmSync, statSync } from 'node:fs'
import { basename, dirname, resolve } from 'node:path'
import { spawn } from 'node:child_process'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const pages = readJson(resolve(root, 'scripts/component-doc-pages.json'))
const componentPaths = new Set(pages.map(([componentPath]) => normalizePath(componentPath)))
const typedocEntries = new Map([
    ['src/components/geometry.ts', 'geometry'],
    ['src/components/utils.ts', 'utils'],
])
const debounceMs = 400

let timer
let isRunning = false
let runAgain = false
let allComponents = false
let allTypedoc = false
let pendingComponents = new Set()
let pendingTypedoc = new Set()

export function startDocsApiWatcher() {
    const watcher = chokidar.watch([
        ...componentPaths,
        ...typedocEntries.keys(),
        'scripts/component-doc-markdown.mjs',
        'scripts/component-doc-pages.json',
        'scripts/component-doc-type-links.json',
        'scripts/update-component-docs.mjs',
        'typedoc.json',
        'tsconfig.typedoc.json',
    ], {
        cwd: root,
        ignoreInitial: true,
    })

    watcher.on('all', (_event, changedPath) => {
        routeChange(normalizePath(changedPath))
        scheduleRun()
    })

    console.log('watching component and TypeDoc API sources')

    return watcher
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
    startDocsApiWatcher()
}

function routeChange(changedPath) {
    if (componentPaths.has(changedPath)) {
        pendingComponents.add(changedPath)
        return
    }

    if (typedocEntries.has(changedPath)) {
        pendingTypedoc.add(changedPath)
        return
    }

    if (changedPath === 'typedoc.json' || changedPath === 'tsconfig.typedoc.json') {
        allTypedoc = true
        return
    }

    allComponents = true
}

function scheduleRun() {
    clearTimeout(timer)
    timer = setTimeout(() => {
        void flush()
    }, debounceMs)
}

async function flush() {
    if (isRunning) {
        runAgain = true
        return
    }

    isRunning = true

    try {
        do {
            runAgain = false
            const work = consumePendingWork()
            await runPendingWork(work)
        } while (runAgain)
    }
    finally {
        isRunning = false
    }
}

function consumePendingWork() {
    const work = {
        allComponents,
        allTypedoc,
        components: [...pendingComponents],
        typedoc: [...pendingTypedoc],
    }

    allComponents = false
    allTypedoc = false
    pendingComponents = new Set()
    pendingTypedoc = new Set()

    return work
}

async function runPendingWork(work) {
    if (work.allComponents) {
        await runComponentDocs([])
    }
    else if (work.components.length > 0) {
        await runComponentDocs(work.components)
    }

    if (work.allTypedoc) {
        await runTypeDoc(['--options', 'typedoc.json'])
    }
    else {
        for (const entryPath of work.typedoc) {
            await runTypedocEntry(entryPath)
        }
    }
}

async function runComponentDocs(componentPathsToUpdate) {
    const label = componentPathsToUpdate.length === 0 ? 'all component docs' : componentPathsToUpdate.join(', ')
    console.log(`updating ${label}`)
    await runCommand(process.execPath, ['scripts/update-component-docs.mjs', ...componentPathsToUpdate])
}

async function runTypedocEntry(entryPath) {
    const name = typedocEntries.get(entryPath)
    const tempDir = resolve(root, 'docs/.typedoc-watch', name)
    const targetDir = resolve(root, 'docs/api', name)

    console.log(`updating TypeDoc API for ${entryPath}`)
    rmSync(tempDir, { recursive: true, force: true })
    await runTypeDoc([
        '--options',
        'typedoc.json',
        '--entryPoints',
        entryPath,
        '--out',
        tempDir,
    ])

    const sourceDir = findGeneratedTypedocEntry(tempDir, name)
    rmSync(targetDir, { recursive: true, force: true })
    cpSync(sourceDir, targetDir, { recursive: true })
    rmSync(tempDir, { recursive: true, force: true })
}

function findGeneratedTypedocEntry(outputDir, name) {
    const directPath = resolve(outputDir, name)
    if (existsSync(directPath)) {
        return directPath
    }

    const nestedPath = findDirectory(outputDir, name)
    if (nestedPath !== undefined) {
        return nestedPath
    }

    throw new Error(`TypeDoc did not generate an API folder named ${name}`)
}

function findDirectory(directory, name) {
    for (const entry of readdirSync(directory)) {
        const fullPath = resolve(directory, entry)
        if (!statSync(fullPath).isDirectory()) continue
        if (entry === name) return fullPath

        const nestedPath = findDirectory(fullPath, name)
        if (nestedPath !== undefined) return nestedPath
    }

    return undefined
}

function runTypeDoc(args) {
    return runCommand(process.execPath, [resolve(root, 'node_modules/typedoc/bin/typedoc'), ...args])
}

function runCommand(command, args) {
    return new Promise((resolvePromise, reject) => {
        const child = spawn(command, args, { cwd: root, stdio: 'inherit' })

        child.on('error', reject)

        child.on('exit', (code) => {
            if (code === 0) {
                resolvePromise()
                return
            }

            reject(new Error(`${basename(command)} ${args.join(' ')} exited with code ${code}`))
        })
    })
}

function readJson(file) {
    return JSON.parse(readFileSync(file, 'utf8'))
}

function normalizePath(path) {
    return path.replaceAll('\\', '/')
}

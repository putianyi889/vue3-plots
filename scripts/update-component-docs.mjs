import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { createChecker } from 'vue-component-meta'

import { code, escapeTableCell, formatType, formatTypeCell } from './component-doc-markdown.mjs'

const root = process.cwd()
const outputDir = resolve(root, 'docs/.generated/api')
const checker = createChecker(resolve(root, 'tsconfig.json'), {
    schema: true,
})
const pages = readJson(resolve(root, 'scripts/component-doc-pages.json'))
const typeLinks = readJson(resolve(root, 'scripts/component-doc-type-links.json'))
const targets = getTargets(pages, process.argv.slice(2))

mkdirSync(outputDir, { recursive: true })

for (const [componentPath, name] of targets) {
    const component = resolve(root, componentPath)
    const output = resolve(outputDir, `${name}.md`)
    const meta = checker.getComponentMeta(component)
    const table = createComponentApi(meta)
    const current = readOptionalFile(output)

    if (table !== current) {
        writeFileSync(output, table)
        console.log(`updated docs/.generated/api/${name}.md`)
    }
}

function createComponentApi(meta) {
    return [
        createPropsSection(meta.props.filter(prop => !prop.global)),
        createEventsSection(meta.events || meta.emits || []),
        createSlotsSection(meta.slots || []),
        createExposedSection(meta.exposed || []),
    ].filter(Boolean).join('\n\n')
}

function createPropsSection(props) {
    if (props.length === 0) {
        return ''
    }

    return [
        '## Props',
        '',
        createPropsTable(props),
    ].join('\n')
}

function createPropsTable(props) {
    const rows = [
        '| Prop | Type | Default | Description |',
        '| --- | --- | --- | --- |',
    ]

    for (const prop of props) {
        rows.push([
            code(prop.name),
            formatTypeCell(prop.type, typeLinks),
            formatDefault(prop),
            escapeTableCell(prop.description || ''),
        ].join(' | ').replace(/^/, '| ').replace(/$/, ' |'))
    }

    return rows.join('\n')
}

function createEventsSection(events) {
    if (events.length === 0) {
        return ''
    }

    return [
        '## Events',
        '',
        createEventsTable(events),
    ].join('\n')
}

function createEventsTable(events) {
    const rows = [
        '| Event | Payload | Description |',
        '| --- | --- | --- |',
    ]

    for (const event of events) {
        rows.push([
            code(event.name),
            formatTypeCell(formatEventPayload(event.type || event.signature || ''), typeLinks),
            escapeTableCell(event.description || ''),
        ].join(' | ').replace(/^/, '| ').replace(/$/, ' |'))
    }

    return rows.join('\n')
}

function createSlotsSection(slots) {
    if (slots.length === 0) {
        return ''
    }

    return [
        '## Slots',
        '',
        createSlotsTable(slots),
    ].join('\n')
}

function createSlotsTable(slots) {
    const rows = [
        '| Slot | Props | Description |',
        '| --- | --- | --- |',
    ]

    for (const slot of slots) {
        rows.push([
            code(slot.name),
            formatSlotProps(slot.type || ''),
            escapeTableCell(slot.description || ''),
        ].join(' | ').replace(/^/, '| ').replace(/$/, ' |'))
    }

    return rows.join('\n')
}

function createExposedSection(exposed) {
    if (exposed.length === 0) {
        return ''
    }

    return [
        '## Exposed',
        '',
        createExposedTable(exposed),
    ].join('\n')
}

function createExposedTable(exposed) {
    const rows = [
        '| Exposed | Type | Description |',
        '| --- | --- | --- |',
    ]

    for (const item of exposed) {
        rows.push([
            code(item.name),
            formatTypeCell(item.type || '', typeLinks),
            escapeTableCell(item.description || ''),
        ].join(' | ').replace(/^/, '| ').replace(/$/, ' |'))
    }

    return rows.join('\n')
}

function formatEventPayload(type) {
    const formattedType = formatType(type)

    if (formattedType.startsWith('[') && formattedType.endsWith(']')) {
        return formatTuplePayload(formattedType.slice(1, -1))
    }

    return formattedType
}

function formatTuplePayload(type) {
    if (!type.includes(',') && /^[a-zA-Z_$][\w$]*\??: /.test(type)) {
        return type.replace(/^[a-zA-Z_$][\w$]*\??: /, '')
    }

    return type
}

function formatSlotProps(type) {
    const formattedType = formatType(type)

    if (formattedType === '' || formattedType === 'any') {
        return 'None'
    }

    return formatTypeCell(formattedType, typeLinks)
}

function formatDefault(prop) {
    if (prop.required) {
        return 'Required'
    }

    if (prop.default === undefined || prop.default === '' || prop.default === 'undefined') {
        return ''
    }

    return code(prop.default)
}

function readJson(file) {
    return JSON.parse(readFileSync(file, 'utf8'))
}

function readOptionalFile(file) {
    try {
        return readFileSync(file, 'utf8')
    }
    catch {
        return ''
    }
}

function getTargets(pages, args) {
    if (args.length === 0) {
        return pages
    }

    const requested = new Set(args.map(normalizeTarget))
    const targets = pages.filter(([componentPath, name]) => {
        return requested.has(normalizeTarget(componentPath)) || requested.has(normalizeTarget(name))
    })

    if (targets.length === 0) {
        throw new Error(`No component documentation targets matched: ${args.join(', ')}`)
    }

    return targets
}

function normalizeTarget(target) {
    return target.replaceAll('\\', '/').replace(/\.vue$/, '')
}

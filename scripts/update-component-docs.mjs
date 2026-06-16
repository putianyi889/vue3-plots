import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { createChecker } from 'vue-component-meta'

const root = process.cwd()
const outputDir = resolve(root, 'docs/.generated/props')
const checker = createChecker(resolve(root, 'tsconfig.json'), {
  schema: true,
})

const pages = [
  ['src/components/Grid.vue', 'grid'],
  ['src/components/Line.vue', 'line'],
  ['src/components/MiniPie.vue', 'mini-pie'],
  ['src/components/MouseDraw.vue', 'mouse-draw'],
  ['src/components/Scatter.vue', 'scatter'],
  ['src/components/TransformGroup.vue', 'transform-group'],
  ['src/components/XAxis.vue', 'x-axis'],
  ['src/components/XLabel.vue', 'x-label'],
  ['src/components/YAxis.vue', 'y-axis'],
  ['src/components/YLabel.vue', 'y-label'],
]

mkdirSync(outputDir, { recursive: true })

for (const [componentPath, name] of pages) {
  const component = resolve(root, componentPath)
  const output = resolve(outputDir, `${name}.md`)
  const meta = checker.getComponentMeta(component)
  const table = createPropsTable(meta.props.filter(prop => !prop.global))
  const current = readOptionalFile(output)

  if (table !== current) {
    writeFileSync(output, table)
    console.log(`updated docs/.generated/props/${name}.md`)
  }
}

function createPropsTable(props) {
  const rows = [
    '| Prop | Type | Default | Description |',
    '| --- | --- | --- | --- |',
  ]

  for (const prop of props) {
    rows.push([
      code(prop.name),
      code(formatType(prop.type)),
      formatDefault(prop),
      escapeTableCell(prop.description || ''),
    ].join(' | ').replace(/^/, '| ').replace(/$/, ' |'))
  }

  return rows.join('\n')
}

function formatType(type) {
  return type
    .replace(/\s+/g, ' ')
    .replaceAll(' | undefined', '')
    .replaceAll('undefined | ', '')
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

function code(value) {
  return `\`${escapeTableCell(value)}\``
}

function escapeTableCell(value) {
  return String(value).replaceAll('|', '\\|').replaceAll('\n', '<br>')
}

function readOptionalFile(file) {
  try {
    return readFileSync(file, 'utf8')
  }
  catch {
    return ''
  }
}

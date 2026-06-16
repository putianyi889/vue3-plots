export function code(value) {
    return `\`${escapeTableCell(value)}\``
}

export function escapeTableCell(value) {
    return String(value).replaceAll('|', '\\|').replaceAll('\n', '<br>')
}

export function formatType(type) {
    return type
        .replace(/\s+/g, ' ')
        .replaceAll(' | undefined', '')
        .replaceAll('undefined | ', '')
}

export function formatTypeCell(type, typeLinks) {
    const formattedType = formatType(type)
    const escapedType = escapeHtmlTags(escapeTableCell(formattedType))
    const linkedType = linkKnownTypes(escapedType, typeLinks)

    if (linkedType !== escapedType) {
        return `<code>${linkedType}</code>`
    }

    return code(formattedType)
}

function escapeHtmlTags(value) {
    return value.replaceAll('<', '&lt;').replaceAll('>', '&gt;')
}

function linkKnownTypes(type, typeLinks) {
    return type.replace(/\b[A-Z][A-Za-z0-9_]*\b/g, (typeName) => {
        const link = typeLinks[typeName]

        if (link === undefined) {
            return typeName
        }

        return `<a href="${toRelativeLink(link)}">${typeName}</a>`
    })
}

function toRelativeLink(link) {
    return link.replace(/^\//, '../')
}

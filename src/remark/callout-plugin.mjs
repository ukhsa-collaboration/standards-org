import { visit } from 'unist-util-visit'

/**
 * @import {Root} from 'mdast'
 * @import {Handlers, Handle} from 'mdast-util-to-markdown'
 * @import {} from 'remark-stringify'
 * @import {Processor, Transformer} from "unified"
 */

const CALLOUT_TYPES = ['NOTE', 'TIP', 'IMPORTANT', 'WARNING', 'CAUTION']
const CALLOUT_RE = new RegExp(
  '^\\[!(' + CALLOUT_TYPES.map(t => escapeRegExp(t)).join('|') + ')\\](?=\\s|$)'
)

// Utility: escape a string for use in a RegExp constructor
/**
 * Escapes special characters in a string for use in a RegExp constructor.
 * @param {string} str - The input string to escape.
 * @returns {string} - The escaped string.
 */
function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// 1. Transform plugin: convert leading [!TYPE] text into a custom node
/**
 * Callout marker plugin for remark.
 * @type {Processor<Root>}
 * @returns {Transformer}
 */
export function calloutMarkerPlugin() {
  // Register toMarkdown handler at plugin setup time
  // @ts-expect-error: TS is wrong about `this`.
  // eslint-disable-next-line unicorn/no-this-assignment
  const self = /** @type {Processor<Root>} */ (this)
  const data = self.data()
  
  data.toMarkdownExtensions ||= []

  data.toMarkdownExtensions.push({
    /** @type {Partial<Handlers & {calloutMarker:Handle}> | null | undefined} */
    handlers: {
      calloutMarker(node) {
        return node.value // emit raw "[!NOTE]" etc., no escaping
      }
    }
  })

  return (tree) => {
    visit(tree, 'blockquote', (/** @type {any} */ bq) => {
      const firstChild = bq.children?.[0]
      if (!firstChild || firstChild.type !== 'paragraph') return
      const firstText = firstChild.children?.[0]
      if (!firstText || firstText.type !== 'text') return
      const match = firstText.value.match(CALLOUT_RE)
      if (!match) return

      const full = match[0]              // e.g. [!NOTE]
      const rest = firstText.value.slice(full.length)

      // Replace the text node with a custom node
      firstChild.children.splice(0, 1, {
        type: 'calloutMarker',
        kind: match[1],
        value: full
      })

      if (rest.length) {
        firstChild.children.splice(1, 0, { type: 'text', value: rest })
      }
    })
  }
}
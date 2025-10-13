import { calloutMarkerPlugin } from './src/remark/callout-plugin.mjs'

export default {
  settings: {
    bullet: '-',
    tightDefinitions: true,
    incrementListMarker: false
  },
  plugins: [
    ['frontmatter', { type: 'yaml', marker: '-' }],
    ['gfm', { tablePipeAlign: false }],
    ['renumber-references', { preserveAlphanumericDefinitions: false }],
    calloutMarkerPlugin,
    'preset-lint-consistent',
    'preset-lint-recommended'
  ]
}

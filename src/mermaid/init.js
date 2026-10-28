// Runs in the browser. Eleventy copies this directory to /assets/mermaid/, next to
// the Mermaid bundle, so these relative imports resolve on the built site.
import mermaid from './mermaid.esm.min.mjs';
import { getThemeVariables } from './theme-variables.js';

// Mermaid's default theme, with its per-element colours swapped for the UKHSA brand
// and GOV.UK palette
mermaid.initialize({
  startOnLoad: true,
  theme: 'redux-color',
  look: 'neo',
  themeVariables: getThemeVariables(getComputedStyle(document.documentElement)),
});

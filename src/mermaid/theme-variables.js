/**
 * Read a diagram colour from its CSS custom property, as defined in
 * docs/assets/styles.scss.
 *
 * @param {CSSStyleDeclaration} styles - The computed styles of the document root.
 * @param {string} name - The colour name, without the --app-diagram- prefix.
 * @returns {string} - The colour, or an empty string if it isn't defined.
 */
const readColour = (styles, name) =>
  styles.getPropertyValue(`--app-diagram-${name}`).trim();

/**
 * Read a comma separated list of diagram colours from its CSS custom property.
 * Commas inside brackets are ignored, so values like rgb(1, 2, 3) stay whole.
 *
 * @param {CSSStyleDeclaration} styles - The computed styles of the document root.
 * @param {string} name - The list name, without the --app-diagram- prefix.
 * @returns {string[]} - The colours, or an empty array if the list isn't defined.
 */
const readColourList = (styles, name) =>
  readColour(styles, name)
    .split(/,(?![^(]*\))/)
    .map((colour) => colour.trim())
    .filter(Boolean);

/**
 * Build the Mermaid theme variables from the diagram colours defined in CSS.
 * Colours that aren't defined are left out, so Mermaid falls back to its defaults.
 *
 * @param {CSSStyleDeclaration} styles - The computed styles of the document root.
 * @returns {object} - The Mermaid themeVariables config.
 */
export const getThemeVariables = (styles) => {
  const textColour = readColour(styles, 'text');
  const borderColours = readColourList(styles, 'borders');
  const fillColours = readColourList(styles, 'fills');
  const labelBackground = readColour(styles, 'label-background');
  const subgraphFill = readColour(styles, 'subgraph-fill');
  const subgraphBorder = readColour(styles, 'subgraph-border');
  const noteFill = readColour(styles, 'note-fill');
  const noteBorder = readColour(styles, 'note-border');

  const themeVariables = {
    borderColorArray: borderColours,
    bkgColorArray: fillColours,
    primaryTextColor: textColour,
    primaryBorderColor: textColour,
    nodeBorder: textColour,
    stateBorder: textColour,
    actorBorder: textColour,
    textColor: textColour,
    edgeLabelBackground: labelBackground,
    clusterBkg: subgraphFill,
    clusterBorder: subgraphBorder,
    noteBkgColor: noteFill,
    noteBorderColor: noteBorder,
    noteTextColor: textColour,
  };

  return Object.fromEntries(
    Object.entries(themeVariables).filter(([, value]) => value.length > 0));
};

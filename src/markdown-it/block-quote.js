/**
 * Revert latest changes to blockquote rendering in markdown-it-govuk
 * https://github.com/x-govuk/markdown-it-govuk/commit/6e24c916037f8c093049010da120e1f6947c405e
 *
 * @param {Function} md - markdown-it instance
 * @param {*} options 
 */
export const blockQuoteRevert = (md, options = {}) => {
  const { rules } = md.renderer
  const defaultBlockQuoteRenderer =
    rules.blockquote_open ||
    function (tokens, idx, options, env, self) {
      return self.renderToken(tokens, idx, options)
    }

  rules.blockquote_open = (tokens, idx, options, env, self) => {
    const token = tokens[idx]
    const classes = "govuk-inset-text govuk-!-margin-left-0"

    if (token.attrGet('class')) {
        token.attrJoin('class', classes)
    } else {
        token.attrPush(['class', classes])
    }

    return defaultBlockQuoteRenderer(tokens, idx, options, env, self).replace(" app-blockquote","")
  }
}

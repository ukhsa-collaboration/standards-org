import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import markdownit from 'markdown-it';
import markdownItGovuk from 'markdown-it-govuk'

import { blockQuoteRevert } from '../../src/markdown-it/block-quote.js';

// avoid new instance of MarkdownIt for each call
describe('markdown-it block-quote', () => {
  it('Renders block quotes correctly', () => {
    // arrange
    let md = new markdownit().use(markdownItGovuk)

    const resultBefore = md.render('> block quote')

    assert.match(resultBefore, /^<blockquote class\="app-blockquote"\>/)

    md = md.use(blockQuoteRevert);
    // act
    const result = md.render('> block quote')

    // assert
    assert.match(result, /^<blockquote class\="govuk-inset-text govuk-!-margin-left-0"\>/)
  })
})
import assert from 'node:assert/strict'
import { describe, it, before } from 'node:test'
import markdownit from 'markdown-it';

import { headingRules } from '../../src/markdown-it/heading.js';

// avoid new instance of MarkdownIt for each call
describe('markdown-it headings', () => {

  let md;

  before(() => {
    // Set up the markdown-it instance with the heading rules
    md = new markdownit().use(headingRules);
  });

  it('Does not render headings if options.useMarkdownHeaderAsTitle is true', () => {
    // arrange
    const options = { useMarkdownHeaderAsTitle: true } // global options
    const frontMatter = { options } // page front matter

    // act
    const result = md.render('# Heading', frontMatter)

    // assert
    assert.equal(result, '')
  })

  it('Renders headings if options.useMarkdownHeaderAsTitle is false', () => {
    // arrange
    const options = { useMarkdownHeaderAsTitle: false } // global options
    const frontMatter = { options } // page front matter

    // act
    const result = md.render('# Heading', frontMatter)

    // assert
    assert.match(result, /<h1\>Heading/)
  })

  it('Renders headings if front matter useMarkdownHeaderAsTitle is false', () => {
    // arrange
    const options = { useMarkdownHeaderAsTitle: true } // global options
    const frontMatter = { options, useMarkdownHeaderAsTitle: false } // page front matter

    // act
    const result = md.render('# Heading', frontMatter)

    // assert
    assert.match(result, /<h1\>Heading/)
  })

  it('Does not render headings if front matter useMarkdownHeaderAsTitle is true', () => {
    // arrange
    const options = { useMarkdownHeaderAsTitle: false } // global options
    const frontMatter = { options, useMarkdownHeaderAsTitle: true } // page front matter

    //act 
    const result = md.render('# Heading', frontMatter)

    // assert
    assert.equal(result, '')
  })
})
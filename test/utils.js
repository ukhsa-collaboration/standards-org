import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { getDefaultTitle } from '../src/utils.js'

describe('getDefaultTitle utility', () => {
  it('Returns the extracted title from markdown', () => {
    // arrange
    const data = { page: { rawInput: '# Test Title' }, options: { useMarkdownHeaderAsTitle: true } }

    //act
    const result = getDefaultTitle(data)

    // assert
    assert.equal(result, 'Test Title')
  })

  it('Returns the extracted title from markdown regardless of additional text formatting', () => {
    // arrange
    const data = { page: { rawInput: '# Test Title **bold** `stuff`' }, options: { useMarkdownHeaderAsTitle: true } }

    // act
    const result = getDefaultTitle(data)

    // assert
    assert.equal(result, 'Test Title bold stuff')
  })

  it('Returns explicit title if provided and options.useMarkdownHeaderAsTitle is true', () => {
    // arrange
    const data = { title: 'Explicit Title', page: { rawInput: '# Test Title' }, options: { useMarkdownHeaderAsTitle: true } }

    // act
    const result = getDefaultTitle(data)

    // assert
    assert.equal(result, 'Explicit Title')
  })

  it('Returns explicit title if provided and options.useMarkdownHeaderAsTitle is false', () => {
    // arrange
    const data = { title: 'Explicit Title', page: { rawInput: '# Test Title' }, options: { useMarkdownHeaderAsTitle: false } }

    // act
    const result = getDefaultTitle(data)

    // assert
    assert.equal(result, 'Explicit Title')
  })

  it('Returns null if no title can be extracted', () => {
    // arrange
    const data = { page: { rawInput: '' }, options: { useMarkdownHeaderAsTitle: true } }

    // act
    const result = getDefaultTitle(data)

    // assert
    assert.equal(result, null)
  })

  it('Returns undefined if eleventyExcludeFromCollections is true', () => {
    // arrange
    const data = { eleventyExcludeFromCollections: true, page: { rawInput: '# Test Title' } }

    // act
    const result = getDefaultTitle(data)

    // assert
    assert.equal(result, undefined)
  })

  it('Returns undefined if options.useMarkdownHeaderAsTitle is false and no title is explicitly set', () => {
    // arrange
    const data = { page: { rawInput: '# Test Title' }, options: { useMarkdownHeaderAsTitle: false } }

    // act
    const result = getDefaultTitle(data)

    // assert
    assert.equal(result, undefined)
  })
})
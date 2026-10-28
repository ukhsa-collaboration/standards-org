import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { getThemeVariables } from '../../src/mermaid/theme-variables.js'

// stand-in for the CSSStyleDeclaration returned by getComputedStyle
const stylesWith = (properties) => ({
  getPropertyValue: (name) => properties[name] ?? '',
})

describe('mermaid theme variables', () => {
  it('Reads the diagram colours from CSS custom properties', () => {
    // arrange
    const styles = stylesWith({
      '--app-diagram-text': ' #0b0c0c',
      '--app-diagram-label-background': ' #f3f3f3',
      '--app-diagram-subgraph-fill': ' #f3f3f3',
      '--app-diagram-subgraph-border': ' #cecece',
      '--app-diagram-note-fill': ' #fff8cc',
      '--app-diagram-note-border': ' #bfa600',
    })

    // act
    const result = getThemeVariables(styles)

    // assert
    assert.equal(result.primaryTextColor, '#0b0c0c')
    assert.equal(result.actorBorder, '#0b0c0c')
    assert.equal(result.edgeLabelBackground, '#f3f3f3')
    assert.equal(result.clusterBkg, '#f3f3f3')
    assert.equal(result.clusterBorder, '#cecece')
    assert.equal(result.noteBkgColor, '#fff8cc')
    assert.equal(result.noteBorderColor, '#bfa600')
  })

  it('Splits the border and fill colour lists in order', () => {
    // arrange
    const styles = stylesWith({
      '--app-diagram-borders': ' #007C91, #1d70b8, #0f7a52',
      '--app-diagram-fills': ' #f3f9f9, #f4f8fb, #f3f8f6',
    })

    // act
    const result = getThemeVariables(styles)

    // assert
    assert.deepEqual(result.borderColorArray, ['#007C91', '#1d70b8', '#0f7a52'])
    assert.deepEqual(result.bkgColorArray, ['#f3f9f9', '#f4f8fb', '#f3f8f6'])
  })

  it('Keeps colour functions whole when splitting colour lists', () => {
    // arrange
    const styles = stylesWith({
      '--app-diagram-borders': ' rgb(0, 124, 145), #1d70b8',
    })

    // act
    const result = getThemeVariables(styles)

    // assert
    assert.deepEqual(result.borderColorArray, ['rgb(0, 124, 145)', '#1d70b8'])
  })

  it('Leaves out colours that are not defined so Mermaid uses its defaults', () => {
    // arrange
    const styles = stylesWith({})

    // act
    const result = getThemeVariables(styles)

    // assert
    assert.deepEqual(result, {})
  })
})

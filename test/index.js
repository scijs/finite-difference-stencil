/* global describe, it */

'use strict'

var stencil = require('../')
var assert = require('chai').assert
var almostEqual = require('almost-equal')

assert.vectorAlmostEqual = function vectorAlmostEqual (a, b) {
  assert(a.length === b.length, 'a.length (' + a.length + ') !== b.length (' + b.length + ')')
  for (var i = 0; i < a.length; i++) {
    assert(almostEqual(a[i], b[i], 1e-7, 1e-7), 'a[' + i + '] (' + a[i] + ') !== b[' + i + '] (' + b[i] + ')')
  }
}

// High order compact schemes from
// Lele, S. K. (1992). Compact Finite Difference Schemes with Spectral-like Resolution. Journal of Computational Physics, 103, 16-42.
//
// Low order schemes from wikipedia
// https://en.wikipedia.org/wiki/Finite_difference_coefficient

describe('finite-difference-stencil', function () {
  it('throws if deriv is not a positive integer', function () {
    assert.throws(function () {
      stencil([2], [-1, 1], 2)
    }, Error, /expected derivative number/)
  })

  it('throws if deriv is not a positive integer', function () {
    assert.throws(function () {
      stencil(-1, [-1, 1], 2)
    }, Error, /expected derivative number/)
  })

  it('throws if A is not an Array', function () {
    assert.throws(function () {
      stencil(0, 2, 2)
    }, Error, /expected points/)
  })

  it('A singular scheme returns false', function () {
    assert.isFalse(stencil(0, [-1, 1, -1, 1], 2))
  })

  it('A non-singular scheme returns true', function () {
    assert(!!stencil(0, [-1, 1]))
  })

  it('Average of two points', function () {
    var c = [-1, 1]
    assert(stencil(0, c))
    var expected = [0.5, 0.5]
    assert.vectorAlmostEqual(c, expected)
  })

  it('First order central difference', function () {
    var c = [-1, 0, 1]
    assert(stencil(1, c))
    var expected = [-0.5, 0, 0.5]
    assert.vectorAlmostEqual(c, expected)
  })

  it('Second order central difference', function () {
    var c = [-1, 0, 1]
    assert(stencil(2, c))
    var expected = [1, -2, 1]
    assert.vectorAlmostEqual(c, expected)
  })

  it('Sixth order fourth derivative', function () {
    var c = [-4, -3, -2, -1, 0, 1, 2, 3, 4]
    assert(stencil(4, c))
    var expected = [7/240, -2/5, 169/60, -122/15, 91/8, -122/15, 169/60, -2/5, 7/240]
    assert.vectorAlmostEqual(c, expected)
  })

  it('Fourth order third forward difference', function () {
    var c = [0, 1, 2, 3, 4, 5, 6]
    assert(stencil(3, c))
    var expected = [-49/8, 29, -461/8, 62, -307/8, 13, -15/8]
    assert.vectorAlmostEqual(c, expected)
  })

  it('Sixth order compact second derivative (Lele Eq. (2.2.7))', function () {
    var c = [-1, 1, -2, -1, 0, 1, 2]
    assert(stencil(2, c, 2))
    var expected = [2/11, 2/11, 3/44, 12/11, -51/22, 12/11, 3/44]
    assert.vectorAlmostEqual(c, expected)
  })

  it('Eighth order compact first derivative (Lele Eq. 2.1.12))', function () {
    var c = [-2, -1, 1, 2, -2, -1, 0, 1, 2]
    assert(stencil(1, c, 4))
    var expected = [1/36, 4/9, 4/9, 1/36, -25/216, -20/27, 0, 20/27, 25/216]
    assert.vectorAlmostEqual(c, expected)
  })
})

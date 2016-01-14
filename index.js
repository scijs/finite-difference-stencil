'use strict'

module.exports = computeCoefficients

var lup = require('ndarray-lup-factorization')
var solve = require('ndarray-lup-solve')
var pool = require('ndarray-scratch')
var ndarray = require('ndarray')

function computeCoefficients (deriv, points, ni, A, P) {
  var i, j, x, fac

  if (Number(deriv) !== deriv || deriv % 1 !== 0 || deriv < 0) {
    throw new Error('expected derivative number to be a positive integer. Got', deriv)
  }

  if (!Array.isArray(points)) {
    throw new Error('expected points to be an Array. Got a ' + (typeof A))
  }

  var allocateA = !A
  var n = points.length
  var ni = ni || 0
  var ne = n - ni

  if (allocateA) {
    A = pool.zeros([n, n])
  }
  if (!P) {
    P = new Array(n)
  }

  for (j = 0; j < ni; j++) {
    for (i = deriv, x = 1, fac = 1; i < n; i++, x *= points[j], fac *= (i - deriv)) {
      A.set(i, j, - x / fac)
    }
  }

  for (j = ni; j < n; j++) {
    for (i = 0, x = 1, fac = 1; i < n; i++, x *= points[j], fac *= i) {
      A.set(i, j, x / fac)
    }
  }

  for (i = 0; i < n; i++) {
    points[i] = deriv === i ? 1 : 0
  }

  lup(A, A, P)
  var solved = solve(A, A, P, ndarray(points))

  if (allocateA) {
    pool.free(A)
  }

  return solved
}


# build time tests for chess plugin
# see http://mochajs.org/

chess = require '../client/chess'
expect = require 'expect.js'

describe 'chess plugin', ->

  describe 'expand', ->

    it 'can make itallic', ->
      result = chess.expand 'hello *world*'
      expect(result).to.be 'hello <i>world</i>'

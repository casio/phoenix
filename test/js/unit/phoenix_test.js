import assert from 'assert'
import sinon from 'sinon'
import {Channel} from '../../../web/static/js/phoenix'

const noop = () => {}

describe('Channel', () => {
  const topic = 'foo',
        params = {},
        socket = {reconnectAfterMs: noop, log: noop}
  let ch

  beforeEach(() => {
    ch = new Channel(topic, params, socket)
  })

  describe('ctor', () => {
    context('when instanciating w/ params', () => {
      it('should save given params as inst vars', () => {
        assert.equal(ch.topic, topic)
        assert.equal(ch.params, params)
        assert.equal(ch.socket, socket)
      })
    })
    context('when instanciating w/o params', () => {
      it('should provide defaults for optional params', () => {
        ch = new Channel(topic, null, socket)
        assert.equal(typeof ch.params, 'object')
      })
    })

    it('should create & prepare a callback for an initial join push event', () => {
      assert.equal(ch.state, 'closed')
      assert.equal(ch.joinedOnce, false)
      // TODO(casio): clearify if Push should remain private & eventually use it here
      assert.ok(ch.joinPush instanceof Object, 'joinPush must be a Push instance')

      // Fake the push join to be successful
      const {status, callback} = ch.joinPush.recHooks[0],
            timerMock = sinon.mock(ch.rejoinTimer)
      timerMock.expects('reset').once()
      assert.equal(status, 'ok')
      callback()
      timerMock.verify()
      assert.equal(ch.state, 'joined')
      // TODO(casio): clearfiy - shouldnt `joinedOnce` be true now, as well?
      // assert.equal(ch.joinedOnce, true)
    });

    it('should setup a rejoin timer');
    it('should setup reply, close & error callbacks');

  })
})

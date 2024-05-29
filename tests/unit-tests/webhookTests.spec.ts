import { checkWebhookHeader } from '../../src'

const secret = 'secret'
const data = Buffer.from('data')

const validHeader = 'v1=1b2c16b75bd2a870c114153ccda5bcfca63314bc722fa160d690de133ccbb9db'

describe('Check webhook signature', () => {
  it('with valid signature', () => {
    expect(checkWebhookHeader(validHeader, data, secret)).toEqual(true)
  })

  it('with invalid header', () => {
    expect(checkWebhookHeader('v2=invalid', data, secret)).toEqual(false)
  })

  it('with header without version', () => {
    expect(checkWebhookHeader('invalid', data, secret)).toEqual(false)
  })

  it('with empty header', () => {
    expect(checkWebhookHeader('', data, secret)).toEqual(false)
  })

  it('with empty secret', () => {
    expect(checkWebhookHeader(validHeader, data, '')).toEqual(false)
  })

  it('with empty data', () => {
    expect(checkWebhookHeader(validHeader, Buffer.from(''), secret)).toEqual(false)
  })
})

import { isValidHmacSignature } from '../../src'

const secret = 'secret'
const data = Buffer.from('data')

const validHeader = 'v1=1b2c16b75bd2a870c114153ccda5bcfca63314bc722fa160d690de133ccbb9db'

describe('Is valid hmac signature', () => {
  it('with valid signature', () => {
    expect(isValidHmacSignature(validHeader, data, secret)).toEqual(true)
  })

  it('with invalid header', () => {
    expect(isValidHmacSignature('v2=invalid', data, secret)).toEqual(false)
  })

  it('with header without version', () => {
    expect(isValidHmacSignature('invalid', data, secret)).toEqual(false)
  })

  it('with empty header', () => {
    expect(isValidHmacSignature('', data, secret)).toEqual(false)
  })

  it('with empty secret', () => {
    expect(isValidHmacSignature(validHeader, data, '')).toEqual(false)
  })

  it('with empty data', () => {
    expect(isValidHmacSignature(validHeader, Buffer.from(''), secret)).toEqual(false)
  })
})

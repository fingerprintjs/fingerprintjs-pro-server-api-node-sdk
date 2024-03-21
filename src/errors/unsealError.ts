import { DecryptionKey } from '../sealedResults'

export class UnsealError extends Error {
  constructor(
    readonly key: DecryptionKey,
    readonly error?: Error
  ) {
    let msg = `Unable to decrypt sealed data`

    if (error) {
      msg = msg.concat(`: ${error.message}`)
    }

    super(msg)
    this.name = 'UnsealError'
  }
}

export class UnsealAggregateError extends Error {
  constructor(readonly errors: UnsealError[]) {
    super('Unable to decrypt sealed data')
    this.name = 'UnsealAggregateError'
  }

  addError(error: UnsealError) {
    this.errors.push(error)
  }

  toString() {
    return this.errors.map((e) => e.toString()).join('\n')
  }
}

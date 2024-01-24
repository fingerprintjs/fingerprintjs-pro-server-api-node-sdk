import { DecryptionKey } from '../sealedResults';

export class UnsealError extends Error {
  constructor(readonly key: DecryptionKey) {
    super('Unable to decrypt sealed data');
    this.name = 'UnsealError';
  }
}

export class UnsealAggregateError extends Error {
  constructor(readonly errors: UnsealError[]) {
    super('Unable to decrypt sealed data');
    this.name = 'UnsealAggregateError';
  }

  addError(error: UnsealError) {
    this.errors.push(error);
  }
}

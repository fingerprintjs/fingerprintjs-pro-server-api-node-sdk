import { isEventError, isVisitorsError } from '../../src/types';
import getEventError403 from '../mocked-responses-tests/mocked-responses-data/external/get_event_403_error.json';

describe('getEvent type guard', () => {
  test('error 403 TokenRequired', () => {
    const response = { ...getEventError403, status: 403 };
    expect(isEventError(response)).toBe(true);
  });

  test('error 403 TokenNotFound', () => {
    const response = {
      status: 403,
      error: {
        code: 'TokenNotFound',
        message: 'Some random message TokenNotFound',
      },
    };
    expect(isEventError(response)).toBe(true);
  });

  test('error 403 SubscriptionNotActive', () => {
    const response = {
      status: 403,
      error: {
        code: 'SubscriptionNotActive',
        message: 'Some random message SubscriptionNotActive',
      },
    };
    expect(isEventError(response)).toBe(true);
  });

  test('error 403 WrongRegion', () => {
    const response = {
      status: 403,
      error: {
        code: 'WrongRegion',
        message: 'Some random message WrongRegion',
      },
    };
    expect(isEventError(response)).toBe(true);
  });

  test('error 404 RequestNotFound', () => {
    const response = {
      status: 404,
      error: {
        code: 'RequestNotFound',
        message: 'Some random message RequestNotFound',
      },
    };
    expect(isEventError(response)).toBe(true);
  });

  test('empty object', () => {
    const response = {};
    expect(isEventError(response)).toBe(false);
  });

  test('null', () => {
    const response = null;
    expect(isEventError(response)).toBe(false);
  });

  test('undefined', () => {
    const response = undefined;
    expect(isEventError(response)).toBe(false);
  });

  test('wrong code', () => {
    const response = {
      status: -100,
      error: {
        code: 'WrongRegion',
        message: 'Some random message WrongRegion',
      },
    };
    expect(isEventError(response)).toBe(false);
  });

  test('no error field', () => {
    const response = {
      status: 403,
    };
    expect(isEventError(response)).toBe(false);
  });

  test('null error field', () => {
    const response = {
      status: 403,
      error: null,
    };
    expect(isEventError(response)).toBe(false);
  });

  test('error field is empty object', () => {
    const response = {
      status: 403,
      error: {},
    };
    expect(isEventError(response)).toBe(false);
  });
});

describe('getVisitorHistory type guard', () => {
  test('error 403', () => {
    const response = {
      status: 403,
      error: '403 Forbidden',
    };
    expect(isVisitorsError(response)).toBe(true);
  });

  test('error 429', () => {
    const response = {
      status: 429,
      retryAfter: 10,
      error: 'Too Many Requests',
    };
    expect(isVisitorsError(response)).toBe(true);
  });

  test('empty object', () => {
    const response = {};
    expect(isVisitorsError(response)).toBe(false);
  });

  test('null', () => {
    const response = null;
    expect(isVisitorsError(response)).toBe(false);
  });

  test('undefined', () => {
    const response = undefined;
    expect(isVisitorsError(response)).toBe(false);
  });

  test('wrong code', () => {
    const response = {
      status: -100,
      error: 'Some text',
    };
    expect(isVisitorsError(response)).toBe(false);
  });

  test('no error field', () => {
    const response = {
      status: 403,
    };
    expect(isVisitorsError(response)).toBe(false);
  });

  test('null error field', () => {
    const response = {
      status: 403,
      error: null,
    };
    expect(isVisitorsError(response)).toBe(false);
  });

  test('error field is object', () => {
    const response = {
      status: 403,
      error: {},
    };
    expect(isVisitorsError(response)).toBe(false);
  });
});

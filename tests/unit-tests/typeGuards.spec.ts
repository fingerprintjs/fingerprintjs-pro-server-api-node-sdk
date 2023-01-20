import {
  isEventError403,
  isEventError404,
  isVisitorsError403,
  isVisitorsError429,
  EventError,
  VisitorsError,
} from '../../src/types';
import getEventError403 from '../mocked-responses-tests/mocked-responses-data/external/get_event_403_error.json';

describe('getEvent type guard', () => {
  test('error 403 TokenRequired', () => {
    const response = { ...getEventError403, status: 403 } as EventError;
    expect(isEventError403(response)).toBe(true);
    expect(isEventError404(response)).toBe(false);
  });

  test('error 403 TokenNotFound', () => {
    const response: EventError = {
      status: 403,
      error: {
        code: 'TokenNotFound',
        message: 'Some random message TokenNotFound',
      },
    };
    expect(isEventError403(response)).toBe(true);
    expect(isEventError404(response)).toBe(false);
  });

  test('error 403 SubscriptionNotActive', () => {
    const response: EventError = {
      status: 403,
      error: {
        code: 'SubscriptionNotActive',
        message: 'Some random message SubscriptionNotActive',
      },
    };
    expect(isEventError403(response)).toBe(true);
    expect(isEventError404(response)).toBe(false);
  });

  test('error 403 WrongRegion', () => {
    const response: EventError = {
      status: 403,
      error: {
        code: 'WrongRegion',
        message: 'Some random message WrongRegion',
      },
    };
    expect(isEventError403(response)).toBe(true);
    expect(isEventError404(response)).toBe(false);
  });

  test('error 404 RequestNotFound', () => {
    const response: EventError = {
      status: 404,
      error: {
        code: 'RequestNotFound',
        message: 'Some random message RequestNotFound',
      },
    };
    expect(isEventError403(response)).toBe(false);
    expect(isEventError404(response)).toBe(true);
  });
});

describe('getVisitorHistory type guard', () => {
  test('error 403', () => {
    const response: VisitorsError = {
      status: 403,
      error: '403 Forbidden',
    };
    expect(isVisitorsError403(response)).toBe(true);
    expect(isVisitorsError429(response)).toBe(false);
  });

  test('error 429', () => {
    const response: VisitorsError = {
      status: 429,
      retryAfter: 10,
      error: 'Too Many Requests',
    };
    expect(isVisitorsError403(response)).toBe(false);
    expect(isVisitorsError429(response)).toBe(true);
  });
});

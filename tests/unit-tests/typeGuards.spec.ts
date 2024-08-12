import getEventError403 from '../mocked-responses-tests/mocked-responses-data/external/get_event_403_error.json'
import getEventError404 from '../mocked-responses-tests/mocked-responses-data/external/get_event_404_error.json'
import {
  EventError403,
  EventError404,
  EventResponse403,
  EventResponse404,
  isEventError,
  isVisitorsError,
  VisitorsError403,
  VisitorsError429,
} from '../../src'

describe('getEvent type guard', () => {
  test('error 403 TokenRequired', () => {
    const response = new EventError403(getEventError403 as EventResponse403, new Response())
    expect(isEventError(response)).toBe(true)
  })

  test('error 403 TokenNotFound', () => {
    const response = new EventError403(
      {
        error: {
          code: 'TokenNotFound',
          message: 'Some random message TokenNotFound',
        },
      },
      new Response()
    )
    expect(isEventError(response)).toBe(true)
  })

  test('error 403 SubscriptionNotActive', () => {
    const response = new EventError403(
      {
        error: {
          code: 'SubscriptionNotActive',
          message: 'Some random message SubscriptionNotActive',
        },
      },
      new Response()
    )
    expect(isEventError(response)).toBe(true)
  })

  test('error 403 WrongRegion', () => {
    const response = new EventError403(
      {
        error: {
          code: 'WrongRegion',
          message: 'Some random message WrongRegion',
        },
      },
      new Response()
    )
    expect(isEventError(response)).toBe(true)
  })

  test('error 404 RequestNotFound', () => {
    const response = new EventError404(getEventError404 as EventResponse404, new Response())
    expect(isEventError(response)).toBe(true)
  })

  test('empty object', () => {
    const response = {}
    expect(isEventError(response)).toBe(false)
  })

  test('null', () => {
    const response = null
    expect(isEventError(response)).toBe(false)
  })

  test('undefined', () => {
    const response = undefined
    expect(isEventError(response)).toBe(false)
  })

  test('no error field', () => {
    const response = {
      status: 403,
    }
    expect(isEventError(response)).toBe(false)
  })

  test('null error field', () => {
    const response = {
      status: 403,
      error: null,
    }
    expect(isEventError(response)).toBe(false)
  })

  test('error field is empty object', () => {
    const response = {
      status: 403,
      error: {},
    }
    expect(isEventError(response)).toBe(false)
  })
})

describe('getVisitorHistory type guard', () => {
  test('error 403', () => {
    const response = new VisitorsError403(
      {
        error: '403 Forbidden',
        status: 403,
      },
      new Response()
    )
    expect(isVisitorsError(response)).toBe(true)
  })

  test('error 429', () => {
    const httpResponse = new Response()
    httpResponse.headers.set('Retry-After', '10')
    const response = new VisitorsError429(
      {
        error: 'Too Many Requests',
      },
      httpResponse
    )
    expect(isVisitorsError(response)).toBe(true)
  })

  test('empty object', () => {
    const response = {}
    expect(isVisitorsError(response)).toBe(false)
  })

  test('null', () => {
    const response = null
    expect(isVisitorsError(response)).toBe(false)
  })

  test('undefined', () => {
    const response = undefined
    expect(isVisitorsError(response)).toBe(false)
  })

  test('no error field', () => {
    const response = {
      status: 403,
    }
    expect(isVisitorsError(response)).toBe(false)
  })

  test('null error field', () => {
    const response = {
      status: 403,
      error: null,
    }
    expect(isVisitorsError(response)).toBe(false)
  })

  test('error field is object', () => {
    const response = {
      status: 403,
      error: {},
    }
    expect(isVisitorsError(response)).toBe(false)
  })
})

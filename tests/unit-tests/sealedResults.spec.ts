import {
  DecryptionAlgorithm,
  parseEventsResponse,
  UnsealAggregateError,
  UnsealError,
  unsealEventsResponse,
} from '../../src';

describe('Parse events response', () => {
  it('throws if response is not valid events response', () => {
    expect(() => {
      parseEventsResponse('{}');
    }).toThrowError('Sealed data is not valid events response');
  });
});

describe('Unseal event response', () => {
  const sealedData = Buffer.from(
    'noXc7SXO+mqeAGrvBMgObi/S0fXTpP3zupk8qFqsO/1zdtWCD169iLA3VkkZh9ICHpZ0oWRzqG0M9/TnCeKFohgBLqDp6O0zEfXOv6i5q++aucItznQdLwrKLP+O0blfb4dWVI8/aSbd4ELAZuJJxj9bCoVZ1vk+ShbUXCRZTD30OIEAr3eiG9aw00y1UZIqMgX6CkFlU9L9OnKLsNsyomPIaRHTmgVTI5kNhrnVNyNsnzt9rY7fUD52DQxJILVPrUJ1Q+qW7VyNslzGYBPG0DyYlKbRAomKJDQIkdj/Uwa6bhSTq4XYNVvbk5AJ/dGwvsVdOnkMT2Ipd67KwbKfw5bqQj/cw6bj8Cp2FD4Dy4Ud4daBpPRsCyxBM2jOjVz1B/lAyrOp8BweXOXYugwdPyEn38MBZ5oL4D38jIwR/QiVnMHpERh93jtgwh9Abza6i4/zZaDAbPhtZLXSM5ztdctv8bAb63CppLU541Kf4OaLO3QLvfLRXK2n8bwEwzVAqQ22dyzt6/vPiRbZ5akh8JB6QFXG0QJF9DejsIspKF3JvOKjG2edmC9o+GfL3hwDBiihYXCGY9lElZICAdt+7rZm5UxMx7STrVKy81xcvfaIp1BwGh/HyMsJnkE8IczzRFpLlHGYuNDxdLoBjiifrmHvOCUDcV8UvhSV+UAZtAVejdNGo5G/bz0NF21HUO4pVRPu6RqZIs/aX4hlm6iO/0Ru00ct8pfadUIgRcephTuFC2fHyZxNBC6NApRtLSNLfzYTTo/uSjgcu6rLWiNo5G7yfrM45RXjalFEFzk75Z/fu9lCJJa5uLFgDNKlU+IaFjArfXJCll3apbZp4/LNKiU35ZlB7ZmjDTrji1wLep8iRVVEGht/DW00MTok7Zn7Fv+MlxgWmbZB3BuezwTmXb/fNw==',
    'base64'
  );
  const validKey = Buffer.from('p2PA7MGy5tx56cnyJaFZMr96BCFwZeHjZV2EqMvTq53=', 'base64');
  const invalidKey = Buffer.from('a2PA7MGy5tx56cnyJaFZMr96BCFwZeHjZV2EqMvTq53=', 'base64');

  it('unseals sealed data using aes256gcm', async () => {
    const result = await unsealEventsResponse(sealedData, [
      {
        key: invalidKey,
        algorithm: DecryptionAlgorithm.Aes256Gcm,
      },
      {
        key: validKey,
        algorithm: DecryptionAlgorithm.Aes256Gcm,
      },
    ]);

    expect(result).toBeTruthy();
    expect(result).toMatchInlineSnapshot(`
      Object {
        "products": Object {
          "botd": Object {
            "data": Object {
              "bot": Object {
                "result": "notDetected",
              },
              "ip": "::1",
              "meta": Object {
                "foo": "bar",
              },
              "requestId": "1703067132750.Z5hutJ",
              "time": "2023-12-20T10:12:13.894Z",
              "url": "http://localhost:8080/",
              "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3 Safari/605.1.15",
            },
          },
          "identification": Object {
            "data": Object {
              "browserDetails": Object {
                "browserFullVersion": "17.3",
                "browserMajorVersion": "17",
                "browserName": "Safari",
                "device": "Other",
                "os": "Mac OS X",
                "osVersion": "10.15.7",
                "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3 Safari/605.1.15",
              },
              "confidence": Object {
                "score": 1,
              },
              "firstSeenAt": Object {
                "global": "2023-12-15T12:13:55.103Z",
                "subscription": "2023-12-15T12:13:55.103Z",
              },
              "incognito": false,
              "ip": "::1",
              "ipLocation": Object {
                "accuracyRadius": 1000,
                "city": Object {
                  "name": "Stockholm",
                },
                "continent": Object {
                  "code": "EU",
                  "name": "Europe",
                },
                "country": Object {
                  "code": "SE",
                  "name": "Sweden",
                },
                "latitude": 59.3241,
                "longitude": 18.0517,
                "postalCode": "100 05",
                "subdivisions": Array [
                  Object {
                    "isoCode": "AB",
                    "name": "Stockholm County",
                  },
                ],
                "timezone": "Europe/Stockholm",
              },
              "lastSeenAt": Object {
                "global": "2023-12-19T11:39:51.52Z",
                "subscription": "2023-12-19T11:39:51.52Z",
              },
              "requestId": "1703067132750.Z5hutJ",
              "tag": Object {
                "foo": "bar",
              },
              "time": "2023-12-20T10:12:16Z",
              "timestamp": 1703067136286,
              "url": "http://localhost:8080/",
              "visitorFound": true,
              "visitorId": "2ZEDCZEfOfXjEmMuE3tq",
            },
          },
        },
      }
    `);
  });

  it('throws error if header is not correct', async () => {
    const invalidData = Buffer.from(
      'xzXc7SXO+mqeAGrvBMgObi/S0fXTpP3zupk8qFqsO/1zdtWCD169iLA3VkkZh9ICHpZ0oWRzqG0M9/TnCeKFohgBLqDp6O0zEfXOv6i5q++aucItznQdLwrKLP+O0blfb4dWVI8/aSbd4ELAZuJJxj9bCoVZ1vk+ShbUXCRZTD30OIEAr3eiG9aw00y1UZIqMgX6CkFlU9L9OnKLsNsyomPIaRHTmgVTI5kNhrnVNyNsnzt9rY7fUD52DQxJILVPrUJ1Q+qW7VyNslzGYBPG0DyYlKbRAomKJDQIkdj/Uwa6bhSTq4XYNVvbk5AJ/dGwvsVdOnkMT2Ipd67KwbKfw5bqQj/cw6bj8Cp2FD4Dy4Ud4daBpPRsCyxBM2jOjVz1B/lAyrOp8BweXOXYugwdPyEn38MBZ5oL4D38jIwR/QiVnMHpERh93jtgwh9Abza6i4/zZaDAbPhtZLXSM5ztdctv8bAb63CppLU541Kf4OaLO3QLvfLRXK2n8bwEwzVAqQ22dyzt6/vPiRbZ5akh8JB6QFXG0QJF9DejsIspKF3JvOKjG2edmC9o+GfL3hwDBiihYXCGY9lElZICAdt+7rZm5UxMx7STrVKy81xcvfaIp1BwGh/HyMsJnkE8IczzRFpLlHGYuNDxdLoBjiifrmHvOCUDcV8UvhSV+UAZtAVejdNGo5G/bz0NF21HUO4pVRPu6RqZIs/aX4hlm6iO/0Ru00ct8pfadUIgRcephTuFC2fHyZxNBC6NApRtLSNLfzYTTo/uSjgcu6rLWiNo5G7yfrM45RXjalFEFzk75Z/fu9lCJJa5uLFgDNKlU+IaFjArfXJCll3apbZp4/LNKiU35ZlB7ZmjDTrji1wLep8iRVVEGht/DW00MTok7Zn7Fv+MlxgWmbZB3BuezwTmXb/fNw==',
      'base64'
    );

    await expect(
      unsealEventsResponse(invalidData, [
        {
          key: invalidKey,
          algorithm: DecryptionAlgorithm.Aes256Gcm,
        },
        {
          key: validKey,
          algorithm: DecryptionAlgorithm.Aes256Gcm,
        },
      ])
    ).rejects.toThrowError('Invalid sealed data header');
  });

  it('throws error if invalid algorithm is provided', async () => {
    await expect(
      unsealEventsResponse(sealedData, [
        {
          key: invalidKey,
          algorithm: 'invalid-algorithm' as DecryptionAlgorithm,
        },
      ])
    ).rejects.toThrowError('Unsupported decryption algorithm: invalid-algorithm');
  });

  it('throws error if all decryption keys are invalid', async () => {
    const key = {
      key: invalidKey,
      algorithm: DecryptionAlgorithm.Aes256Gcm,
    };

    await expect(unsealEventsResponse(sealedData, [key])).rejects.toThrow(
      new UnsealAggregateError([new UnsealError(key)])
    );
  });
});

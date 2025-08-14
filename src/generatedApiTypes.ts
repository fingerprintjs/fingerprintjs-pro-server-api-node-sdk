export interface paths {
  '/events/{event_id}': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Get event by event Id
     * @description Get a detailed analysis of an individual identification event, including Smart Signals.
     *     Use `event_id` as the URL path parameter. This API method is scoped to a request, i.e. all returned information is by `event_id`.
     *
     */
    get: operations['getEvent']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    /**
     * Update select fields of an event using an event Id
     * @description Change information in existing events specified by `event_id` or *flag suspicious events*.
     *
     *     When an event is created, it can be assigned `linked_id` and `tags` submitted through the JS agent parameters.
     *     This information might not have been available on the client initially, so the Server API permits updating these attributes after the fact.
     *
     *     **Warning** It's not possible to update events older than one month.
     *
     *     **Warning** Trying to update an event immediately after creation may temporarily result in an
     *     error (HTTP 409 Conflict. The event is not mutable yet.) as the event is fully propagated across our systems. In such a case, simply retry the request.
     *
     */
    patch: operations['updateEvent']
    trace?: never
  }
  '/events': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Query for events
     * @description Search for identification events, including Smart Signals, using multiple filtering criteria. If you don't provide `start` or `end` parameters, the default search range is the last 7 days.
     *
     *     Smart Signals not activated for your workspace or are not included in the response.
     *
     */
    get: operations['getEvents']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/webhook': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    get?: never
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    /**
     * Dummy path to describe webhook format.
     * @description Fake path to describe webhook format. More information about webhooks can be found in the [documentation](https://dev.fingerprint.com/docs/webhooks)
     */
    trace: operations['postWebhook']
  }
}
export type webhooks = Record<string, never>
export interface components {
  schemas: {
    BrowserDetails: {
      browser_name: string
      browser_major_version: string
      browser_full_version: string
      os: string
      os_version: string
      device: string
    }
    /** @description Contains information about the SDK used to perform the request. */
    SDK: {
      /** @description Platform of the SDK. */
      platform: string
      /** @description SDK version string. */
      version: string
    }
    /**
     * @description Bot detection result:
     *      * `not_detected` - the visitor is not a bot
     *      * `good` - good bot detected, such as Google bot, Baidu Spider, AlexaBot and so on
     *      * `bad` - bad bot detected, such as Selenium, Puppeteer, Playwright, headless browsers, and so on
     *
     * @enum {string}
     */
    BotResult: 'not_detected' | 'good' | 'bad'
    /** @description Android specific cloned application detection. There are 2 values:  * `true` - Presence of app cloners work detected (e.g. fully cloned application found or launch of it inside of a not main working profile detected). * `false` - No signs of cloned application detected or the client is not Android.
     *      */
    ClonedApp: boolean
    /** @description `true` if the browser is Chrome with DevTools open or Firefox with Developer Tools open, `false` otherwise.
     *      */
    DeveloperTools: boolean
    /** @description Android specific emulator detection. There are 2 values:
     *     * `true` - Emulated environment detected (e.g. launch inside of AVD).
     *     * `false` - No signs of emulated environment detected or the client is not Android.
     *      */
    Emulator: boolean
    FactoryReset: {
      /**
       * Format: date-time
       * @description Indicates the time (in UTC) of the most recent factory reset that happened on the **mobile device**.
       *     When a factory reset cannot be detected on the mobile device or when the request is initiated from a browser,  this field will correspond to the *epoch* time (i.e 1 Jan 1970 UTC).
       *     See [Factory Reset Detection](https://dev.fingerprint.com/docs/smart-signals-overview#factory-reset-detection) to learn more about this Smart Signal.
       *
       */
      time: string
      /**
       * Format: int64
       * @description This field is just another representation of the value in the `time` field.
       *     The time of the most recent factory reset that happened on the **mobile device** is expressed as Unix epoch time.
       *
       */
      timestamp: number
    }
    /** @description [Frida](https://frida.re/docs/) detection for Android and iOS devices. There are 2 values:
     *     * `true` - Frida detected
     *     * `false` - No signs of Frida or the client is not a mobile device.
     *      */
    Frida: boolean
    /** @description Proxy detection details (present if `proxy` is `true`) */
    ProxyDetails: {
      /**
       * @description Residential proxies use real user IP addresses to appear as legitimate traffic,
       *     while data center proxies are public proxies hosted in data centers
       *
       * @enum {string}
       */
      proxy_type: 'residential' | 'data_center'
      /**
       * Format: date-time
       * @description ISO 8601 formatted timestamp in UTC with hourly resolution
       *     of when this IP was last seen as a proxy
       *
       */
      last_seen_at?: string
    } | null
    IPBlockList: {
      /** @description IP address was part of a known email spam attack (SMTP). */
      email_spam?: boolean
      /** @description IP address was part of a known network attack (SSH/HTTPS). */
      attack_source?: boolean
      /** @description IP address was used by a public proxy provider or belonged to a known recent residential proxy
       *      */
      proxy?: boolean
      /**
       * @description Confidence level of the proxy detection.
       *     If a proxy is not detected, confidence is "high".
       *     If it's detected, can be "low", "medium", or "high".
       *
       * @enum {string}
       */
      proxy_confidence?: 'low' | 'medium' | 'high'
      /** @description Proxy detection details (present if `proxy` is `true`) */
      proxy_details?: components['schemas']['ProxyDetails']
      /** @description IP address was part of known TOR network activity. */
      tor_node?: boolean
    }
    Geolocation: {
      /** @description The IP address is likely to be within this radius (in km) of the specified location. */
      accuracy_radius?: number
      /** Format: double */
      latitude?: number
      /** Format: double */
      longitude?: number
      postal_code?: string
      /** Format: timezone */
      timezone?: string
      city?: {
        name: string
      }
      country?: {
        code: string
        name: string
      }
      continent?: {
        code: string
        name: string
      }
      subdivisions?: {
        iso_code: string
        name: string
      }[]
    }
    IPInfoASN: {
      asn: string
      name: string
      network: string
    }
    IPInfoDataCenter: {
      result: boolean
      name: string
    }
    IPInfoV4: {
      /** Format: ipv4 */
      address: string
      geolocation: components['schemas']['Geolocation']
      asn?: components['schemas']['IPInfoASN']
      datacenter?: components['schemas']['IPInfoDataCenter']
    }
    IPInfoV6: {
      /** Format: ipv6 */
      address: string
      geolocation: components['schemas']['Geolocation']
      asn?: components['schemas']['IPInfoASN']
      datacenter?: components['schemas']['IPInfoDataCenter']
    }
    /** @description Details about the request IP address. Has separate fields for v4 and v6 IP address versions. */
    IPInfo: {
      v4?: components['schemas']['IPInfoV4']
      v6?: components['schemas']['IPInfoV6']
    }
    IdentificationConfidence: {
      /**
       * Format: double
       * @description The confidence score is a floating-point number between 0 and 1 that represents the probability of accurate identification.
       */
      score: number
      /** @description The revision name of the method used to calculate the Confidence score. This field is only present for customers who opted in to an alternative calculation method. */
      revision?: string
      comment?: string
    }
    Identification: {
      /** @description String of 20 characters that uniquely identifies the visitor's browser. */
      visitor_id: string
      confidence?: components['schemas']['IdentificationConfidence']
      /** @description Attribute represents if a visitor had been identified before. */
      visitor_found: boolean
    }
    /** @description `true` if we detected incognito mode used in the browser, `false` otherwise.
     *      */
    Incognito: boolean
    /** @description iOS specific jailbreak detection. There are 2 values:
     *     * `true` - Jailbreak detected.
     *     * `false` - No signs of jailbreak or the client is not iOS.
     *      */
    Jailbroken: boolean
    /** @description Flag indicating whether the request came from a mobile device with location spoofing enabled. */
    LocationSpoofing: boolean
    /** @description * `true` - When requests made from your users' mobile devices to Fingerprint servers have been intercepted and potentially modified.
     *     * `false` - Otherwise or when the request originated from a browser.
     *     See [MitM Attack Detection](https://dev.fingerprint.com/docs/smart-signals-reference#mitm-attack-detection) to learn more about this Smart Signal.
     *      */
    MitMAttack: boolean
    /** @description `true` if the request is from a privacy aware browser (e.g. Tor) or from a browser in which fingerprinting is blocked. Otherwise `false`.
     *      */
    PrivacySettings: boolean
    /**
     * @deprecated
     * @description This signal is deprecated.
     *     `true` if the request came from a machine being remotely controlled (e.g. TeamViewer), `false` otherwise.
     *
     */
    RemoteControl: boolean
    /** @description Android specific root management apps detection. There are 2 values:
     *     * `true` - Root Management Apps detected (e.g. Magisk).
     *     * `false` - No Root Management Apps detected or the client isn't Android.
     *      */
    RootApps: boolean
    /** @description Suspect Score is an easy way to integrate Smart Signals into your fraud protection work flow.  It is a weighted representation of all Smart Signals present in the payload that helps identify suspicious activity. The value range is [0; S] where S is sum of all Smart Signals weights.  See more details here: https://dev.fingerprint.com/docs/suspect-score
     *      */
    SuspectScore: number
    TamperingDetails: {
      /**
       * Format: double
       * @description Confidence score (`0.0 - 1.0`) for tampering detection:
       *       * Values above `0.5` indicate tampering.
       *       * Values below `0.5` indicate genuine browsers.
       *
       */
      anomaly_score?: number
      /** @description True if the identified browser resembles an "anti-detect" browser, such as Incognition, which attempts to evade identification by manipulating its fingerprint.
       *      */
      anti_detect_browser?: boolean
    }
    /** @description Is absent if the velocity data could not be generated for the visitor Id.
     *      */
    VelocityData: {
      '5m': number
      '1h': number
      /** @description The `24h` interval of `distinct_ip`, `distinct_linked_id`, `distinct_country`, `distinct_ip_by_linked_id` and `distinct_visitor_id_by_linked_id` will be omitted if the number of `events` for the visitor Id in the last 24 hours (`events.['24h']`) is higher than 20.000.
       *      */
      '24h'?: number
    }
    /** @description Sums key data points for a specific `visitor_id`, `ip_address` and `linked_id` at three distinct time
     *     intervals: 5 minutes, 1 hour, and 24 hours as follows:
     *
     *     - Number of distinct IP addresses associated to the visitor Id.
     *     - Number of distinct linked Ids associated with the visitor Id.
     *     - Number of distinct countries associated with the visitor Id.
     *     - Number of identification events associated with the visitor Id.
     *     - Number of identification events associated with the detected IP address.
     *     - Number of distinct IP addresses associated with the provided linked Id.
     *     - Number of distinct visitor Ids associated with the provided linked Id.
     *
     *     The `24h` interval of `distinct_ip`, `distinct_linked_id`, `distinct_country`,
     *     `distinct_ip_by_linked_id` and `distinct_visitor_id_by_linked_id` will be omitted
     *     if the number of `events` for the visitor Id in the last 24
     *     hours (`events.['24h']`) is higher than 20.000.
     *
     *     All will not necessarily be returned in a response, some may be omitted if the
     *     associated event does not have the required data, such as a linked_id.
     *      */
    Velocity: {
      /** @description Is absent if the velocity data could not be generated for the visitor Id.
       *      */
      distinct_ip?: components['schemas']['VelocityData']
      /** @description Is absent if the velocity data could not be generated for the visitor Id.
       *      */
      distinct_linked_id?: components['schemas']['VelocityData']
      /** @description Is absent if the velocity data could not be generated for the visitor Id.
       *      */
      distinct_country?: components['schemas']['VelocityData']
      /** @description Is absent if the velocity data could not be generated for the visitor Id.
       *      */
      events?: components['schemas']['VelocityData']
      /** @description Is absent if the velocity data could not be generated for the visitor Id.
       *      */
      ip_events?: components['schemas']['VelocityData']
      /** @description Is absent if the velocity data could not be generated for the visitor Id.
       *      */
      distinct_ip_by_linked_id?: components['schemas']['VelocityData']
      /** @description Is absent if the velocity data could not be generated for the visitor Id.
       *      */
      distinct_visitor_id_by_linked_id?: components['schemas']['VelocityData']
    }
    /** @description `true` if the request came from a browser running inside a virtual machine (e.g. VMWare), `false` otherwise.
     *      */
    VirtualMachine: boolean
    /**
     * @description A confidence rating for the VPN detection result — "low", "medium", or "high". Depends on the combination of results returned from all VPN detection methods.
     * @enum {string}
     */
    VPNConfidence: 'low' | 'medium' | 'high'
    VPNMethods: {
      /** @description The browser timezone doesn't match the timezone inferred from the request IP address. */
      timezone_mismatch: boolean
      /** @description Request IP address is owned and used by a public VPN service provider. */
      public_vpn: boolean
      /** @description This method applies to mobile devices only. Indicates the result of additional methods used to detect a VPN in mobile devices. */
      auxiliary_mobile: boolean
      /** @description The browser runs on a different operating system than the operating system inferred from the request network signature. */
      os_mismatch: boolean
      /** @description Request IP address belongs to a relay service provider, indicating the use of relay services like [Apple Private relay](https://support.apple.com/en-us/102602) or [Cloudflare Warp](https://developers.cloudflare.com/warp-client/).
       *
       *     * Like VPNs, relay services anonymize the visitor's true IP address.
       *     * Unlike traditional VPNs, relay services don't let visitors spoof their location by choosing an exit node in a different country.
       *
       *     This field allows you to differentiate VPN users and relay service users in your fraud prevention logic.
       *      */
      relay: boolean
    }
    /** @description Contains results from all active products - Fingerprint Pro, Bot Detection, and others. */
    Event: {
      /** @description Unique identifier of the user's request. */
      event_id?: string
      /**
       * Format: int64
       * @description Timestamp of the event with millisecond precision in Unix time.
       */
      timestamp?: number
      /** @description A customer-provided value or an object that was sent with the identification request or updated later. */
      tags?: {
        [key: string]: unknown
      }
      /** @description A customer-provided id that was sent with the request. */
      linked_id?: string
      /** @description Page URL from which the request was sent. */
      url?: string
      /** @description IP address of the requesting browser or bot. */
      ip_address?: string
      user_agent?: string
      browser_details?: components['schemas']['BrowserDetails']
      /** @description Field is `true` if you have previously set the `suspect` flag for this event using the [Server API Update event endpoint](https://dev.fingerprint.com/reference/updateevent). */
      suspect?: boolean
      /** @description Contains information about the SDK used to perform the request. */
      sdk?: components['schemas']['SDK']
      /** @description Bot detection result:
       *      * `not_detected` - the visitor is not a bot
       *      * `good` - good bot detected, such as Google bot, Baidu Spider, AlexaBot and so on
       *      * `bad` - bad bot detected, such as Selenium, Puppeteer, Playwright, headless browsers, and so on
       *      */
      bot?: components['schemas']['BotResult']
      /** @description Additional classification of the bot type if detected.
       *      */
      bot_type?: string
      /** @description Android specific cloned application detection. There are 2 values:  * `true` - Presence of app cloners work detected (e.g. fully cloned application found or launch of it inside of a not main working profile detected). * `false` - No signs of cloned application detected or the client is not Android.
       *      */
      cloned_app?: components['schemas']['ClonedApp']
      /** @description `true` if the browser is Chrome with DevTools open or Firefox with Developer Tools open, `false` otherwise.
       *      */
      developer_tools?: components['schemas']['DeveloperTools']
      /** @description Android specific emulator detection. There are 2 values:
       *     * `true` - Emulated environment detected (e.g. launch inside of AVD).
       *     * `false` - No signs of emulated environment detected or the client is not Android.
       *      */
      emulator?: components['schemas']['Emulator']
      factory_reset?: components['schemas']['FactoryReset']
      /** @description [Frida](https://frida.re/docs/) detection for Android and iOS devices. There are 2 values:
       *     * `true` - Frida detected
       *     * `false` - No signs of Frida or the client is not a mobile device.
       *      */
      frida?: components['schemas']['Frida']
      ip_block_list?: components['schemas']['IPBlockList']
      /** @description Details about the request IP address. Has separate fields for v4 and v6 IP address versions. */
      ip_info?: components['schemas']['IPInfo']
      identification?: components['schemas']['Identification']
      /** @description `true` if we detected incognito mode used in the browser, `false` otherwise.
       *      */
      incognito?: components['schemas']['Incognito']
      /** @description iOS specific jailbreak detection. There are 2 values:
       *     * `true` - Jailbreak detected.
       *     * `false` - No signs of jailbreak or the client is not iOS.
       *      */
      jailbroken?: components['schemas']['Jailbroken']
      /** @description Flag indicating whether the request came from a mobile device with location spoofing enabled. */
      location_spoofing?: components['schemas']['LocationSpoofing']
      /** @description * `true` - When requests made from your users' mobile devices to Fingerprint servers have been intercepted and potentially modified.
       *     * `false` - Otherwise or when the request originated from a browser.
       *     See [MitM Attack Detection](https://dev.fingerprint.com/docs/smart-signals-reference#mitm-attack-detection) to learn more about this Smart Signal.
       *      */
      mitm_attack?: components['schemas']['MitMAttack']
      /** @description `true` if the request is from a privacy aware browser (e.g. Tor) or from a browser in which fingerprinting is blocked. Otherwise `false`.
       *      */
      privacy_settings?: components['schemas']['PrivacySettings']
      /** @description This signal is deprecated.
       *     `true` if the request came from a machine being remotely controlled (e.g. TeamViewer), `false` otherwise.
       *      */
      remote_control?: components['schemas']['RemoteControl']
      /** @description Android specific root management apps detection. There are 2 values:
       *     * `true` - Root Management Apps detected (e.g. Magisk).
       *     * `false` - No Root Management Apps detected or the client isn't Android.
       *      */
      root_apps?: components['schemas']['RootApps']
      /** @description Suspect Score is an easy way to integrate Smart Signals into your fraud protection work flow.  It is a weighted representation of all Smart Signals present in the payload that helps identify suspicious activity. The value range is [0; S] where S is sum of all Smart Signals weights.  See more details here: https://dev.fingerprint.com/docs/suspect-score
       *      */
      suspect_score?: components['schemas']['SuspectScore']
      /** @description Flag indicating browser tampering was detected. This happens when either:
       *       * There are inconsistencies in the browser configuration that cross internal tampering thresholds (see `tampering_details.anomaly_score`).
       *       * The browser signature resembles an "anti-detect" browser specifically designed to evade fingerprinting (see `tampering_details.anti_detect_browser`).
       *      */
      tampering?: boolean
      tampering_details?: components['schemas']['TamperingDetails']
      /** @description Sums key data points for a specific `visitor_id`, `ip_address` and `linked_id` at three distinct time
       *     intervals: 5 minutes, 1 hour, and 24 hours as follows:
       *
       *     - Number of distinct IP addresses associated to the visitor Id.
       *     - Number of distinct linked Ids associated with the visitor Id.
       *     - Number of distinct countries associated with the visitor Id.
       *     - Number of identification events associated with the visitor Id.
       *     - Number of identification events associated with the detected IP address.
       *     - Number of distinct IP addresses associated with the provided linked Id.
       *     - Number of distinct visitor Ids associated with the provided linked Id.
       *
       *     The `24h` interval of `distinct_ip`, `distinct_linked_id`, `distinct_country`,
       *     `distinct_ip_by_linked_id` and `distinct_visitor_id_by_linked_id` will be omitted
       *     if the number of `events` for the visitor Id in the last 24
       *     hours (`events.['24h']`) is higher than 20.000.
       *
       *     All will not necessarily be returned in a response, some may be omitted if the
       *     associated event does not have the required data, such as a linked_id.
       *      */
      velocity?: components['schemas']['Velocity']
      /** @description `true` if the request came from a browser running inside a virtual machine (e.g. VMWare), `false` otherwise.
       *      */
      virtual_machine?: components['schemas']['VirtualMachine']
      /** @description VPN or other anonymizing service has been used when sending the request.
       *      */
      vpn?: boolean
      /** @description A confidence rating for the VPN detection result — "low", "medium", or "high". Depends on the combination of results returned from all VPN detection methods. */
      vpn_confidence?: components['schemas']['VPNConfidence']
      /** @description Local timezone which is used in timezone_mismatch method.
       *      */
      vpn_origin_timezone?: string
      /** @description Country of the request (only for Android SDK version >= 2.4.0, ISO 3166 format or unknown).
       *      */
      vpn_origin_country?: string
      vpn_methods?: components['schemas']['VPNMethods']
      /** @description `true` if we determined that this payload was replayed, `false` otherwise.
       *      */
      replayed?: boolean
      /** @description The rule(s) associated with triggering the webhook via rule engine. */
      triggered_by?: {
        id: string
        name: string
        description: string
      }[]
      /** @description Environment ID of the event. */
      environment_id?: string
      /**
       * Format: date-time
       * @description Time expressed according to ISO 8601 in UTC format, when the request from the JS agent was made. We recommend to treat requests that are older than 2 minutes as malicious. Otherwise, request replay attacks are possible.
       */
      time?: string
    }
    /**
     * @description Error code:
     *     * `request_cannot_be_parsed` - the query parameters or JSON payload contains some errors
     *       that prevented us from parsing it (wrong type/surpassed limits).
     *     * `token_required` - `Auth-Api-Key` header is missing or empty.
     *     * `token_not_found` - no Fingerprint application found for specified secret key.
     *     * `subscription_not_active` - Fingerprint application is not active.
     *     * `wrong_region` - server and application region differ.
     *     * `feature_not_enabled` - this feature (for example, Delete API) is not enabled for your application.
     *     * `request_not_found` - the specified event Id was not found. It never existed, expired, or it has been deleted.
     *     * `visitor_not_found` - The specified visitor Id was not found. It never existed or it may have already been deleted.
     *     * `too_many_requests` - the limit on secret API key requests per second has been exceeded.
     *     * `state_not_ready` - The event specified with event Id is
     *       not ready for updates yet. Try again.
     *       This error happens in rare cases when update API is called immediately
     *       after receiving the event Id on the client. In case you need to send
     *       information right away, we recommend using the JS agent API instead.
     *     * `failed` - internal server error.
     *     * `event_not_found` - The specified event ID was not found. It never existed, expired, or it has been deleted.
     *
     * @enum {string}
     */
    ErrorCode:
      | 'request_cannot_be_parsed'
      | 'token_required'
      | 'token_not_found'
      | 'subscription_not_active'
      | 'wrong_region'
      | 'feature_not_enabled'
      | 'request_not_found'
      | 'visitor_not_found'
      | 'too_many_requests'
      | 'state_not_ready'
      | 'failed'
      | 'event_not_found'
    Error: {
      /** @description Error code:
       *     * `request_cannot_be_parsed` - the query parameters or JSON payload contains some errors
       *       that prevented us from parsing it (wrong type/surpassed limits).
       *     * `token_required` - `Auth-Api-Key` header is missing or empty.
       *     * `token_not_found` - no Fingerprint application found for specified secret key.
       *     * `subscription_not_active` - Fingerprint application is not active.
       *     * `wrong_region` - server and application region differ.
       *     * `feature_not_enabled` - this feature (for example, Delete API) is not enabled for your application.
       *     * `request_not_found` - the specified event Id was not found. It never existed, expired, or it has been deleted.
       *     * `visitor_not_found` - The specified visitor Id was not found. It never existed or it may have already been deleted.
       *     * `too_many_requests` - the limit on secret API key requests per second has been exceeded.
       *     * `state_not_ready` - The event specified with event Id is
       *       not ready for updates yet. Try again.
       *       This error happens in rare cases when update API is called immediately
       *       after receiving the event Id on the client. In case you need to send
       *       information right away, we recommend using the JS agent API instead.
       *     * `failed` - internal server error.
       *     * `event_not_found` - The specified event ID was not found. It never existed, expired, or it has been deleted.
       *      */
      code: components['schemas']['ErrorCode']
      message: string
    }
    ErrorResponse: {
      error: components['schemas']['Error']
    }
    EventUpdate: {
      /** @description Linked Id value to assign to the existing event */
      linked_id?: string
      /** @description A customer-provided value or an object that was sent with the identification request or updated later. */
      tags?: {
        [key: string]: unknown
      }
      /** @description Suspect flag indicating observed suspicious or fraudulent event */
      suspect?: boolean
    }
    /** @description Contains a list of all identification events matching the specified search criteria. */
    EventSearch: {
      events: components['schemas']['Event'][]
      /** @description Use this value in the `pagination_key` parameter to request the next page of search results. */
      pagination_key?: string
    }
  }
  responses: never
  parameters: never
  requestBodies: never
  headers: never
  pathItems: never
}
export type $defs = Record<string, never>
export interface operations {
  getEvent: {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description The unique [identifier](https://dev.fingerprint.com/reference/get-function#event_id) of each identification request. */
        event_id: string
      }
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description OK. */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/json': components['schemas']['Event']
        }
      }
      /** @description Bad request. The event Id provided is not valid. */
      400: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/json': components['schemas']['ErrorResponse']
        }
      }
      /** @description Forbidden. Access to this API is denied. */
      403: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/json': components['schemas']['ErrorResponse']
        }
      }
      /** @description Not found. The event Id cannot be found in this application's data. */
      404: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/json': components['schemas']['ErrorResponse']
        }
      }
      /** @description Application error. */
      500: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/json': components['schemas']['ErrorResponse']
        }
      }
    }
  }
  updateEvent: {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description The unique event [identifier](https://dev.fingerprint.com/reference/get-function#event_id). */
        event_id: string
      }
      cookie?: never
    }
    requestBody: {
      content: {
        'application/json': components['schemas']['EventUpdate']
      }
    }
    responses: {
      /** @description OK. */
      200: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
      /** @description Bad request. The request payload is not valid. */
      400: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/json': components['schemas']['ErrorResponse']
        }
      }
      /** @description Forbidden. Access to this API is denied. */
      403: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/json': components['schemas']['ErrorResponse']
        }
      }
      /** @description Not found. The event Id cannot be found in this application's data. */
      404: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/json': components['schemas']['ErrorResponse']
        }
      }
      /** @description Conflict. The event is not mutable yet. */
      409: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/json': components['schemas']['ErrorResponse']
        }
      }
    }
  }
  getEvents: {
    parameters: {
      query?: {
        /** @description Limit the number of events returned.
         *      */
        limit?: number
        /** @description Use `pagination_key` to get the next page of results.
         *
         *     When more results are available (e.g., you requested up to 100 results for your query using `limit`, but there are more than 100 events total matching your request), the `pagination_key` field is added to the response. The key corresponds to the `timestamp` of the last returned event. In the following request, use that value in the `pagination_key` parameter to get the next page of results:
         *
         *     1. First request, returning most recent 200 events: `GET api-base-url/events?limit=100`
         *     2. Use `response.pagination_key` to get the next page of results: `GET api-base-url/events?limit=100&pagination_key=1740815825085`
         *      */
        pagination_key?: string
        /** @description Unique [visitor identifier](https://dev.fingerprint.com/reference/get-function#visitorid) issued by Fingerprint Pro.
         *     Filter for events matching this `visitor_id`.
         *      */
        visitor_id?: string
        /** @description Filter events by the Bot Detection result, specifically:
         *       `all` - events where any kind of bot was detected.
         *       `good` - events where a good bot was detected.
         *       `bad` - events where a bad bot was detected.
         *       `none` - events where no bot was detected.
         *     > Note: When using this parameter, only events with the `botd.bot` property set to a valid value are returned. Events without a `botd` Smart Signal result are left out of the response.
         *      */
        bot?: 'all' | 'good' | 'bad' | 'none'
        /** @description Filter events by IP address or IP range (if CIDR notation is used). If CIDR notation is not used, a /32 for IPv4 or /128 for IPv6 is assumed.
         *     Examples of range based queries: 10.0.0.0/24, 192.168.0.1/32
         *      */
        ip_address?: string
        /** @description Filter events by your custom identifier.
         *
         *     You can use [linked Ids](https://dev.fingerprint.com/reference/get-function#linkedid) to associate identification requests with your own identifier, for example, session Id, purchase Id, or transaction Id. You can then use this `linked_id` parameter to retrieve all events associated with your custom identifier.
         *      */
        linked_id?: string
        /** @description Filter events with a timestamp greater than the start time, in Unix time (milliseconds).
         *      */
        start?: number
        /** @description Filter events with a timestamp smaller than the end time, in Unix time (milliseconds).
         *      */
        end?: number
        /** @description Sort events in reverse timestamp order.
         *      */
        reverse?: boolean
        /** @description Filter events previously tagged as suspicious via the [Update API](https://dev.fingerprint.com/reference/updateevent).
         *     > Note: When using this parameter, only events with the `suspect` property explicitly set to `true` or `false` are returned. Events with undefined `suspect` property are left out of the response.
         *      */
        suspect?: boolean
        /** @description Filter events by VPN Detection result.
         *     > Note: When using this parameter, only events with the `vpn` property set to `true` or `false` are returned. Events without a `vpn` Smart Signal result are left out of the response.
         *      */
        vpn?: boolean
        /** @description Filter events by Virtual Machine Detection result.
         *     > Note: When using this parameter, only events with the `virtual_machine` property set to `true` or `false` are returned. Events without a `virtual_machine` Smart Signal result are left out of the response.
         *      */
        virtual_machine?: boolean
        /** @description Filter events by Browser Tampering Detection result.
         *     > Note: When using this parameter, only events with the `tampering.result` property set to `true` or `false` are returned. Events without a `tampering` Smart Signal result are left out of the response.
         *      */
        tampering?: boolean
        /** @description Filter events by Anti-detect Browser Detection result.
         *     > Note: When using this parameter, only events with the `tampering.anti_detect_browser` property set to `true` or `false` are returned. Events without a `tampering` Smart Signal result are left out of the response.
         *      */
        anti_detect_browser?: boolean
        /** @description Filter events by Browser Incognito Detection result.
         *     > Note: When using this parameter, only events with the `incognito` property set to `true` or `false` are returned. Events without an `incognito` Smart Signal result are left out of the response.
         *      */
        incognito?: boolean
        /** @description Filter events by Privacy Settings Detection result.
         *     > Note: When using this parameter, only events with the `privacy_settings` property set to `true` or `false` are returned. Events without a `privacy_settings` Smart Signal result are left out of the response.
         *      */
        privacy_settings?: boolean
        /** @description Filter events by Jailbroken Device Detection result.
         *     > Note: When using this parameter, only events with the `jailbroken` property set to `true` or `false` are returned. Events without a `jailbroken` Smart Signal result are left out of the response.
         *      */
        jailbroken?: boolean
        /** @description Filter events by Frida Detection result.
         *     > Note: When using this parameter, only events with the `frida` property set to `true` or `false` are returned. Events without a `frida` Smart Signal result are left out of the response.
         *      */
        frida?: boolean
        /** @description Filter events by Factory Reset Detection result.
         *     > Note: When using this parameter, only events with a `factory_reset` time. Events without a `factory_reset` Smart Signal result are left out of the response.
         *      */
        factory_reset?: boolean
        /** @description Filter events by Cloned App Detection result.
         *     > Note: When using this parameter, only events with the `cloned_app` property set to `true` or `false` are returned. Events without a `cloned_app` Smart Signal result are left out of the response.
         *      */
        cloned_app?: boolean
        /** @description Filter events by Android Emulator Detection result.
         *     > Note: When using this parameter, only events with the `emulator` property set to `true` or `false` are returned. Events without an `emulator` Smart Signal result are left out of the response.
         *      */
        emulator?: boolean
        /** @description Filter events by Rooted Device Detection result.
         *     > Note: When using this parameter, only events with the `root_apps` property set to `true` or `false` are returned. Events without a `root_apps` Smart Signal result are left out of the response.
         *      */
        root_apps?: boolean
        /** @description Filter events by VPN Detection result confidence level.
         *     `high` - events with high VPN Detection confidence.
         *     `medium` - events with medium VPN Detection confidence.
         *     `low` - events with low VPN Detection confidence.
         *     > Note: When using this parameter, only events with the `vpn.confidence` property set to a valid value are returned. Events without a `vpn` Smart Signal result are left out of the response.
         *      */
        vpn_confidence?: 'high,' | 'medium' | 'low'
        /** @description Filter events with Suspect Score result above a provided minimum threshold.
         *     > Note: When using this parameter, only events where the `suspect_score` property set to a value exceeding your threshold are returned. Events without a `suspect_score` Smart Signal result are left out of the response.
         *      */
        min_suspect_score?: number
      }
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description Events matching the filter(s). */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/json': components['schemas']['EventSearch']
        }
      }
      /** @description Bad request. One or more supplied search parameters are invalid, or a required parameter is missing. */
      400: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/json': components['schemas']['ErrorResponse']
        }
      }
      /** @description Forbidden. Access to this API is denied. */
      403: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/json': components['schemas']['ErrorResponse']
        }
      }
      /** @description Application error. */
      500: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/json': components['schemas']['ErrorResponse']
        }
      }
    }
  }
  postWebhook: {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: {
      content: {
        'application/json': components['schemas']['Event']
      }
    }
    responses: {
      /** @description Bad request. Dummy 400 response. */
      400: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/json': components['schemas']['Event']
        }
      }
      /** @description Dummy for the schema */
      default: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
}

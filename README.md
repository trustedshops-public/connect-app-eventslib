## Connect App Events Library

[![GitHub License](https://img.shields.io/badge/license-MIT-lightgrey.svg)](https://github.com/trustedshops-public/connect-app-eventslib/blob/main/LICENSE)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=trustedshops-public_connect-app-eventslib&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=trustedshops-public_connect-app-eventslib)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=trustedshops-public_connect-app-eventslib&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=trustedshops-public_connect-app-eventslib)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=trustedshops-public_connect-app-eventslib&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=trustedshops-public_connect-app-eventslib)
[![CircleCI](https://dl.circleci.com/status-badge/img/gh/trustedshops-public/connect-app-eventslib/tree/main.svg?style=shield)](https://dl.circleci.com/status-badge/redirect/gh/trustedshops-public/connect-app-eventslib/tree/main)

## Public Documentation

This Events Library is part of Trusted Shop´s SDK for building plugins based on our new plattform and architecture. You
can find our detailed documentation publicly
available [here](https://developers.etrusted.com/solutions/newgen-sdk/introduction.html). Please follow these
instructions to build your own plugin to connect eTrusted products with a shopsoftwaresystem.

## Quick start

### `Connecting the event library with connector layer`

### Prod Env

```html

<body>
<div id="app">
    ...
    <div id="eTrusted-connector"></div>
</div>
<script src="https://static-app.connect.trustedshops.com/events/eventsLib.js"></script> <!-- 1 -->

<script src="baseLayer.js"></script> <!-- 2 -->

<script async src="https://static-app.connect.trustedshops.com/connector/connector.umd.js"></script> <!-- 3 -->
</body>
```

### Test env

```html

<body>
<div id="app">
    ...
    <div id="eTrusted-connector"></div>
</div>
<script src="https://static-app.connect-qa.trustedshops.com/events/eventsLib.js"></script><!-- 1 -->

<script src="baseLayer.js"></script><!-- 2 -->

<script async src="https://static-app.connect-qa.trustedshops.com/connector/connector.umd.js"></script><!-- 3 -->
</body>
```

## Terms

### `registerEvents`

registerEvents is a function for registering subscription events called by the Сonnector Layer and Base Layer.
Accepts a simple set of callbacks, one for each type of event.
The key is the name of the EVENT, the value is the callback function to handle the event.
Returns a function to remove registered event listeners

```js
const registerEvents = window.eventsLib.registerEvents

const unregisterEvents = registerEvents({
    [EVENTS.GET_LOCALE]: (event) => {
        console.log(event);
    },
});

```

### `dispatchAction`

dispatchAction is a function to call a registered event.
Accepts an object with keys - an `action` as a string and a `payload` as values typical of each event.

```js
const dispatchAction = window.eventsLib.dispatchAction

const handleClick = () => {
    dispatchAction({action: EVENTS.GET_LOCALE, payload: null})
};

```

## New events in version 2.0

Add parameter `useVersionNumberOfConnector: '2.0'` to event `EVENTS.SET_INFORMATION_OF_SYSTEM` to use version 2.0

#### Available order statuses: `[EVENTS.GET_AVAILABLE_ORDER_STATUSES],  [EVENTS.SET_AVAILABLE_ORDER_STATUSES]`

Provide available order statuses for the given channel using the `EVENTS.SET_AVAILABLE_ORDER_STATUSES` event
with
values: `{action: EVENTS.SET_AVAILABLE_ORDER_STATUSES, payload: { ID: string; name: string; event_type?: string }[]} `
in response to ` EVENTS.GET_AVAILABLE_ORDER_STATUSES`.

<details>
<summary>baseLayer.ts</summary>

```typescript

const availableOrders = [
  { name: 'Awaiting Payment', ID: '1', event_type: 'order_status_from_nameOfSystem' },
  { name: 'Payment accepted', ID: '2' },
  { name: 'Processing in progress', ID: '3', event_type: 'order_status_from_nameOfSystem' },
  { name: 'Shipped', ID: '4' },
  { name: 'Delivered', ID: '5' },
  { name: 'Canceled', ID: '6' },
  { name: 'Refunded', ID: '7' },
];

const unregisterEvents = registerEvents({
  // ...
  [EVENTS.GET_AVAILABLE_ORDER_STATUSES]: (event: {
    action: "TS_GET_AVAILABLE_ORDER_STATUSES";
    payload:  {id: string, eTrustedChannelRef: string, salesChannelRef: string }
  }) => {
    dispatchAction({
      action: EVENTS.SET_AVAILABLE_ORDER_STATUSES,
      payload: availableOrders,
    });
  },
  // ...
});
```
</details>

#### Used order statuses: `[EVENTS.GET_USED_ORDER_STATUSES],  [EVENTS.SET_USED_ORDER_STATUSES]`

Provide used order status for the given channel using the `EVENTS.SET_USED_ORDER_STATUSES` event
with
values: `{ action: EVENTS.SET_USED_ORDER_STATUSES, payload: {
        activeStatus: {
          product: { ID: string; name: string; event_type?: string },
          service: { ID: string; name: string; event_type?: string },
        },
        id: string,
        eTrustedChannelRef: string,
        salesChannelRef: string
      }} `
in response to ` EVENTS.GET_USED_ORDER_STATUSES`.

<details>
<summary>baseLayer.ts</summary>

```typescript

const unregisterEvents = registerEvents({
  // ...
  [EVENTS.GET_USED_ORDER_STATUSES]: (event: {
    action: "TS_GET_USED_ORDER_STATUSES";
    payload: {id: string, eTrustedChannelRef: string, salesChannelRef: string };
  }) => {
    dispatchAction({
      action: EVENTS.SET_USED_ORDER_STATUSES,
      payload: {
        activeStatus: {
          product: { 
            name: 'Awaiting Payment', 
            ID: '1', 
            event_type: 'order_status_from_nameOfSystem' 
          },
          service: { 
            name: 'Processing in progress', 
            ID: '3',
            event_type: 'order_status_from_nameOfSystem'
          },
        },
        id: 'ID',
        eTrustedChannelRef: 'eTrustedChannelRef',
        salesChannelRef: 'salesChannelRef'
      },
    });
  },
  // ...
});
```
</details>

#### Save order statuses: `[EVENTS.SAVE_USED_ORDER_STATUSES]`

Save used order status for the given channel using the `EVENTS.SAVE_USED_ORDER_STATUSES` event
with
values: `{
        activeStatus: {
          product: { ID: string; name: string; event_type?: string },
          service: { ID: string; name: string; event_type?: string },
        },
        id: string,
        eTrustedChannelRef: string,
        salesChannelRef: string
      }}`
in response to ` EVENTS.SAVE_USED_ORDER_STATUSES`.

<details>
<summary>baseLayer.ts</summary>

```typescript

const unregisterEvents = registerEvents({
  // ...
  [EVENTS.SAVE_USED_ORDER_STATUSES]: (event: {
    action: "TS_SAVE_USED_ORDER_STATUSES";
    payload: {
      id: string, eTrustedChannelRef: string, salesChannelRef: string , activeStatus: {
      product: { ID: string; name: string; event_type?: string },
      service: { ID: string; name: string; event_type?: string },
    }};
  }) => {
    dispatchAction({
      action: EVENTS.SET_USED_ORDER_STATUSES,
      payload: {
        activeStatus: {
          product: {
            name: 'Awaiting Payment',
            ID: '1',
            event_type: 'order_status_from_nameOfSystem'
          },
          service: { 
            name: 'Processing in progress',
            ID: '3',
            event_type: 'order_status_from_nameOfSystem'
          },
        },
        id: 'ID',
        eTrustedChannelRef: 'eTrustedChannelRef',
        salesChannelRef: 'salesChannelRef'
      },
    });
  },
  // ...
});
```
</details>

## Version 1

### `EVENTS`

EVENTS is a simple set of event string values ​​for communicating the Сonnector Layer with the Base Layer.

## How to use

#### Locale: `[EVENTS.GET_LOCALE], [EVENTS.SET_LOCALE]`

The locale must be provided by the Base Layer at the Сonnector Layer using the `EVENTS.SET_LOCALE` event call with the
values:
​​`{action: EVENTS.SET_LOCALE, payload: 'en-GB'}` in response to `EVENTS.GET_LOCALE`.

available language formats: 'en-GB', 'en', 'de-DE', 'de', 'es-ES', 'es', 'fr-FR', 'fr', 'it-IT', 'it', 'nl-NL', 'nl', '
pt-PT', 'pt', 'pl-PL','pl'

<details>
<summary>baseLayer.ts</summary>

```typescript
const EVENTS = window.eventsLib.EVENTS
const dispatchAction = window.eventsLib.dispatchAction
const registerEvents = window.eventsLib.registerEvents

export const baseLayer = (): void => {
    const unregisterEvents = registerEvents({
        [EVENTS.GET_LOCALE]: (event: {
            action: 'GET_LOCALE',
            payload: null
        }) => {
            dispatchAction({
                action: EVENTS.SET_LOCALE,
                payload: 'en-GB',
            })
        },
        // ...
    })
}
```

</details>

#### Credentials: `[EVENTS.GET_CREDENTIALS_PROVIDED], [EVENTS.SET_CREDENTIALS_PROVIDED], [EVENTS.SAVE_CREDENTIALS]`

Provide credentials if already saved in Base Layer using the `EVENTS.SET_CREDENTIALS_PROVIDED` event call with the
values: `{action: EVENTS.SET_CREDENTIALS_PROVIDED, payload: { clientId: string, clientSecret: string }}` in response
to `EVENTS.GET_CREDENTIALS_PROVIDED`.

<details>
<summary>baseLayer.ts</summary>

```typescript 
const unregisterEvents = registerEvents({
    // ...
    [EVENTS.GET_CREDENTIALS_PROVIDED]: (event: {
        action: 'TS_GET_CREDENTIALS_PROVIDED',
        payload: null
    }) => {
        dispatchAction({
            action: EVENTS.SET_CREDENTIALS_PROVIDED,
            payload: {
                clientId: 'clientId' || '',
                clientSecret: 'clientSecret' || ''
            },
        })
    },
    ...
})
```

</details>

If the credentials haven't been stored in the Base Layer, then the Connector layer triggers
the `EVENTS.SAVE_CREDENTIALS` event to save the verified data.

<details>
<summary>baseLayer.ts</summary>

```typescript
const unregisterEvents = registerEvents({
    // ...
    [EVENTS.SAVE_CREDENTIALS]: (event: {
        action: 'TS_SAVE_CREDENTIALS'
        as
        string,
        payload: {
            clientId: string,
            clientSecret: string
        }
    }) => {
        // Saving credentials in db
    },
    // ...
})
```

</details>

#### Mapped channels: `[EVENTS.GET_MAPPED_CHANNELS], [EVENTS.SET_MAPPED_CHANNELS]`

Provide mapped channels if they are already stored in the Base Layer using the `EVENTS.SET_MAPPED_CHANNELS` event with
the values: `{action: EVENTS.SET_MAPPED_CHANNELS, payload: IMappedChannel[] | []}` in response
to `EVENTS.GET_MAPPED_CHANNELS`.

<details>
<summary>baseLayer.ts</summary>

```typescript 
interface IMappedChannel {
    eTrustedChannelRef: string
    eTrustedLocale: string
    eTrustedName: string
    eTrustedUrl: string
    salesChannelRef: string
    salesChannelLocale: string
    salesChannelName: string
    salesChannelUrl: string
}

const unregisterEvents = registerEvents({
    // ...
    [EVENTS.GET_MAPPED_CHANNELS]: (event: {
        action: 'TS_GET_MAPPED_CHANNELS',
        payload: null
    }) => {
        dispatchAction({
            action: EVENTS.SET_MAPPED_CHANNELS,
            payload: [] as IMappedChannel[],
        })
    },
    // ...
})
```

</details>

#### Sales channels: `[EVENTS.GET_SALES_CHANNELS_PROVIDED], [EVENTS.SET_SALES_CHANNELS_PROVIDED]`

Provide information on all saved 'sales channels' using the `EVENTS.SET_SALES_CHANNELS_PROVIDED` event call with the
values: `{action: EVENTS.SET_SALES_CHANNELS_PROVIDED, payload: ISalesChannel[] | []}` in response
to `EVENTS.GET_SALES_CHANNELS_PROVIDED`.

<details>
<summary>baseLayer.ts</summary>

```typescript
interface ISalesChannel {
    id: string
    name: string
    url: string
    locale: string
}

const unregisterEvents = registerEvents({
    // ...
    [EVENTS.GET_SALES_CHANNELS_PROVIDED]: (event: {
        action: 'TS_GET_SALES_CHANNELS_PROVIDED'
        as
        string,
        payload: null
    }) => {
        dispatchAction({
            action: EVENTS.SET_SALES_CHANNELS_PROVIDED,
            payload: [] as ISalesChannel[],
        })
    },
    // ...
})
```

</details>

#### Save channels [EVENTS.SAVE_MAPPED_CHANNEL ]

Save the matched sales channels from the `EVENTS.SET_SALES_CHANNELS_PROVIDED` event. After successful save, raise
the `EVENTS.SET_SALES_CHANNELS_PROVIDED` and `EVENTS.NOTIFICATION` events.

<details>
<summary>baseLayer.ts</summary>

```typescript 
interface IMappedChannel {
    eTrustedChannelRef: string
    eTrustedLocale: string
    eTrustedName: string
    eTrustedUrl: string
    eTrustedAccountRef: string
    salesChannelRef: string
    salesChannelLocale: string
    salesChannelName: string
    salesChannelUrl: string
}

const unregisterEvents = registerEvents({
    // ...
    [EVENTS.SAVE_MAPPED_CHANNEL]: (event: {
        action: 'TS_SAVE_MAPPED_CHANNEL ',
        payload: IMappedChannel[]
    }) => {
        // Saving payload in db
        dispatchAction({
            action: EVENTS.SET_MAPPED_CHANNELS,
            payload: event.payload as IMappedChannel[],
        })
    },
// ...
})
```

</details>

#### Trustbadge: `[EVENTS.GET_TRUSTBADGE_CONFIGURATION_PROVIDED], [EVENTS.SET_TRUSTBADGE_CONFIGURATION_PROVIDED]`

Provide the previously saved Trustbadge embed code using the `EVENTS.SET_TRUSTBADGE_CONFIGURATION_PROVIDED` event call
with the values:` {action: EVENTS.SET_TRUSTBADGE_CONFIGURATION_PROVIDED, payload: ITrustbadge}` in response
to` EVENTS.GET_TRUSTBADGE_CONFIGURATION_PROVIDED`.

:information_source: When loading, the connector sends a GET_TRUSTBADGE_CONFIGURATION_PROVIDED event and if the base
layer does not have a saved Trustbadge configuration, then in the SET_TRUSTBADGE_CONFIGURATION_PROVIDED event it sends a
payload: { id: 'id' , children: [] }. In this case, the connector generates an initial Trustbadge, which can be
configured and saved in the SAVE_TRUSTBADGE_CONFIGURATION event.

<details>
<summary>baseLayer.ts</summary>

```typescript
const unregisterEvents = registerEvents({
    // ...
    [EVENTS.GET_TRUSTBADGE_CONFIGURATION_PROVIDED]:
        (event: {
            action: 'TS_GET_TRUSTBADGE_CONFIGURATION_PROVIDED'
            payload: {
                id: eTrustedChannelRef,
                salesChannelRef: string
            }
        }) => {
            dispatchAction({
                action: EVENTS.SET_TRUSTBADGE_CONFIGURATION_PROVIDED,
                payload: trustbadgeData as ITrustbadge,
            })
        }
    // ...
})
```

</details>

<details>
<summary>example trustbadgeData</summary>

```typescript 
const trustbadgeData = {
    id: '<TS-ID>',
    salesChannelRef,
    children: [
        {
            tag: 'script',
            attributes: {
                async: {
                    attributeName: 'async',
                },
                'data-desktop-y-offset': {
                    value: 8,
                    attributeName: 'data-desktop-y-offset',
                },
                'data-mobile-y-offset': {
                    value: 10,
                    attributeName: 'data-mobile-y-offset',
                },
                'data-desktop-disable-reviews': {
                    value: false,
                    attributeName: 'data-desktop-disable-reviews',
                },
                'data-desktop-enable-custom': {
                    value: false,
                    attributeName: 'data-desktop-enable-custom',
                },
                'data-desktop-position': {
                    value: 'right',
                    attributeName: 'data-desktop-position',
                },
                'data-desktop-custom-width': {
                    value: 156,
                    attributeName: 'data-desktop-custom-width',
                },
                'data-desktop-enable-fadeout': {
                    value: false,
                    attributeName: 'data-desktop-enable-fadeout',
                },
                'data-disable-mobile': {
                    value: false,
                    attributeName: 'data-disable-mobile',
                },
                'data-disable-trustbadge': {
                    value: false,
                    attributeName: 'data-disable-trustbadge',
                },
                'data-mobile-custom-width': {
                    value: 156,
                    attributeName: 'data-mobile-custom-width',
                },
                'data-mobile-disable-reviews': {
                    value: false,
                    attributeName: 'data-mobile-disable-reviews',
                },
                'data-mobile-enable-custom': {
                    value: false,
                    attributeName: 'data-mobile-enable-custom',
                },
                'data-mobile-position': {
                    value: 'right',
                    attributeName: 'data-mobile-position',
                },
                charset: {
                    value: 'UTF-8',
                    attributeName: 'charset',
                },
                src: {
                    value: `//widgets.trustedshops.com/js/<TS-ID>.js`,
                    attributeName: 'src',
                },
            },
        },
    ],
}
```

</details>


<details>
<summary>interface ITrustedBadge</summary>

```typescript 
interface ITrustbadge {
    id: string,
    salesChannelRef: string,
    children: ITrustbadgeChildren[]
}

interface ITrustbadgeChildren {
    tag?: string
    attributes: {
        [key: string]: {
            value?: string | number | boolean;
            attributeName?: string
        }
    }
    children?: ITrustbadgeChildren[]
}
```

</details>

#### Save Trustbadge: `[EVENTS.SAVE_TRUSTBADGE_CONFIGURATION]`

Save the configured Trustbadge embed code for this channel from the `EVENTS.SAVE_TRUSTBADGE_CONFIGURATION` event. After
successful save, call the `EVENTS.SET_TRUSTBADGE_CONFIGURATION_PROVIDED` and `EVENTS.NOTIFICATION` events.

<details>
<summary>baseLayer.ts</summary>

```typescript 
const unregisterEvents = registerEvents({
    // ...
    [EVENTS.SAVE_TRUSTBADGE_CONFIGURATION]:
        (event: {
            action: 'TS_SAVE_TRUSTBADGE_CONFIGURATION'
            payload: ITrustbadge
        }) => {
            // Saving payload in db
            dispatchAction({
                action: EVENTS.SET_TRUSTBADGE_CONFIGURATION_PROVIDED,
                payload: trustbadgeData as ITrustbadge,
            })
        },
    // ...
})
```

</details>

#### Widget location: `[EVENTS.GET_LOCATION_FOR_WIDGET], [EVENTS.SET_LOCATION_FOR_WIDGET]`

Provide available positions for the widget template using the `EVENTS.SET_LOCATION_FOR_WIDGET` event call with the
values:` {action: EVENTS.SET_LOCATION_FOR_WIDGET, payload: { id: string, name: string }[]} ` in response
to` EVENTS.GET_LOCATION_FOR_WIDGET`.

<details>
<summary>baseLayer.ts</summary>

```typescript 
const widgetLocation = [
    {
        id: '21d3d933eb93',
        name: 'Home Page'
    },
    {
        id: '21d3d933eb93',
        name: 'Footer',
    },
]

const unregisterEvents = registerEvents({
    // ...
    [EVENTS.GET_LOCATION_FOR_WIDGET]:
        (event: {
            action: 'TS_GET_LOCATION_FOR_WIDGET',
            payload: {
                id: eTrustedChannelRef,
                salesChannelRef: string
            }
        }) => {
            dispatchAction({
                action: EVENTS.SET_LOCATION_FOR_WIDGET,
                payload: widgetLocation,
            })
        }
    ,
    // ...
})
```

</details>

#### Product Identifiers: `[EVENTS.GET_AVAILABLE_PRODUCT_IDENTIFIERS], [EVENTS.SET_AVAILABLE_PRODUCT_IDENTIFIERS]`

Provide available product identifiers for your system using the `EVENTS.SET_AVAILABLE_PRODUCT_IDENTIFIERS` event call
with the values:` {action: EVENTS.SET_AVAILABLE_PRODUCT_IDENTIFIERS, payload: { id: string, name: string }[]} ` in
response to` EVENTS.GET_AVAILABLE_PRODUCT_IDENTIFIERS`.

<details>
<summary>baseLayer.ts</summary>

```typescript 
// available product identifiers
const productIdentifiers = [
    {
        id: 'data-sku',
        name: 'SKU'
    },
    {
        id: 'data-gtin',
        name: 'GTIN'
    },
    {
        id: 'data-mpn',
        name: 'MPN'
    },
]


const unregisterEvents = registerEvents({
    // ...
    [EVENTS.GET_AVAILABLE_PRODUCT_IDENTIFIERS]:
        (event: {
            action: 'TS_GET_AVAILABLE_PRODUCT_IDENTIFIERS'
            payload: {
                id: string,
                salesChannelRef: string
            }
        }) => {
            dispatchAction({
                action: EVENTS.SET_AVAILABLE_PRODUCT_IDENTIFIERS,
                payload: productIdentifiers,
            })
        },
    // ...
})
```

</details>

#### Widgets: `[EVENTS.GET_WIDGET_PROVIDED], [EVENTS.SET_WIDGET_PROVIDED]`

Provide previously saved widgets using the event `EVENTS.SET_WIDGET_PROVIDED` with
values:` {action: EVENTS.SET_WIDGET_PROVIDED, payload: IWidgets} `in response to` EVENTS.GET_WIDGET_PROVIDED`.

<details>
<summary>baseLayer.ts</summary>

```typescript 
const unregisterEvents = registerEvents({
    // ...
    [EVENTS.GET_WIDGET_PROVIDED]:
        (event: {
            action: 'TS_GET_WIDGET_PROVIDED'
            payload: {
                id: eTrustedChannelRef,
                salesChannelRef: string
            }
        }) => {
            dispatchAction({
                action: EVENTS.SET_WIDGET_PROVIDED,
                payload: dataWidgets as IWidgets,
            })
        }
    // ...
})
```

</details>

<details>
<summary>example dataWidgets</summary>

```typescript
const dataWidgets: IWidgets = {
    id: '',
    salesChannelRef: '',
    children: [
        {
            tag: 'script',
            attributes: {
                src: {
                    value: 'https://integrations.etrusted.koeln/applications/widget.js/v2',
                    attributeName: 'src',
                },
                async: {
                    attributeName: 'async',
                },
                defer: {
                    attributeName: 'defer',
                },
            },
            children: [
                {
                    tag: 'etrusted-widget',
                    applicationType: 'product_stars',
                    widgetId: 'wdg-123e4',
                    attributes: {
                        id: {
                            value: 'wdg-123e4',
                            attributeName: 'data-etrusted-widget-id',
                        },
                        productIdentifier: {
                            attributeName: 'data-sku',
                        },
                    },
                },
                {
                    tag: 'etrusted-widget',
                    applicationType: 'product_review_list',
                    widgetId: 'wdg-321e4',
                    widgetLocation: {
                        id: '21d3d933eb93',
                        name: 'Footer',
                    },
                    extensions: {
                        product_star: {
                            tag: 'etrusted-product-review-list-widget-product-star-extension',
                        },
                    },
                    attributes: {
                        id: {
                            value: 'wdg-321e4',
                            attributeName: 'data-etrusted-widget-id',
                        },
                        productIdentifier: {
                            attributeName: 'data-mpn',
                        },
                    },
                },
                {
                    tag: 'etrusted-widget',
                    applicationType: 'trusted_stars_service',
                    widgetId: 'wdg-567e5',
                    widgetLocation: {id: '21d3d933eb93', name: 'Home Page'},
                    attributes: {
                        id: {
                            value: 'wdg-567e5',
                            attributeName: 'data-etrusted-widget-id',
                        },
                        productIdentifier: {
                            attributeName: 'data-gtin',
                        },
                    },
                },
                {
                    tag: 'etrusted-widget',
                    applicationType: 'review_carousel_service',
                    widgetId: 'wdg-234',
                    widgetLocation: {id: '21d3d933eb93', name: 'Home Page'},
                    attributes: {
                        id: {
                            value: 'wdg-234',
                            attributeName: 'data-etrusted-widget-id',
                        },
                    },
                },
            ],
        },
    ],
}
```

</details>


<details>
<summary>interface IWidgets</summary>

```typescript
 interface IWidgets {
    id: string
    salesChannelRef: string
    children: Array<{
        tag?: string
        attributes?: {
            [key: string]:
                {
                    value?: string;
                    attributeName?: string
                }
        }
        children: IWidgetsChildren[]
    }>
}

interface IWidgetsChildren {
    tag?: string
    widgetId: string
    applicationType: string
    widgetLocation?: {
        id: string
        name: string
    }
    extensions?: {
        product_star: {
            tag: string
        }
    }
    attributes?: {
        [key: string]: {
            value?: string;
            attributeName?: string
        }
    }
}
```

</details>

#### Save Widget changes: `[EVENTS.SAVE_WIDGET_CHANGES]`

Save Widget changes for this channel from the `EVENTS.SAVE_WIDGET_CHANGES` event. After successful save, call
the `EVENTS.SET_WIDGET_PROVIDED` and `EVENTS.NOTIFICATION` events.

<details>
<summary>baseLayer.ts</summary>

```typescript 
const unregisterEvents = registerEvents({
    // ...
    [EVENTS.SAVE_WIDGET_CHANGES]:
        (event: {
            action: 'TS_SAVE_WIDGET_CHANGES'
            payload: dataWidgets
        }) => {
            // Saving payload in db
            dispatchAction({
                action: EVENTS.SET_WIDGET_PROVIDED,
                payload: dataWidgets as IWidgets,
            })
        },
    // ...
})
```

</details>

#### Send Review Invites for products: `[EVENTS.GET_PRODUCT_REVIEW_FOR_CHANNEL], [EVENTS.SET_PRODUCT_REVIEW_FOR_CHANNEL]`

Provide selected channel data, if product reviews are to be collected by Trustbadge, using the
event `EVENTS.SET_PRODUCT_REVIEW_FOR_CHANNEL` with
values:` {action: EVENTS.SET_PRODUCT_REVIEW_FOR_CHANNEL, payload: IMappedChannel | null } `in response
to` EVENTS.GET_PRODUCT_REVIEW_FOR_CHANNEL`.

<details>
<summary>baseLayer.ts</summary>

```typescript
interface IMappedChannel {
    eTrustedChannelRef: string
    eTrustedLocale: string
    eTrustedName: string
    eTrustedUrl: string
    eTrustedAccountRef: string
    salesChannelRef: string
    salesChannelLocale: string
    salesChannelName: string
    salesChannelUrl: string
}

const unregisterEvents = registerEvents({
    // ...
    [EVENTS.GET_PRODUCT_REVIEW_FOR_CHANNEL]:
        (event: {
            action: 'TS_GET_PRODUCT_REVIEW_FOR_CHANNEL'
            payload: { id: eTrustedChannelRef, salesChannelRef: string }
        }) => {
            dispatchAction({
                action: EVENTS.SET_PRODUCT_REVIEW_FOR_CHANNEL,
                payload: data as IMappedChannel | null,
            })
        }
    // ...
})
```

</details>

#### Activate/deactivate Review Invites for products: `[EVENTS.ACTIVATE_PRODUCT_REVIEW_FOR_CHANNEL],  [EVENTS.DEACTIVATE_PRODUCT_REVIEW_FOR_CHANNEL]`

Save activation/deactivation changes for this channel from
the `EVENTS.ACTIVATE_PRODUCT_REVIEW_FOR_CHANNEL`/ `[EVENTS.DEACTIVATE_PRODUCT_REVIEW_FOR_CHANNEL]` events. After
successful save, call the `EVENTS.SET_PRODUCT_REVIEW_FOR_CHANNEL` and `EVENTS.NOTIFICATION` events.

<details>
<summary>baseLayer.ts</summary>

```typescript 
const unregisterEvents = registerEvents({
    // ...
    [EVENTS.ACTIVATE_PRODUCT_REVIEW_FOR_CHANNEL]:
        (event: {
            action: 'TS_ACTIVATE_PRODUCT_REVIEW_FOR_CHANNEL'
            payload: IMappedChannel
        }) => {
            // Saving payload in db
            dispatchAction({
                action: EVENTS.SET_PRODUCT_REVIEW_FOR_CHANNEL,
                payload: data as IMappedChannel,
            })
        },
    [EVENTS.DEACTIVATE_PRODUCT_REVIEW_FOR_CHANNEL]:
        (event: {
            action: 'TS_DEACTIVATE_PRODUCT_REVIEW_FOR_CHANNEL'
            payload: IMappedChannel
        }) => {
            // deactivate in db
            dispatchAction({
                action: EVENTS.SET_PRODUCT_REVIEW_FOR_CHANNEL,
                payload: null,
            })
        },
    // ...
})
```

</details>

#### Use Estimated Delivery Date to send Review Invites (for allowsEstimatedDeliveryDate: true): `[EVENTS.GET_USE_ESTIMATED_DELIVERY_DATE_FOR_CHANNEL],  [EVENTS.SET_USE_ESTIMATED_DELIVERY_DATE_FOR_CHANNEL]`

Provide configured option for the given channel using the `EVENTS.SET_USE_ESTIMATED_DELIVERY_DATE_FOR_CHANNEL` event
with
values: `{action: EVENTS.SET_USE_ESTIMATED_DELIVERY_DATE_FOR_CHANNEL, payload: { eTrustedChannelRef: string;salesChannelRef: string; active: boolean; isUseDateToSendReviewInvites: boolean }} `
in response to ` EVENTS.GET_USE_ESTIMATED_DELIVERY_DATE_FOR_CHANNEL`.

<details>
<summary>baseLayer.ts</summary>

```typescript 
const unregisterEvents = registerEvents({
    // ...
    [EVENTS.GET_USE_ESTIMATED_DELIVERY_DATE_FOR_CHANNEL]:
        (event: {
            action: 'TS_GET_USE_ESTIMATED_DELIVERY_DATE_FOR_CHANNEL'
            payload: {
                id: eTrustedChannelRef,
                salesChannelRef: string
            }
        }) => {
            dispatchAction({
                action: EVENTS.SET_USE_ESTIMATED_DELIVERY_DATE_FOR_CHANNEL,
                payload: {
                    eTrustedChannelRef: string,
                    salesChannelRef: string,
                    active: boolean,
                    isUseDateToSendReviewInvites: boolean
                },
            })
        }
    // ...
})
```

</details>

#### Activate/deactivate Review Invites at the right time: `[EVENTS.SAVE_USE_ESTIMATED_DELIVERY_DATE_FOR_CHANNEL]`

Save the configured option for this channel from the `EVENTS.SAVE_USE_ESTIMATED_DELIVERY_DATE_FOR_CHANNEL` event. After
successful save, call the `EVENTS.SET_USE_ESTIMATED_DELIVERY_DATE_FOR_CHANNEL` and `EVENTS.NOTIFICATION` events.

<details>
<summary>baseLayer.ts</summary>

```typescript 
const unregisterEvents = registerEvents({
    // ...
    [EVENTS.SAVE_USE_ESTIMATED_DELIVERY_DATE_FOR_CHANNEL]:
        (event: {
            action: 'TS_SAVE_USE_ESTIMATED_DELIVERY_DATE_FOR_CHANNEL'
            payload: {
                eTrustedChannelRef: string;
                salesChannelRef: string;
                active: boolean;
                isUseDateToSendReviewInvites: boolean
            }
        }) => {
            // Saving payload in db
            dispatchAction({
                action: EVENTS.SET_USE_ESTIMATED_DELIVERY_DATE_FOR_CHANNEL,
                payload: {
                    eTrustedChannelRef: string,
                    salesChannelRef: string,
                    active: boolean,
                    isUseDateToSendReviewInvites: boolean
                },
            })
        },
    // ...
})
```

</details>

#### Use order status “Shipped” to send Review Invites (for allowsEventsByOrderStatus: true):

`[EVENTS.GET_USE_EVENTS_BY_ORDER_STATUS_FOR_CHANNEL],  [EVENTS.SET_USE_EVENTS_BY_ORDER_STATUS_FOR_CHANNEL]`

Provide configured option for the given channel using the `EVENTS.SET_USE_EVENTS_BY_ORDER_STATUS_FOR_CHANNELL` event
with
values: `{action: EVENTS.SET_USE_EVENTS_BY_ORDER_STATUS_FOR_CHANNEL, payload: { eTrustedChannelRef: string;salesChannelRef: string; active: boolean }} `
in response to ` EVENTS.GET_USE_EVENTS_BY_ORDER_STATUS_FOR_CHANNEL`.

<details>
<summary>baseLayer.ts</summary>

```typescript 
const unregisterEvents = registerEvents({
    // ...
    [EVENTS.GET_USE_EVENTS_BY_ORDER_STATUS_FOR_CHANNEL]: (event: {
        action: 'TS_GET_USE_EVENTS_BY_ORDER_STATUS_FOR_CHANNEL'
        payload: { eTrustedChannelRef: string; salesChannelRef: string; active: boolean }
    }) => {
        dispatchAction({
            action: EVENTS.SET_USE_EVENTS_BY_ORDER_STATUS_FOR_CHANNEL,
            payload: data as { eTrustedChannelRef: string; salesChannelRef: string; active: boolean },
        })
    },
    // ...
})
```

</details>

#### Activate/deactivate Review Invites at the right time: `[EVENTS.SAVE_USE_EVENTS_BY_ORDER_STATUS_FOR_CHANNEL]`

Save the configured option for this channel from the `EVENTS.SAVE_USE_EVENTS_BY_ORDER_STATUS_FOR_CHANNEL` event. After
successful save, call the `EVENTS.SET_USE_EVENTS_BY_ORDER_STATUS_FOR_CHANNEL` and `EVENTS.NOTIFICATION` events.

<details>
<summary>baseLayer.ts</summary>

```typescript 
const unregisterEvents = registerEvents({
    // ...
    [EVENTS.SAVE_USE_EVENTS_BY_ORDER_STATUS_FOR_CHANNEL]:
        (event: {
            action: 'TS_SAVE_USE_EVENTS_BY_ORDER_STATUS_FOR_CHANNEL'
            payload: { eTrustedChannelRef: string; salesChannelRef: string; active: boolean }
        }) => {
            // Saving payload in db
            dispatchAction({
                action: EVENTS.SET_USE_EVENTS_BY_ORDER_STATUS_FOR_CHANNEL,
                payload: data as { eTrustedChannelRef: string; salesChannelRef: string; active: boolean },
            })
        },
    ...
})
```

</details>

#### Download CSV file to send invitations to view previous orders `[EVENTS.EXPORT_PREVIOUS_ORDER]`

Implement a method to export order data according to the specified channel from the `EVENTS.EXPORT_PREVIOUS_ORDER`
event. After the download starts, call the `EVENTS.SET_EXPORT_PREVIOUS_ORDER` event to inform the Connector layer.

<details>
<summary>baseLayer.ts</summary>

```typescript
const unregisterEvents = registerEvents({
    // ...
    [EVENTS.EXPORT_PREVIOUS_ORDER]: (event: {
        action: 'TS_EXPORT_PREVIOUS_ORDER'
        payload: { id: string; numberOfDays: number, salesChannelRef: string }
    }) => {
        // Method to export order data
        dispatchAction({
            action: EVENTS.SET_EXPORT_PREVIOUS_ORDER,
            payload: data as { id: string; numberOfDays: number },
        })
    },
    ...
})
```

</details>

#### Disconnect: `[EVENTS.DISCONNECTED]`

Implement a method to remove all stored configuration including any API client credentials from `EVENTS.DISCONNECTED`
events.
After removing all saved configuration, call the `EVENTS.SET_DISCONNECTED` event to inform the connector layer.

<details>
<summary>baseLayer.ts</summary>

```typescript 
const unregisterEvents = registerEvents({
    // ...
    [EVENTS.DISCONNECTED]:
        (event: {
            action: 'TS_DISCONNECTED'
            payload: null
        }) => {
            // Method to remove all stored configuration
            dispatchAction({action: EVENTS.SET_DISCONNECTED, payload: null})
        },
    // ...
})
```

</details>

#### Store information: `[EVENTS.GET_INFORMATION_OF_SYSTEM], [EVENTS.SET_INFORMATION_OF_SYSTEM]`

Provide basic store information (system name and version number, plugin version number)

<details>
<summary>baseLayer.ts</summary>

```typescript 
const unregisterEvents = registerEvents({

    [EVENTS.GET_INFORMATION_OF_SYSTEM]:
        (event: {
            action: 'TS_GET_INFORMATION_OF_SYSTEM'
            payload: null
        }) => {
            dispatchAction({
                action: EVENTS.SET_INFORMATION_OF_SYSTEM,
                payload: {
                    nameOfSystem: string,
                    versionNumberOfSystem: string,
                    versionNumberOfPlugin: string,
                    allowsEstimatedDeliveryDate: boolean,
                    allowsEventsByOrderStatus: boolean,
                    allowsSendReviewInvitesForPreviousOrders: boolean,
                    allowsSendReviewInvitesForProduct: boolean,
                    allowsEditIntegrationCode: boolean,
                    allowsSupportWidgets: boolean
                }
            })
        },
    ...
})
```

</details>

If the parameter `allowsSendReviewInvitesForPreviousOrders` is not in the information of system, then the export-block
is displayed (the case will allow you to integrate into all existing systems)

If the parameter `allowsSendReviewInvitesForPreviousOrders` is false, then the export-block is hidden. If true, then
display

#### Notifications: [EVENTS.NOTIFICATION]

In data save events such
as `EVENTS.SAVE_CREDENTIALS, SAVE_MAPPED_CHANNEL, EVENTS.SAVE_TRUSTBADGE_CONFIGURATION, EVENTS.ACTIVATE_PRODUCT_REVIEW_FOR_CHANNEL, EVENTS.DEACTIVATE_PRODUCT_REVIEW_FOR_CHANNEL, SAVE_WIDGET_CHANGES, SAVE_USE_ESTIMATED_DELIVERY_DATE_FOR_CHANNEL`
add a message about successful or failed data saving using events `EVENTS.NOTIFICATION` with
values: `{action: EVENTS.NOTIFICATION}`

| Base layer result          | status    | type            | Connector message                                                         |
|----------------------------|-----------|-----------------|---------------------------------------------------------------------------|
| `Value saved successfully` | 'success' | 'save'          | `Changes saved  successfully`                                             |
| `Changes not saved`        | 'error'   | 'save'          | `Saving Data has failed`                                                  |
| `Export CSV`               | 'error'   | 'exportTimeout' | `Timeout while exporting last orders - not all orders could be excerpted` |

<details>
<summary>baseLayer.ts</summary>

```typescript
const unregisterEvents = registerEvents({
    // ...
    [EVENTS.SAVE_CREDENTIALS]:
        (event: {
            action: 'TS_SAVE_CREDENTIALS'
            payload: any
        }) => {
            dispatchAction({
                action: EVENTS.NOTIFICATION,
                payload: {event: 'TS_SAVE_CREDENTIALS', status: 'error' | 'success', type: 'save'},
            })
        },
    ...
})
```

</details>

import { EVENTS } from './eventsList';

export type DispatchArgumentTypes =
  | BaseEvent
  | ActionById
  | EventCredentialsAction
  | EventErrorAction
  | EventSetLocalAction
  | EventListChannelsAction
  | EventListMappingChannelsAction
  | EventTrustbadgeAction
  | EventWidgetsAction
  | EventChannelAction
  | EventLocationForWidgetAction
  | EventExportPreviousOrder
  | EventUseEstimatedDeliveryDateForChannelAction
  | ITrustbadge
  | EventUseEventsByOrderStatusForChannelAction
  | EventNotificationsAction;

type BaseAction = {
  action: EVENTS
};

type BaseEvent = {
  payload: null
} & BaseAction;

type EventErrorAction = {
  payload: { event?: string; message?: string }
} & BaseAction;

type EventSetLocalAction = {
  payload: string
} & BaseAction;

type ActionById = {
  payload: { id: string }
} & BaseAction;

export interface ITrustbadge {
  id: string
  salesChannelRef: string,
  children: ITrustbadgeChildren[]
}
export interface ITrustbadgeChildren {
  tag?: string
  attributes: {
    [key: string]: { value?: string | number | boolean; attributeName?: string }
  }
  children?: ITrustbadgeChildren[]
}

type EventTrustbadgeAction = {
  payload: ITrustbadge
} & BaseAction;

export interface IWidgets {
  id: string
  salesChannelRef: string
  children: Array<{
    tag?: string
    attributes?: {
      [key: string]: { value?: string; attributeName?: string }
    }
    children: IWidgetsChildren[]
  }>
}
export interface IWidgetsChildren {
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
    [key: string]: { value?: string; attributeName?: string }
  }
}

type EventWidgetsAction = {
  payload: IWidgets
} & BaseAction;

type EventListChannelsAction = {
  payload: {
    id: string
    name: string
    url: string
    locale: string
  }[]
} & BaseAction;

export interface IMappedChannel {
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

type EventListMappingChannelsAction = {
  payload: IMappedChannel[]
} & BaseAction;

export type EventChannelAction = {
  payload: IMappedChannel | null
} & BaseAction;

type EventUseEstimatedDeliveryDateForChannelAction = {
  payload: { id: string; isUseDateToSendReviewInvites?: boolean; active?: boolean; salesChannelRef: string }
} & BaseAction;

type EventUseEventsByOrderStatusForChannelAction = {
  payload: { id: string; active: boolean; salesChannelRef: string }
} & BaseAction;

type EventExportPreviousOrder = {
  payload: { id: string; numberOfDays: number; salesChannelRef: string }
} & BaseAction;

type EventSetInformationOfSeyetemAction = {
  payload: {
    nameOfSystem: string
    versionNumberOfSystem: string
    versionNumberOfPlugin: string
    allowsEstimatedDeliveryDate: boolean
  }
} & BaseAction;

type EventCredentialsAction = {
  payload: {
    clientId: string
    clientSecret: string
  }
} & BaseAction;

type EventLocationForWidgetAction = {
  payload: {
    id: string
    name: string
  }[]
} & BaseAction;

type EventProductIdentifiersAction = {
  payload: {
    id: string
    name: string
  }[]
} & BaseAction;

type EventNotificationsAction = {
  payload: { event?: string; message?: string; status: 'error' | 'success' }
} & BaseAction;

export interface EventsLibHandlers {
  //locale
  [EVENTS.GET_LOCALE]?: (payload: BaseEvent) => void;
  [EVENTS.SET_LOCALE]?: (payload: EventSetLocalAction) => void;

  //credentials
  [EVENTS.GET_CREDENTIALS_PROVIDED]?: (payload: BaseEvent) => void;
  [EVENTS.SET_CREDENTIALS_PROVIDED]?: (payload: EventCredentialsAction) => void;
  [EVENTS.SAVE_CREDENTIALS]?: (payload: EventCredentialsAction) => void;

  //channels
  [EVENTS.GET_SALES_CHANNELS_PROVIDED]?: (payload: BaseEvent) => void;
  [EVENTS.SET_SALES_CHANNELS_PROVIDED]?: (
    payload: EventListChannelsAction
  ) => void;

  [EVENTS.SAVE_MAPPED_CHANNEL]?: (
    payload: EventListMappingChannelsAction
  ) => void;

  [EVENTS.GET_MAPPED_CHANNELS]?: (payload: BaseEvent) => void;
  [EVENTS.SET_MAPPED_CHANNELS]?: (
    payload: EventListMappingChannelsAction
  ) => void;

  //trustbadge
  [EVENTS.GET_TRUSTBADGE_CONFIGURATION_PROVIDED]?: (
    payload: ActionById
  ) => void;
  [EVENTS.SET_TRUSTBADGE_CONFIGURATION_PROVIDED]?: (
    payload: EventTrustbadgeAction
  ) => void;
  [EVENTS.SAVE_TRUSTBADGE_CONFIGURATION]?: (
    payload: EventTrustbadgeAction
  ) => void;

  //widget
  [EVENTS.GET_LOCATION_FOR_WIDGET]?: (payload: ActionById) => void;
  [EVENTS.SET_LOCATION_FOR_WIDGET]?: (
    payload: EventLocationForWidgetAction
  ) => void;

  [EVENTS.GET_AVAILABLE_PRODUCT_IDENTIFIERS]?: (payload: ActionById) => void;
  [EVENTS.SET_AVAILABLE_PRODUCT_IDENTIFIERS]?: (
    payload: EventProductIdentifiersAction
  ) => void;

  [EVENTS.GET_WIDGET_PROVIDED]?: (payload: ActionById) => void;
  [EVENTS.SET_WIDGET_PROVIDED]?: (payload: EventWidgetsAction) => void;

  [EVENTS.SAVE_WIDGET_CHANGES]?: (payload: EventWidgetsAction) => void;

  //review
  [EVENTS.GET_PRODUCT_REVIEW_FOR_CHANNEL]?: (payload: ActionById) => void;
  [EVENTS.SET_PRODUCT_REVIEW_FOR_CHANNEL]?: (
    payload: EventChannelAction
  ) => void;

  [EVENTS.ACTIVATE_PRODUCT_REVIEW_FOR_CHANNEL]?: (
    payload: EventChannelAction
  ) => void;
  [EVENTS.DEACTIVATE_PRODUCT_REVIEW_FOR_CHANNEL]?: (
    payload: ActionById
  ) => void;

  [EVENTS.GET_USE_ESTIMATED_DELIVERY_DATE_FOR_CHANNEL]?: (
    payload: ActionById
  ) => void;
  [EVENTS.SET_USE_ESTIMATED_DELIVERY_DATE_FOR_CHANNEL]?: (
    payload: EventUseEstimatedDeliveryDateForChannelAction
  ) => void;
  [EVENTS.SAVE_USE_ESTIMATED_DELIVERY_DATE_FOR_CHANNEL]?: (
    payload: EventUseEstimatedDeliveryDateForChannelAction
  ) => void;

  [EVENTS.GET_USE_EVENTS_BY_ORDER_STATUS_FOR_CHANNEL]?: (
    payload: ActionById
  ) => void;
  [EVENTS.SET_USE_EVENTS_BY_ORDER_STATUS_FOR_CHANNEL]?: (
    payload: EventUseEventsByOrderStatusForChannelAction
  ) => void;
  [EVENTS.SAVE_USE_EVENTS_BY_ORDER_STATUS_FOR_CHANNEL]?: (
    payload: EventUseEventsByOrderStatusForChannelAction
  ) => void;

  [EVENTS.EXPORT_PREVIOUS_ORDER]?: (payload: EventExportPreviousOrder) => void;
  [EVENTS.SET_EXPORT_PREVIOUS_ORDER]?: (
    payload: EventExportPreviousOrder
  ) => void;

  [EVENTS.DISCONNECTED]?: (payload: BaseEvent) => void;
  [EVENTS.SET_DISCONNECTED]?: (payload: BaseEvent) => void;

  [EVENTS.GET_INFORMATION_OF_SYSTEM]?: (payload: BaseEvent) => void;
  [EVENTS.SET_INFORMATION_OF_SYSTEM]?: (
    payload: EventSetInformationOfSeyetemAction
  ) => void;

  [EVENTS.NOTIFICATION]?: (payload: EventNotificationsAction) => void;
  [EVENTS.ERROR]?: (payload: EventErrorAction) => void;

  [EVENTS.CLOSE_CONNECTOR]?: (payload: BaseEvent) => void;
}
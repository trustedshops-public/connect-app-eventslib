import { EVENTS } from './eventsList';
import { EventsLibHandlers, DispatchArgumentTypes } from './types';

/**
 * The bus is same-window by construction: dispatchAction calls
 * window.postMessage(...) with no target window, which delivers to this very
 * window with the default targetOrigin of '/'. A message whose source is a
 * different window can therefore never be ours — it was injected by an
 * opener/openee or a framing page and must be dropped.
 */
const isTrustedSender = (msg: MessageEvent): boolean => {
  if (msg.source !== window) return false;
  // Defence in depth + makes the origin check explicit for auditors.
  // Tolerates opaque origins (file:// demo pages) where msg.origin is '' / 'null'.
  if (msg.origin && msg.origin !== 'null' && msg.origin !== window.location.origin) return false;
  return true;
};

const processMessage = (msg: MessageEvent, handlers: EventsLibHandlers) => {
  if (!isTrustedSender(msg)) return;
  if (!!msg.data && (!!msg.data?.action || typeof msg.data === 'string')) {
    let result;
    try {
      result = JSON.parse(msg.data);
    } catch (err) {
      result = {
        action: EVENTS.ERROR,
        payload: { message: `Error receiving ${msg.data}` },
      };
    }
    if (handlers.hasOwnProperty(result.action)) {
      handlers[result.action](result);
    }
  }
};

export const registerEvents = function (
  handlerEvent: EventsLibHandlers
): () => void {
  const areaListener = new AbortController();
  window.addEventListener(
    "message",
    (msg) => processMessage(msg, handlerEvent),
    { signal: areaListener.signal }
  );

  function usub() {
    areaListener.abort();
  }
  return usub;
};

export const dispatchAction = (args: DispatchArgumentTypes): void => window.postMessage(JSON.stringify(args));
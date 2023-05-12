import { EVENTS } from './eventsList';
import { EventsLibHandlers, DispatchArgumentTypes } from './types';

const processMessage = (msg: MessageEvent, handlers: EventsLibHandlers) => {
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
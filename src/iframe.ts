import {sendClientId, wait, getClientId} from "./common";

export interface IframeSourceParams {
  element?: HTMLIFrameElement;
  selector?: string;
  trackingName?: string;
  destinationOrigin : string;
}

export interface IframeDestinationParams {
  trackingId : string;
  sourceOrigin : string;
  cookieDomain?: string;
  trackingName?: string;
  createOptions : {
    [key : string]: any
  };
}

async function findIframe(selector : string, timeout = 5000) {
  let time = 0;
  while (time < timeout) {
    const el = document.querySelector(selector);
    if (el) 
      return el as HTMLIFrameElement;
    await wait(100);
    time += 100;
  }
  throw new Error("no iframe");
}

export async function source(params : IframeSourceParams) {
  let element : HTMLIFrameElement | undefined;
  if (params.element instanceof HTMLIFrameElement) {
    element = params.element;
  } else if (params.selector) {
    element = await findIframe(params.selector);
  }
  if (!element) 
    throw new Error("no iframe");
  return sendClientId(element.contentWindow as Window, await getClientId(params.trackingName), params.destinationOrigin);
}

export async function destination(params : IframeDestinationParams) {
  return new Promise((resolve, reject) => {
    function recieve(ev : MessageEvent) {
      try {
        if (ev.origin !== params.sourceOrigin || !ev.data || !ev.data.clientId) 
          return;
        ga("create", params.trackingId, params.cookieDomain, params.trackingName, {
          clientId: ev.data.clientId,
          ...params.createOptions
        });
        (ev.source as Window).postMessage(ev.data, ev.origin);
        window.removeEventListener("message", recieve);
        resolve(ga);
      } catch (e) {
        reject(e);
      }
    }
    window.addEventListener("message", recieve);
  });
}
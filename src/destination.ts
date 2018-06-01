import {expose} from "./expose";

export interface destinationParams {
  trackingId : string;
  sourceOrigin : string;
  cookieDomain?: string;
  trackingName?: string;
  createOptions : {
    [key : string]: any
  };
}

const defaultDestinationParams : destinationParams = {
  trackingId: "",
  sourceOrigin: "",
  cookieDomain: "auto",
  createOptions: {
    allowLinker: true
  }
};

export function destination(params : destinationParams) {
  params = {
    ...defaultDestinationParams,
    ...params
  };
  if (!document.referrer.indexOf(`${location.protocol}//${location.hostname}`)) {
    ga("create", params.trackingId, params.cookieDomain, params.trackingName, params.createOptions);
    return ga;
  }
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

expose("gaxd.destination", destination);
import {getClientId, sendClientId} from "./common";
import {destination as _destination} from "./iframe";

export interface RedirectSourceParams {
  origins : string[];
  trackingName?: string;
  openOptions?: {
    windowName: string;
    windowFeature?: string;
  }
}

function getAnchorElement(element?: HTMLElement) : HTMLAnchorElement | undefined {
  while(element) {
    if (element.nodeName === "A") 
      return element as HTMLAnchorElement;
    element = element.parentElement as HTMLElement;
  }
}

function getTargetOrigin(element : HTMLAnchorElement, origins : string[]) {
  for (let i = 0; i < origins.length; ++i) {
    if (element.href.indexOf(origins[i]) !== -1) 
      return origins[i];
    }
  }

export async function source(params : RedirectSourceParams) {
  const clientId = await getClientId(params.trackingName);

  document.addEventListener("click", ev => {
    const element = getAnchorElement(ev.target as HTMLElement);
    if (!element) 
      return;
    const targetOrigin = getTargetOrigin(element, params.origins);
    if (!targetOrigin) 
      return;
    ev.preventDefault();
    const w = params.openOptions
      ? window.open(element.href, params.openOptions.windowName, params.openOptions.windowFeature)
      : window.open(element.href);
    sendClientId(w as Window, clientId, targetOrigin);
  });
}

export const destination = _destination;
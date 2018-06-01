interface IframeSourceParams {
  element?: HTMLIFrameElement;
  selector?: string;
  trackingName?: string;
  destinationOrigin : string;
}

interface RedirectSourceParams {
  origins : string[];
  trackingName?: string;
  openOptions?: {
    windowName: string;
    windowFeature?: string;
  }
}

async function wait(ms : number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getClientId(name?: string) {
  if (name) {
    return ga
      .getByName(name)
      .get("clientId");
  } else {
    return new Promise((resolve, reject) => {
      ga(tracker => {
        if (tracker) {
          const clientId = tracker.get("clientId");
          clientId && resolve(clientId);
          return;
        }
        reject(new Error("no clientId"));
      });
    })
  }
}

async function sendClientId(destinationWindow : Window, clientId : string, origin : string, timeout = 30000) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    const intervalId = setInterval(function send() {
      destinationWindow.postMessage({
        clientId
      }, origin);
      if (Date.now() - startTime > timeout) {
        clearInterval(intervalId);
        window.removeEventListener("message", recieve);
        reject(new Error("timeout: sendClientId"));
      }
    }, 100);
    function recieve(ev : MessageEvent) {
      if (!ev.data || ev.data.clientId !== clientId) 
        return;
      clearInterval(intervalId);
      window.removeEventListener("message", recieve);
      resolve();
    }
    window.addEventListener("message", recieve);
  });
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

async function iframe(params : IframeSourceParams) {
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

async function redirect(params : RedirectSourceParams) {
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
};
(window as any).gaxd = {
  source: {
    iframe,
    redirect
  }
};
export async function wait(ms : number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function getClientId(name?: string) {
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

export async function sendClientId(destinationWindow : Window, clientId : string, origin : string, timeout = 10000) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    const intervalId = setInterval(function send() {
      destinationWindow.postMessage({
        clientId
      }, origin);
      if (Date.now() - startTime > timeout) {
        clearInterval(intervalId);
        reject(new Error("timeout: sendClientId"));
      }
    }, 100);
    function recieve(ev : MessageEvent) {
      if (ev.origin !== origin || !ev.data || ev.data.clientId !== clientId) 
        return;
      clearInterval(intervalId);
      window.removeEventListener("message", recieve);
      resolve();
    }
    window.addEventListener("message", recieve);
  });
}
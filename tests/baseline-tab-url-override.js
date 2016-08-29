const {Cu, Ci} = require("chrome");
const tabs = require("sdk/tabs");
Cu.import("resource://gre/modules/Services.jsm");
const {data} = require("sdk/self");
const BLANK_PAGE = data.url("blank.html");

function hideURLs(window) {
  if (window.gInitialPages && !window.gInitialPages.includes(BLANK_PAGE)) window.gInitialPages.push(BLANK_PAGE);
}

// TODO: DIDNT RUN THIS YET

module.exports = perf => new Promise(done => {
  perf.start();

  Cu.import("resource:///modules/NewTabURL.jsm");
  NewTabURL.override(BLANK_PAGE);

  let enumerator = Services.wm.getEnumerator("navigator:browser");
  while (enumerator.hasMoreElements()) {
    let window = enumerator.getNext();
    hideURLs(window);
  }

  Services.ww.registerNotification({
    observe: (chromeWindow, topic) => {
      if (topic === "domwindowopened") {
        const onListen = {
          handleEvent: () => {
            hideURLs(chromeWindow);
            chromeWindow.QueryInterface(Ci.nsIDOMWindow).removeEventListener("DOMContentLoaded", onListen, false);
          }
        }
        chromeWindow.QueryInterface(Ci.nsIDOMWindow).addEventListener("DOMContentLoaded", onListen, false);
      }
    }
  });
});

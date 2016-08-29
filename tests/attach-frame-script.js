
module.exports = perf => new Promise((resolve, reject) => {
  const {Cc, Ci, Cu} = require("chrome");
  const {PageMod} = require("sdk/page-mod");
  const {data} = require("sdk/self");
  const tabs = require("sdk/tabs");
  const PAGE = data.url("blank.html");
  const globalMM = Cc["@mozilla.org/globalmessagemanager;1"].
                   getService(Ci.nsIMessageListenerManager);


  const N_TIMES = 100;

  const {median} = require("lib/math");
  function transformData(raw) {
    const value = median(raw.map(e => e.time));
    return {median: value, raw};
  }

  let receivedCount = 0;
  perf.start();

  globalMM.loadFrameScript(data.url("frame-script.js"), true);

  globalMM.addMessageListener('content-message', {
      receiveMessage: function(message) {
        perf.log("SCRIPT_LOADED", message.data);
        receivedCount++;
        if (receivedCount < N_TIMES) {
          tabs.open(PAGE);
        } else {
          resolve(transformData);
        }
      }
    },
    false
);

  tabs.open(PAGE);

});

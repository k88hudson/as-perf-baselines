module.exports = perf => new Promise((resolve, reject) => {
  const {Cu} = require("chrome");
  const {PageMod} = require("sdk/page-mod");
  const {data} = require("sdk/self");
  const tabs = require("sdk/tabs");
  const PAGE = data.url("blank.html");

  const N_TIMES = 100;

  const {median} = require("lib/math");
  function transformData(raw) {
    const value = median(raw.map(e => e.time));
    return {median: value, raw};
  }

  let receivedCount = 0;
  perf.start();

  const pm = new PageMod({
    include: PAGE,
    contentScriptFile: data.url("attach-content-script.js"),
    contentScriptWhen: "start",
    onAttach(worker) {
      worker.port.on("content-message", message => {
        perf.log("LOADED", message);
        receivedCount++;
        if (receivedCount > N_TIMES) {
          resolve(transformData);
        } else {
          tabs.open(PAGE);
        }
      });
    }
  });
  tabs.open(PAGE);

});

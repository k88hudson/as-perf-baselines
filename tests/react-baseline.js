module.exports = perf => new Promise((resolve, reject) => {
  const {Cu} = require("chrome");
  const {PageMod} = require("sdk/page-mod");
  const {data} = require("sdk/self");
  const tabs = require("sdk/tabs");
  const REACT_PAGE = data.url("react-baseline/index.html");
  Cu.import("resource:///modules/NewTabURL.jsm");
  NewTabURL.override(REACT_PAGE);

  const TOTAL_TESTS = 100;

  const {median} = require("lib/math");
  function transformData(raw) {
    const value = median(raw.map(e => e.time));
    return {median: value, raw};
  }

  let count = 0;
  perf.start();
  const pm = new PageMod({
    include: REACT_PAGE,
    contentScriptFile: data.url("message-bridge.js"),
    onAttach(worker) {
      worker.port.on("content-message", message => {
        if (count < TOTAL_TESTS) {
          perf.log("FIRST_RENDER", message);
          count++;
          tabs.open(REACT_PAGE);
        } else {
          resolve(transformData);
        }
      });
    }
  });
  tabs.open(REACT_PAGE);
});

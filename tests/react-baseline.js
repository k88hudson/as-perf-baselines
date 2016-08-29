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
    const medians = {
      "REACT_FIRST_MOUNT": median(raw.filter(e => e.event === "REACT_FIRST_MOUNT").map(e => e.time)),
      "JS_LOAD": median(raw.filter(e => e.event === "JS_LOAD").map(e => e.time)),
    };
    return {medians, raw};
  }

  let count = 0;
  perf.start();
  const pm = new PageMod({
    include: REACT_PAGE,
    contentScriptFile: data.url("message-bridge.js"),
    onAttach(worker) {
      worker.port.on("content-message", message => {
        if (count < TOTAL_TESTS) {
          message.forEach(item => perf.log(item[0], item[1]));
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

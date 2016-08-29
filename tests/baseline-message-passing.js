module.exports = perf => new Promise((resolve, reject) => {
  const {data} = require("sdk/self");
  const {PageMod} = require("sdk/page-mod");
  const {setTimeout} = require("sdk/timers");
  const tabs = require("sdk/tabs");
  const BLANK_PAGE = data.url("blank.html");
  const TIMES_TO_REPEAT = 100;

  const {median} = require("lib/math");
  function transformData(raw) {
    const value = median(raw.map(e => e.time));
    return {median: value, raw};
  }

  perf.start();

  let count = 0;
  const pm = new PageMod({
    include: BLANK_PAGE,
    contentScriptWhen: "start",
    contentScriptFile: data.url("baseline-message-passing/content-script.js"),
    onAttach(worker) {
      setTimeout(() => {
        worker.port.emit("ping");
        const startTime = perf.now();
        worker.port.on("pong", () => {
          const endTime = perf.now();
          perf.log("PING_PONG", endTime - startTime);
          if (count >= TIMES_TO_REPEAT) {
            resolve(transformData);
          } else {
            count++;
            tabs.open(BLANK_PAGE);
          }
        });
      }, 100);
    }
  });
  tabs.open(BLANK_PAGE);
});

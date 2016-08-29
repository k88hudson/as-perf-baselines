
// change test name here
const TEST_NAME = "react-baseline";

const PerfLogger = require("../lib/PerfLogger");
const perf = new PerfLogger(TEST_NAME);
const test = require(`tests/${TEST_NAME}`);

test(perf)
  .then(transform => {
    perf.outputToFile(transform)
      .then(file => console.log("COMPLETE"))
      .catch(e => console.log(e));
  })
  .catch(e => console.log(e));

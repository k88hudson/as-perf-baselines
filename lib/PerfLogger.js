const {Cc, Ci, Cu} = require("chrome");
const Telemetry = Cc["@mozilla.org/base/telemetry;1"].getService(Ci.nsITelemetry);
const {TextDecoder, TextEncoder, OS} = Cu.import("resource://gre/modules/osfile.jsm", {});
Cu.import("resource://gre/modules/FileUtils.jsm");

class PerfLogger {
  constructor(name) {
    this._name = name || "perf-logger";
    this._startTime = null;
    this._session = null;
  }
  round(n) {
    // rounds to 3 decimals
    return Math.round(n * 1000) / 1000;
  }
  start() {
    // Monotonic timer
    this._session = [];
    this._startTime = this.round(Telemetry.msSinceProcessStart());
    console.log("PerfLogger started at " + this._startTime);
  }
  now() {
    return Telemetry.msSinceProcessStart() - this._startTime;
  }
  log(event, rawTime) {
    rawTime = typeof rawTime === "number" ? rawTime : this.now();
    const time = this.round(rawTime);
    this._session.push({event, time});
    console.log(event, time);
    return time;
  }
  outputToFile(transform) {
    return new Promise((resolve, reject) => {
      const data = transform ? transform(this._session) : this._session;
      const logFilePath = OS.Path.join(
        OS.Constants.Path.homeDir, "github", "as-perf-baselines", "logs",
        `${this._name}-${Date.now()}.log.json`);
      const encoder = new TextEncoder();
      const array = encoder.encode(JSON.stringify(data, null, 2));
      OS.File.writeAtomic(logFilePath, array)
        .then(() => resolve(logFilePath))
        .catch(reject);
    });
  }
  reset() {
    this.start();
  }
}

module.exports = PerfLogger;

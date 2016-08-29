const JETPACK_DIR_BASENAME = "jetpack";
const {Cc, Ci} = require("chrome");
const file = require("sdk/io/file");
const self = require("sdk/self");

function simpleStorageFilename() {
   let storeFile = Cc["@mozilla.org/file/directory_service;1"].
                   getService(Ci.nsIProperties).
                   get("ProfD", Ci.nsIFile);
   storeFile.append(JETPACK_DIR_BASENAME);
   storeFile.append(self.id);
   storeFile.append("simple-storage");
   file.mkpath(storeFile.path);
   storeFile.append("store.json");
   return storeFile.path;
}

function writeToFile(data, onDone) {
  return new Promise((resolve, reject) => {
    console.log("Writing some data to file...");
    const filename = simpleStorageFilename();
    let stream = file.open(filename, "w");
    try {
      stream.writeAsync(JSON.stringify(data), err => {
        if (err) return reject(err);
        resolve();
      });
    }
    catch (err) {
      stream.close();
      reject(err);
    }
  });
}

const NUMBER_OF_HISTORY_ITEMS = 5000;
const simpleStorage = require("lib/simple-storage-hooks");
const {historyItem} = require("lib/sample-data");

const {median} = require("lib/math");
function transformData(raw) {
  const value = median(raw.map(e => e.time));
  return {
    historyItems: NUMBER_OF_HISTORY_ITEMS,
    median: value,
    raw
  };
}

module.exports = perf => new Promise((resolve, reject) => {
  let count = 0;
  const data = {};
  while (count < NUMBER_OF_HISTORY_ITEMS) {
    data["n-" + count] = historyItem;
    count++;
  }
  writeToFile(data)
    .then(() => {
      console.log("Ok, done!");
      perf.start();
      let c = 0;
      while (c < 100) {
        let start = perf.now();
        simpleStorage.manager.jsonStore.read()
        let end = perf.now();
        perf.log("READ", end - start);
        c++;
      }
      resolve(transformData);
    })
    .catch(e => {
      console.log(e);
      reject(e);
    });
});

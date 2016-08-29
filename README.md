# Activity Stream Perf Baselines

# Summary

Baseline message passing test:
- Attaches a page mod, opens a new tab for each
- addon sends ping to content-script, content-script sends pong to addon
- START: ping message sent to content
- END: pong message was received by addon
- 3 tests of 100 repetitions each
- RESULTS: 12.6 to 12.8 ms

Simple storage READ
- SETUP: injects some data into simple storage file. uses local port of simple-storage taht exposes read. write etc.
- simple storage synchronously reads it. log before and after sync read.
- 3 tests of 100 repetitions each, for each test set.
- TEST 1: With 500 history items, each a copy of of sampleData.testItem;
  - RESULTS: 2.3 to 2.5ms
- TEST 2: With 5000 history items
  - RESULTS: 23 to 25ms

Attach content scripts (pageMod)
- attach a content script with pageMod, contentScriptWhen set to "start"
- collect window.performance.now() inside the content script, in order to see when it loaded.
- RESULTS: 28-29ms

Attach frame scripts (global message manager)
- attach a frame script with global message manager
- collect window.performance.now() inside the frame script, in order to see when it loaded.
- RESULTS: 49-53ms

React Baseline
- measures time to first render (i.e. component did mount) for hello world react App
- bundled with webpack on with production configuration settings
- START: page load (according to window.performance.now)
- END: componentDidMount has fired
- RESULTS: 41-43ms, with some noticeable outliers (100-400ms)

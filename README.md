# Activity Stream Perf Baselines

# Our current Performance metrics:
- uses Date.now()
- TAB_OPEN is logged as on an 'open' event provided by sdk/tabs
- "NEWTAB_RENDER" is logged AFTER it is received on add-on side, triggered by the following conditions:
	- componentWillReceiveProps of NewTab, TopSites.init && History.init && Spotlight.init && Experiments.init && WeightedHighlights.init


# Factors affecting performance
- hardware
- history, bookmarks size
- OS? (look at metrics)
- FF version?
- number of tabs?
- state of browser during test (dev tools open, etc.)
- dev v.s. production build
- perf tools themselves
- which timer used
- message passing delay

# Baselines needed
- Router
- Addon load time (empty addon)
- Tab open time
- Message round-trip DONE
- Query from places/metadata
- Simple storage access DONE
- Time to first render for empty react app
- Attaching page mod content script vs framescipt DONE

# Test Methodology

- Uses monotonic timers on add-on,  (Telemetry.msSinceProcessStart(), window.performance.now)
- Each test is repeated 3 sets of 100 times
- Uses mean to account for outliers
- Output and reproducible tests in k88hudson/as-perf-baselines

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
- measures time to JS load, and to first render (i.e. component did mount) for hello world react App
- includes CSS loading of our actual css file
- bundled with webpack on with production configuration settings
- START: page load (according to window.performance.now)
- END: componentDidMount has fired
- RESULTS: 60.883 for js load
- RESULTS: 78.573 for mount
- apx. 18ms between js load and mount
- with some noticeable outliers (100-400ms)

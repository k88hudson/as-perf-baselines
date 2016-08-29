const loaded = window.performance.now();
self.port.emit("content-message", loaded);

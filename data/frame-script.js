const loaded = content.performance.now();
sendAsyncMessage("content-message", loaded);

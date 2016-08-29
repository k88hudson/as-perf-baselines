self.port.on("ping", () => {
  self.port.emit("pong");
});

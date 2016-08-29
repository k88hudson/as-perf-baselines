window.addEventListener("message", m => {
  self.port.emit("content-message", JSON.parse(m.data));
});

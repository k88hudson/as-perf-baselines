window.addEventListener("message", m => {
  self.port.emit("content-message", +m.data);
});

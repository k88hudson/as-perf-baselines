const React = require("react");
const ReactDOM = require("react-dom");

const App = React.createClass({
  componentDidMount() {
    const mountTime = window.performance.now();
    setTimeout(() => {
      window.postMessage(mountTime, "*");
    }, 100);
  },
  render() {
    return React.createElement("div", {}, "Hello world");
  }
});

ReactDOM.render(React.createElement(App), document.getElementById("root"));

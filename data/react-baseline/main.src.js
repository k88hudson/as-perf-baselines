const events = [];
events.push(["JS_LOAD", window.performance.now()]);
const React = require("react");
const ReactDOM = require("react-dom");

const App = React.createClass({
  componentDidMount() {
    const mountTime = window.performance.now();
    events.push(["REACT_FIRST_MOUNT", mountTime]);
    setTimeout(() => {
      window.postMessage(JSON.stringify(events), "*");
    }, 100);
  },
  render() {
    return React.createElement("div", {}, "Hello world");
  }
});

ReactDOM.render(React.createElement(App), document.getElementById("root"));

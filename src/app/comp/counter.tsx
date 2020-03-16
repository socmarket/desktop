import React from "react";
import { connect } from "react-redux";
import { CounterActions } from "../serv/counter"

class Counter extends React.Component {
  render() {
    return (
      <div>
        <strong>{this.props.counter.value}</strong>
        <button onClick={() => this.props.inc()}>+++</button>
        <button onClick={() => this.props.dec()}>---</button>
        <button onClick={() => this.props.start()}>Go</button>
        <button onClick={() => this.props.stop()}>Stop</button>
      </div>
    );
  }
}

const stateMap = (state) => {
  return { counter: state.counter };
}

export default connect(stateMap, CounterActions)(Counter);

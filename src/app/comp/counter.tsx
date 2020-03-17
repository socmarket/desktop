import React from "react";
import { connect } from "react-redux";
import { CounterActions } from "serv/counter"
import { Button, Menu } from "semantic-ui-react"

class Counter extends React.Component {
  render() {
    return (
      <Menu>
        <Menu.Item><Button primary onClick={() => this.props.start()}>Start</Button></Menu.Item>
        <Menu.Item><Button color="red" onClick={() => this.props.stop()}>Stop</Button></Menu.Item>
        <Menu.Item><Button color="green" onClick={() => this.props.inc()}>+</Button></Menu.Item>
        <Menu.Item><Button color="green" onClick={() => this.props.dec()}>-</Button></Menu.Item>
        <Menu.Item>
          {this.props.counter.value}
        </Menu.Item>
      </Menu>
    );
  }
}

const stateMap = (state) => {
  return { counter: state.counter };
}

export default connect(stateMap, CounterActions)(Counter);

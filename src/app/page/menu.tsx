import React from "react";
import { connect } from "react-redux";
import { AppActions } from "../serv/app"
import { Button, Menu } from "semantic-ui-react"

class MainMenu extends React.Component {
  render() {
    return (
      <Menu>
        <Menu.Item><Button primary onClick={() => this.props.openProducts()}>Номенклатура</Button></Menu.Item>
        <Menu.Item><Button primary onClick={() => this.props.openSaleCheck()}>Продажа</Button></Menu.Item>
        <Menu.Item><Button primary onClick={() => this.props.openConsignment()}>Склад</Button></Menu.Item>
      </Menu>
    );
  }
}

const stateMap = (state) => {
  return {};
}

export default connect(stateMap, AppActions)(MainMenu);


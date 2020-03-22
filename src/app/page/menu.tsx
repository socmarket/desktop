import React from "react";
import { connect } from "react-redux";
import { AppActions } from "../serv/app"
import { Button, Menu } from "semantic-ui-react"

class MainMenu extends React.Component {
  render() {
    return (
      <Menu>
        <Menu.Item
          active={this.props.app.showProductsDialog}
          onClick={() => this.props.openProducts()}
        >
          Номенклатура
        </Menu.Item>
        <Menu.Item
          active={this.props.app.showPricesDialog}
          onClick={() => this.props.openPrices()}
        >
          Цены
        </Menu.Item>
        <Menu.Item
          active={this.props.app.showSaleCheck}
          onClick={() => this.props.openSaleCheck()}
        >
          Продажа
        </Menu.Item>
        <Menu.Item
          active={this.props.app.showConsignment}
          onClick={() => this.props.openConsignment()}
        >
          Приёмка
        </Menu.Item>
      </Menu>
    );
  }
}

const stateMap = (state) => {
  return {
    app: state.app
  };
}

export default connect(stateMap, AppActions)(MainMenu);


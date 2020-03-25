import React from "react";
import { connect } from "react-redux";
import { AppActions } from "../serv/app"
import { Button, Menu } from "semantic-ui-react"

class MainMenu extends React.Component {
  render() {
    return (
      <Menu attached="top">
        <Menu.Item
          active={this.props.app.showDashboard}
          onClick={() => this.props.openDashboard()}
        >
          Главная
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

        <Menu.Menu position="right">
          <Menu.Item
            active={this.props.app.showPricesDialog}
            onClick={() => this.props.openPrices()}
          >
            Цены
          </Menu.Item>

          <Menu.Item
            active={this.props.app.showProductsDialog}
            onClick={() => this.props.openProducts()}
          >
            Номенклатура
          </Menu.Item>

          <Menu.Item
            active={this.props.app.showUnitsDialog}
            onClick={() => this.props.openUnits()}
          >
            Ед. измерения
          </Menu.Item>

          <Menu.Item
            active={this.props.app.showCategoriesDialog}
            onClick={() => this.props.openCategories()}
          >
            Категории
          </Menu.Item>

        </Menu.Menu>

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


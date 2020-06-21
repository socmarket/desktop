import React from "react";
import { connect } from "react-redux";
import { Button, Menu } from "semantic-ui-react"
import { AclActions } from "../serv/acl"
import { AppActions } from "../serv/app"

class MainMenu extends React.Component {
  render() {
    return (
      <Menu attached="top">
        <Menu.Item
          active={this.props.app.activePage === "dashboard"}
          onClick={() => this.props.openDashboard()}
        >
          Главная
        </Menu.Item>

        <Menu.Item
          active={this.props.app.activePage === "saleCheck"}
          onClick={() => this.props.openSaleCheck()}
        >
          Продажа
        </Menu.Item>

        <Menu.Item
          active={this.props.app.activePage === "consignment"}
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

          <Menu.Item
            active={this.props.app.showSuppliersDialog}
            onClick={() => this.props.openSuppliers()}
          >
            Поставщики
          </Menu.Item>

          <Menu.Item
            active={this.props.app.showClientsDialog}
            onClick={() => this.props.openClients()}
          >
            Клиенты
          </Menu.Item>

          <Menu.Item
            active={this.props.app.showAboutDialog}
            onClick={() => this.props.openAbout()}
          >
            О программе
          </Menu.Item>

          <Menu.Item
            active={this.props.app.showSettingsDialog}
            onClick={() => this.props.openSettings()}
          >
            Настройки
          </Menu.Item>

          <Menu.Item
            onClick={this.props.signOut}
          >
            Выйти
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

export default connect(stateMap, { ...AppActions, ...AclActions })(MainMenu);

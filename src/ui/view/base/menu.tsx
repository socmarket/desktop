import { AppActions }      from "Store/base/app"
import { SettingsActions } from "Store/base/settings"

import React, { Fragment } from "react";
import { connect }         from "react-redux";
import {
  Button, Menu, Segment, Label, Icon,
  Dropdown,
}                          from "semantic-ui-react"

const sales = [
  "autoPartsSaleCheckEditor",
  "autoPartsSaleJournal",
]

const products = [
  "autoPartsProductEditor",
  "autoPartsConsignmentEditor",
  "autoPartsConsignmentJournal",
  "baseCategoryEditor",
  "baseUnitEditor",
]

const calcs = [
  "prices",
  "baseClientEditor",
  "baseSupplierEditor",
  "baseCurrencyEditor",
]

class MainMenu extends React.Component {

  menu() {
    const theme = this.props.opt.theme
    const activePage = this.props.app.activePage
    const salesActive = sales.includes(activePage) ? "active" : ""
    const productsActive = products.includes(activePage) ? "active" : ""
    const calcsActive = calcs.includes(activePage) ? "active" : ""
    return (
      <Menu attached="top" pointing secondary inverted borderless color={theme.mainColor} style={{ fontSize: 16 }}>
        <Menu.Item style={{ paddingLeft: 0, paddingTop: 0, paddingRight: 0, paddingBottom: 7, marginLeft: 5, marginRight: 15 }}>
          <Label color={theme.mainColor}  size="big" style={{ padding: 5, margin: 0 }}>SOC</Label>
          <Label color="green" size="big" style={{ padding: 5, margin: 0 }}>Market</Label>
          <Label color={theme.mainColor}  size="big" style={{ padding: 5, margin: 0 }}>2C</Label>
        </Menu.Item>
        { (this.props.opt.appMode === "auto/parts") &&
          <Fragment>
            <Dropdown tabIndex={-1} text="Продажи" pointing className={"link item " + salesActive}>
              <Dropdown.Menu>
                <Dropdown.Item
                  icon="cart"
                  active={this.props.app.activePage === "autoPartsSaleCheckEditor"}
                  onClick={() => this.props.openAutoPartsSaleCheckEditor()}
                  text="Касса"
                />
                <Dropdown.Item
                  icon="list layout"
                  active={this.props.app.activePage === "autoPartsSaleJournal"}
                  onClick={() => this.props.openAutoPartsSaleJournal()}
                  text="Журнал продаж"
                />
              </Dropdown.Menu>
            </Dropdown>

            <Dropdown tabIndex={-1} text="Товары" pointing className={"link item " + productsActive}>
              <Dropdown.Menu>
                <Dropdown.Item
                  icon="zip"
                  active={this.props.app.activePage === "autoPartsConsignmentEditor"}
                  onClick={() => this.props.openAutoPartsConsignmentEditor()}
                  text="Приёмка на склад"
                />
                <Dropdown.Item
                  icon="list layout"
                  active={this.props.app.activePage === "autoPartsConsignmentJournal"}
                  onClick={() => this.props.openAutoPartsConsignmentJournal()}
                  text="Журнал поступлений"
                />
                <Dropdown.Item
                  icon="book"
                  active={this.props.app.activePage === "autoPartsProductEditor"}
                  onClick={() => this.props.openAutoPartsProductEditor()}
                  text="Описание товаров"
                />
                <Dropdown.Item
                  icon="file excel"
                  active={this.props.app.activePage === "autoPartsProductEditor"}
                  onClick={() => this.props.openAutoPartsProductEditor()}
                  text="Загрузка описаний из Excel"
                />
                <Dropdown.Item
                  icon="sitemap"
                  active={this.props.app.activePage === "baseCategoryEditor"}
                  onClick={() => this.props.openCategoryEditor()}
                  text="Группы товаров"
                />
                <Dropdown.Item
                  icon="law"
                  active={this.props.app.activePage === "baseUnitEditor"}
                  onClick={() => this.props.openUnitEditor()}
                  text="Единицы измерения"
                />
              </Dropdown.Menu>
            </Dropdown>
          </Fragment>
        }
        <Dropdown tabIndex={-1} text="Расчёты" pointing className={"link item " + calcsActive}>
          <Dropdown.Menu>
            <Dropdown.Item
              icon="dashboard"
              active={this.props.app.activePage === "baseDashboard"}
              onClick={() => this.props.openDashboard()}
              text="Дашборд"
            />
            <Dropdown.Item
              icon="chart line"
              active={this.props.app.activePage === "basePriceEditor"}
              onClick={() => this.props.openPriceEditor()}
              text="Цены"
            />
            <Dropdown.Item
              icon="dollar sign"
              active={this.props.app.activePage === "baseCurrencyEditor"}
              onClick={() => this.props.openCurrencyEditor()}
              text="Курсы валют"
            />
            <Dropdown.Item
              icon="users"
              active={this.props.app.activePage === "baseClientEditor"}
              onClick={() => this.props.openClientEditor()}
              text="Клиенты"
            />
            <Dropdown.Item
              icon="truck"
              active={this.props.app.activePage === "baseSupplierEditor"}
              onClick={() => this.props.openSupplierEditor()}
              text="Поставщики"
            />
          </Dropdown.Menu>
        </Dropdown>
        <Menu.Menu position="right">
          <Menu.Item>
            <Dropdown tabIndex={-1} text="Обучающие игры" pointing>
              <Dropdown.Menu>
                { Object.keys(this.props.opt.themes).map(name => (
                  <Dropdown.Item
                    key={name}
                    label={{ color: this.props.opt.themes[name].mainColor, empty: true, circular: true, size: "huge" }}
                    active={theme === theme.name}
                    onClick={() => this.props.changeTheme(name) }
                  />
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </Menu.Item>
          <Menu.Item>
            <Dropdown tabIndex={-1} text="Цвет" pointing>
              <Dropdown.Menu>
                { Object.keys(this.props.opt.themes).map(name => (
                  <Dropdown.Item
                    key={name}
                    label={{ color: this.props.opt.themes[name].mainColor, empty: true, circular: true, size: "huge" }}
                    active={theme === theme.name}
                    onClick={() => this.props.changeTheme(name) }
                  />
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </Menu.Item>
          <Menu.Item>
            Выйти
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    )
  }

  render() {
    return (
      <Segment inverted basic color={this.props.opt.theme.mainColor} style={{ paddingTop: 0, paddingBottom: 5 }}>
        {this.menu()}
      </Segment>
    );
  }
}

const stateMap = (state) => {
  return {
    app: state.app,
    opt: state.settings,
  }
}

export default connect(stateMap, {
  ...AppActions,
  ...SettingsActions,
})(MainMenu);

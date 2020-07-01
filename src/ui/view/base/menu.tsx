import { AppActions }      from "Store/base/app"
import { SettingsActions } from "Store/base/settings"

import React, { Fragment } from "react";
import { connect }         from "react-redux";
import {
  Button, Menu, Segment, Label, Icon,
  Dropdown, Modal, Grid, Divider,
}                          from "semantic-ui-react"

const sales = [
  "autoPartsSaleCheckEditor",
  "autoPartsSaleJournal",
]

const products = [
  "autoPartsProductEditor",
  "autoPartsProductImporter",
  "autoPartsConsignmentEditor",
  "autoPartsConsignmentJournal",
  "baseCategoryEditor",
  "baseUnitEditor",
]

const calcs = [
  "baseDashboard",
  "baseTurnover",
  "basePriceEditor",
  "baseClientEditor",
  "baseSupplierEditor",
  "baseCurrencyEditor",
]

class MainMenu extends React.Component {

  constructor(props) {
    super(props)
    this.onColorDoubleClick = this.onColorDoubleClick.bind(this)
    this.state = {
      showAbout: false,
    }
  }

  onColorDoubleClick(ev) {
    if (ev.shiftKey && ev.ctrlKey && this.props.app.user === "admin") {
      this.props.openSettingsEditor()
    }
  }

  about() {
    const theme = this.props.opt.theme
    return (
      <Modal open size="mini" centered={false} onClose={() => this.setState({ showAbout: false })}>
        <Modal.Content>
          <Segment inverted color={theme.mainColor} textAlign="center">
            <Label color={theme.mainColor}  size="big" style={{ padding: 5, margin: 0 }}>SOC</Label>
            <Label color="green" size="big" style={{ padding: 5, margin: 0 }}>Market</Label>
            <Label color={theme.mainColor}  size="big" style={{ padding: 5, margin: 0 }}>2C</Label>
          </Segment>
          <Segment>
            <Grid columns={2}>
              <Grid.Column textAlign="right">
                <p>Версия</p>
                <p>Сборка</p>
                <p>Дата сборки</p>
              </Grid.Column>
              <Grid.Column>
                <p>{VERSION.value}</p>
                <p>{VERSION.hash.substring(0, 8)}</p>
                <p>{VERSION.date.substring(0, 10)}</p>
              </Grid.Column>
            </Grid>
            <Divider vertical>|</Divider>
          </Segment>
        </Modal.Content>
      </Modal>
    )
  }

  menu() {
    const user = this.props.app.user
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
            { (user === "cashier" || user === "manager" || user === "admin") &&
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
            }

            { (user === "manager" || user === "admin") &&
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
                  active={this.props.app.activePage === "autoPartsProductImporter"}
                  onClick={() => this.props.openAutoPartsProductImporter()}
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
            }
          </Fragment>
        }
        { (user === "admin") &&
        <Dropdown tabIndex={-1} text="Расчёты" pointing className={"link item " + calcsActive}>
          <Dropdown.Menu>
            <Dropdown.Item
              icon="dashboard"
              active={this.props.app.activePage === "baseDashboard"}
              onClick={() => this.props.openDashboard()}
              text="Дашборд"
            />
            <Dropdown.Item
              icon="refresh"
              active={this.props.app.activePage === "baseTurnover"}
              onClick={() => this.props.openTurnover()}
              text="Оборот"
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
        }
        <Menu.Menu position="right">
          <Menu.Item>
            <Dropdown tabIndex={-1} text="Цвет" pointing onDoubleClick={this.onColorDoubleClick}>
              <Dropdown.Menu>
                { Object.keys(this.props.opt.themes).map(name => (
                  <Dropdown.Item
                    key={name}
                    label={{ color: this.props.opt.themes[name].mainColor, empty: true, circular: true, size: "huge" }}
                    active={theme === theme.name}
                    onClick={() => this.props.changeTheme(name)}
                  />
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </Menu.Item>
          <Menu.Item onClick={() => this.setState({ showAbout: true })}>
            Версия
          </Menu.Item>
          <Menu.Item onClick={() => this.props.signOut()}>
            Выйти
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    )
  }

  render() {
    return (
      <Fragment>
        <Segment inverted basic color={this.props.opt.theme.mainColor} style={{ paddingTop: 0, paddingBottom: 5 }}>
          {this.menu()}
        </Segment>
        { this.state.showAbout && this.about() }
      </Fragment>
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

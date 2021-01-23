import { AppActions }      from "Store/base/app"
import { SettingsActions } from "Store/base/settings"
import AboutDialog         from "./about"

import React, { Fragment } from "react"
import { connect }         from "react-redux"
import {
  Button, Menu, Segment, Label, Icon,
  Dropdown, Modal, Grid, Divider,
}                          from "semantic-ui-react"
import { withTranslation } from "react-i18next"

const sales = [
  "saleCheckEditor",
  "saleJournal",
]

const products = [
  "productEditor",
  "productImporter",
  "consignmentEditor",
  "consignmentJournal",
  "baseCategoryEditor",
  "baseUnitEditor",
  "inventory",
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
    this.onSettingsClick = this.onSettingsClick.bind(this)
    this.onAuthSettingsClick = this.onAuthSettingsClick.bind(this)
    this.state = {
      showAbout: false,
    }
    this.t = this.props.t
  }

  onSettingsClick(ev) {
    if (ev.shiftKey && ev.ctrlKey && this.props.app.user === "admin") {
      this.props.openAdminService()
    } else {
      this.props.openSettingsEditor()
    }
  }

  onAuthSettingsClick(ev) {
    if (this.props.app.user === "admin") {
      this.props.openAuthSettings()
    }
  }

  about() {
    const theme = this.props.opt.theme
    return (
      <AboutDialog onClose={() => this.setState({ showAbout: false })} theme={theme} api={this.props.api} />
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
        <Fragment>
          { (user === "cashier" || user === "manager" || user === "admin") &&
          <Dropdown tabIndex={-1} text={this.t("sales")} pointing className={"link item " + salesActive}>
            <Dropdown.Menu>
              <Dropdown.Item
                icon="calculator"
                active={this.props.app.activePage === "saleCheckEditor"}
                onClick={() => this.props.openSaleCheckEditor()}
                text={this.t("cashier")}
              />
              <Dropdown.Item
                icon="list layout"
                active={this.props.app.activePage === "saleJournal"}
                onClick={() => this.props.openSaleJournal()}
                text={this.t("salesList")}
              />
            </Dropdown.Menu>
          </Dropdown>
          }

          { (user === "manager" || user === "admin") &&
          <Dropdown tabIndex={-1} text={this.t("products")} pointing className={"link item " + productsActive}>
            <Dropdown.Menu>
              <Dropdown.Item
                icon="zip"
                active={this.props.app.activePage === "consignmentEditor"}
                onClick={() => this.props.openConsignmentEditor()}
                text={this.t("consignmentAcceptance")}
              />
              <Dropdown.Item
                icon="list layout"
                active={this.props.app.activePage === "consignmentJournal"}
                onClick={() => this.props.openConsignmentJournal()}
                text={this.t("consignmentList")}
              />
              <Dropdown.Item
                icon="book"
                active={this.props.app.activePage === "productEditor"}
                onClick={() => this.props.openProductEditor()}
                text={this.t("productsDescription")}
              />
              <Dropdown.Item
                icon="clipboard check"
                active={this.props.app.activePage === "inventory"}
                onClick={() => this.props.openInventory()}
                text={this.t("inventoryDescription")}
              />
              <Dropdown.Item
                icon="file excel"
                active={this.props.app.activePage === "productImporter"}
                onClick={() => this.props.openProductImporter()}
                text={this.t("productImporter")}
              />
              <Dropdown.Item
                icon="law"
                active={this.props.app.activePage === "baseUnitEditor"}
                onClick={() => this.props.openUnitEditor()}
                text={this.t("units")}
              />
            </Dropdown.Menu>
          </Dropdown>
          }
        </Fragment>
        { (user === "admin") &&
        <Dropdown tabIndex={-1} text={this.t("calculations")} pointing className={"link item " + calcsActive}>
          <Dropdown.Menu>
            <Dropdown.Item
              icon="dashboard"
              active={this.props.app.activePage === "baseDashboard"}
              onClick={() => this.props.openDashboard()}
              text={this.t("dashboard")}
            />
            <Dropdown.Item
              icon="refresh"
              active={this.props.app.activePage === "baseTurnover"}
              onClick={() => this.props.openTurnover()}
              text={this.t("turnover")}
            />
            <Dropdown.Item
              icon="chart line"
              active={this.props.app.activePage === "basePriceEditor"}
              onClick={() => this.props.openPriceEditor()}
              text={this.t("prices")}
            />
            <Dropdown.Item
              icon="dollar sign"
              active={this.props.app.activePage === "baseCurrencyEditor"}
              onClick={() => this.props.openCurrencyEditor()}
              text={this.t("currencyRates")}
            />
            <Dropdown.Item
              icon="users"
              active={this.props.app.activePage === "baseClientEditor"}
              onClick={() => this.props.openClientEditor()}
              text={this.t("clients")}
            />
            <Dropdown.Item
              icon="truck"
              active={this.props.app.activePage === "baseSupplierEditor"}
              onClick={() => this.props.openSupplierEditor()}
              text={this.t("suppliers")}
            />
          </Dropdown.Menu>
        </Dropdown>
        }
        <Menu.Menu position="right">
          <Menu.Item>
            <Icon name="paint brush" />
            <Dropdown>
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
          <Menu.Item>
            <Icon name="language" />
            <Dropdown>
              <Dropdown.Menu>
                <Dropdown.Item
                  onClick={() => this.props.changeLanguage("ru")}
                  text="Русский"
                />
                <Dropdown.Item
                  onClick={() => this.props.changeLanguage("en")}
                  text="English"
                />
                <Dropdown.Item
                  onClick={() => this.props.changeLanguage("ky")}
                  text="Кыргызча"
                />
                <Dropdown.Item
                  onClick={() => this.props.changeLanguage("tr")}
                  text="Türkçe"
                />
              </Dropdown.Menu>
            </Dropdown>
          </Menu.Item>
          <Menu.Item>
            <Icon name="options" />
            <Dropdown tabIndex={-1} text={this.t("settings")} pointing onDoubleClick={this.onColorDoubleClick}>
              <Dropdown.Menu>
                { (this.props.app.user === "admin") &&
                  <Fragment>
                    <Dropdown.Item onClick={this.onSettingsClick}>
                      <Icon name="options" />
                      {this.t("changeSettings")}
                    </Dropdown.Item>
                    <Dropdown.Item onClick={this.onAuthSettingsClick}>
                      <Icon name="cloud" />
                      {this.t("changeAuthSettings")}
                    </Dropdown.Item>
                  </Fragment>
                }
                <Dropdown.Item onClick={() => this.setState({ showAbout: true })}>
                  <Icon name="code branch" />
                  {this.t("codeBranch")}
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Menu.Item>
          <Menu.Item onClick={() => this.props.signOut()}>
            <Icon name="sign out" />
            {this.t("signOut")}
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
})(withTranslation("menu")(MainMenu))

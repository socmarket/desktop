import { AppActions }      from "Store/base/app"

import React, { Fragment } from "react";
import { connect }         from "react-redux";
import {
  Button, Menu, Segment, Label, Icon,
  Dropdown,
}                          from "semantic-ui-react"

class MainMenu extends React.Component {

  menu() {
    const activePage = this.props.app.activePage
    const salesActive = (activePage === "autoPartsSaleCheckEditor" || activePage === "autoPartsSaleJournal") ? "active" : ""
    return (
      <Menu attached="top" pointing secondary inverted borderless color="blue" style={{ fontSize: 16 }}>
        <Menu.Item style={{ paddingLeft: 0, paddingTop: 0, paddingRight: 0, paddingBottom: 7, marginLeft: 5, marginRight: 15 }}>
          <Label color="blue"  size="big" style={{ padding: 5, margin: 0 }}>SOC</Label>
          <Label color="green" size="big" style={{ padding: 5, margin: 0 }}>Market</Label>
          <Label color="blue"  size="big" style={{ padding: 5, margin: 0 }}>2C</Label>
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
                  text="Журнал"
                />
              </Dropdown.Menu>
            </Dropdown>

            <Menu.Item
              active={this.props.app.activePage === "autoPartsProductEditor"}
              onClick={() => this.props.openAutoPartsProductEditor()}
            >
              Товары
            </Menu.Item>
          </Fragment>
        }
        <Menu.Menu position="right">
          <Menu.Item
            color="blue"
          >
            Выйти
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    )
  }

  render() {
    return (
      <Segment inverted basic color="blue" style={{ paddingTop: 0, paddingBottom: 5 }}>
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
})(MainMenu);

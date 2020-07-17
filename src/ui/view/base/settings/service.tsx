import { SettingsActions } from "Store/base/settings"

import CurrencyPicker from "View/base/currency/picker"
import UnitPicker     from "View/base/unit/picker"
import ClientPicker   from "View/base/client/picker"
import SupplierPicker from "View/base/supplier/picker"

import {
  numberInputWithRef,
  ifNumberF,
  asDate,
}                             from "Util"

import React, { Fragment } from "react"
import { connect } from "react-redux"
import { Translation } from "react-i18next"
import {
  Header, Grid, Table, Form, Input, Select,
  TextArea, Button, Segment, Image, Icon,
  Label, Container, Menu, Message, Divider,
  Rail, Dropdown, Radio
} from "semantic-ui-react"

const S = {
  appMode: [
    { key: "auto/parts"      , value: "auto/parts"      , text: "Авто/Запчасти"   },
    { key: "auto/accessories", value: "auto/accessories", text: "Авто/Аксессуары" },
    { key: "miniMarket"      , value: "miniMarket"      , text: "Мини маркет"     },
  ],
  labelSize: [
    { key: "30x20", value: "30x20", text: "30mm x 20mm" },
    { key: "60x30", value: "60x30", text: "60mm x 30mm" },
    { key: "60x40", value: "60x40", text: "60mm x 40mm" },
  ],
}

class SettingsEditor extends React.Component {

  constructor(props) {
    super(props)

    this.onAppModeChange           = this.onAppModeChange.bind(this)
    this.onBarcodePrefixChange     = this.onBarcodePrefixChange.bind(this)
    this.onDefaultCurrencyChange   = this.onDefaultCurrencyChange.bind(this)
    this.onSqlEditorKeyPress       = this.onSqlEditorKeyPress.bind(this)

    this.printerApi = props.api.printer
    this.settingsApi = props.api.settings
    this.state = {
      items: [],
    }
  }

  componentDidMount() {
  }

  onAppModeChange(ev, { value }) {
    this.settingsApi
      .changeAppMode(value)
      .then(_ => this.props.reloadSettings())
  }

  onBarcodePrefixChange(ev) {
    this.settingsApi
      .changeBarcodePrefix(ev.target.value)
      .then(_ => this.props.reloadSettings())
  }

  onDefaultCurrencyChange(currency) {
    this.settingsApi
      .changeDefaultCurrency(currency.id)
      .then(_ => this.props.reloadSettings())
  }

  onSqlEditorKeyPress(ev) {
    if (ev.ctrlKey && ev.key === "Enter") {
      return this.settingsApi
        .execSql(ev.target.value)
        .then(rows => this.setState({
          items: rows,
        }))
    }
  }

  table() {
    return (
      <Segment raised color={this.props.theme.mainColor} onKeyDown={this.onKeyDown} tabIndex={-1}>
        <Header as="h2" dividing color={this.props.theme.mainColor} textAlign="center">
          <Icon name="settings" />
          Настройки
        </Header>
        <Form width={16}>
          <Form.Group>
            <Form.Select
              label="Специализация"
              width={16}
              value={this.props.opt.appMode}
              options={S.appMode}
              onChange={this.onAppModeChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Input
              label="Префикс штрихкода"
              width={16}
              value={this.props.opt.barcodePrefix}
              onChange={this.onBarcodePrefixChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Field width={16}>
              <label>Валюта по умолчанию</label>
              <CurrencyPicker
                api={this.props.api}
                value={this.props.opt.defaultCurrencyId}
                onPick={this.onDefaultCurrencyChange}
              />
            </Form.Field>
          </Form.Group>
        </Form>
      </Segment>
    )
  }

  sqlEditor() {
    return (
      <Segment>
        <Header as="h2" dividing color={this.props.theme.mainColor} textAlign="center">
          <Icon name="database" />
          SQL Editor
        </Header>
        <TextArea style={{width: "100%", height: "200px" }} onKeyPress={this.onSqlEditorKeyPress} />
      </Segment>
    )
  }

  render() {
    return (
      <Fragment>
        <Grid padded tabIndex={-1} className="light-focus">
          <Grid.Row>
            <Grid.Column width={4}>
              {this.table()}
            </Grid.Column>
            <Grid.Column width={12}>
              {this.sqlEditor()}
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={16}>
              { this.state.items.length > 0 && 
                <Table compact celled>
                  <Table.Header>
                    <Table.Row>
                      { Object.keys(this.state.items[0]).map((k, cidx) => (
                        <Table.HeaderCell key={cidx}>{k}</Table.HeaderCell>
                      ))}
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    { this.state.items.slice(0, 50).map((item, ridx) => (
                      <Table.Row key={ridx}>
                        { Object.keys(this.state.items[0]).map((k, cidx) => (
                          <Table.Cell key={cidx}>{this.state.items[ridx][k]}</Table.Cell>
                        ))}
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              }
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Fragment>
    )
  }
}

const stateMap = (state) => {
  return {
  }
}

export default connect(stateMap, { ...SettingsActions })(SettingsEditor)

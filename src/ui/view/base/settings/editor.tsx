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
    this.onDefaultClientChange     = this.onDefaultClientChange.bind(this)
    this.onDefaultSupplierChange   = this.onDefaultSupplierChange.bind(this)
    this.onDefaultUnitChange       = this.onDefaultUnitChange.bind(this)
    this.onDefaultCurrencyChange   = this.onDefaultCurrencyChange.bind(this)
    this.onLabelSizeChange         = this.onLabelSizeChange.bind(this)
    this.onDefaultSaleMarginChange = this.onDefaultSaleMarginChange.bind(this)
    this.onBarcodePrefixChange     = this.onBarcodePrefixChange.bind(this)

    this.onShowConsignmentHistoryInSaleCheckChanged = this.onShowConsignmentHistoryInSaleCheckChanged.bind(this)

    this.settingsApi = props.api.settings
    this.state = {
    }
  }

  onAppModeChange(ev, { value }) {
    this.settingsApi
      .changeAppMode(value)
      .then(_ => this.props.reloadSettings())
  }

  onLabelSizeChange(ev, { value }) {
    this.settingsApi
      .changeProductLabelSize(value)
      .then(_ => this.props.reloadSettings())
  }

  onDefaultClientChange(client) {
    this.settingsApi
      .changeDefaultClient(client.id)
      .then(_ => this.props.reloadSettings())
  }

  onDefaultSupplierChange(supplier) {
    this.settingsApi
      .changeDefaultSupplier(supplier.id)
      .then(_ => this.props.reloadSettings())
  }

  onDefaultUnitChange(unit) {
    this.settingsApi
      .changeDefaultUnit(unit.id)
      .then(_ => this.props.reloadSettings())
  }

  onDefaultCurrencyChange(currency) {
    this.settingsApi
      .changeDefaultCurrency(currency.id)
      .then(_ => this.props.reloadSettings())
  }

  onBarcodePrefixChange(ev) {
    this.settingsApi
      .changeBarcodePrefix(ev.target.value)
      .then(_ => this.props.reloadSettings())
  }

  onDefaultSaleMarginChange(ev) {
    this.settingsApi
      .changeDefaultSaleMargin(+ev.target.value)
      .then(_ => this.props.reloadSettings())
  }

  onShowConsignmentHistoryInSaleCheckChanged(ev, { checked }){
    this.settingsApi
      .changeShowConsignmentHistoryInSaleCheck(+checked)
      .then(_ => this.props.reloadSettings())
  }

  table() {
    console.log(this.props.opt)
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
              width={8}
              value={this.props.opt.appMode}
              options={S.appMode}
              onChange={this.onAppModeChange}
            />
            <Form.Input
              label="Наценка по умолчанию %"
              width={8}
              value={this.props.opt.defaultSaleMargin}
              onChange={this.onDefaultSaleMarginChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Field width={8}>
              <label>Клиент по умолчанию</label>
              <ClientPicker
                api={this.props.api}
                value={this.props.opt.defaultClientId}
                onPick={this.onDefaultClientChange}
              />
            </Form.Field>
            <Form.Field width={8}>
              <label>Поставщик по умолчанию</label>
              <SupplierPicker
                api={this.props.api}
                value={this.props.opt.defaultSupplierId}
                onPick={this.onDefaultSupplierChange}
              />
            </Form.Field>
          </Form.Group>
          <Form.Group>
            <Form.Field width={8}>
              <label>Ед по умолчанию</label>
              <UnitPicker
                api={this.props.api}
                value={this.props.opt.defaultUnitId}
                onPick={this.onDefaultUnitChange}
              />
            </Form.Field>
            <Form.Field width={8}>
              <label>Валюта по умолчанию</label>
              <CurrencyPicker
                api={this.props.api}
                value={this.props.opt.defaultCurrencyId}
                onPick={this.onDefaultCurrencyChange}
              />
            </Form.Field>
          </Form.Group>
          <Form.Group>
            <Form.Input
              label="Префикс штрихкода"
              width={8}
              value={this.props.opt.barcodePrefix}
              onChange={this.onBarcodePrefixChange}
            />
            <Form.Select
              label="Размер ленты этикеток"
              width={8}
              value={this.props.opt.productLabelSize}
              options={S.labelSize}
              onChange={this.onLabelSizeChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Field width={16}>
              <Radio
                label="Показывать закупочные цены в кассе"
                toggle
                value={this.props.opt.showConsignmentHistoryInSaleCheck}
                onChange={this.onShowConsignmentHistoryInSaleCheckChanged}
              />
            </Form.Field>
          </Form.Group>
        </Form>
      </Segment>
    )
  }

  render() {
    return (
      <Fragment>
        <Grid padded tabIndex={-1} className="light-focus">
          <Grid.Row>
            <Grid.Column width={8}>
              {this.table()}
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

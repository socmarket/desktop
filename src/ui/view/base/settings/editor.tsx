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
import { withTranslation } from 'react-i18next';

class SettingsEditor extends React.Component {

  constructor(props) {
    super(props)

    this.onAppModeChange           = this.onAppModeChange.bind(this)
    this.onDefaultClientChange     = this.onDefaultClientChange.bind(this)
    this.onDefaultSupplierChange   = this.onDefaultSupplierChange.bind(this)
    this.onDefaultUnitChange       = this.onDefaultUnitChange.bind(this)
    this.onLabelSizeChange         = this.onLabelSizeChange.bind(this)
    this.onLabelOffsetXChange      = this.onLabelOffsetXChange.bind(this)
    this.onLogoLine1Change         = this.onLogoLine1Change.bind(this)
    this.onLogoLine2Change         = this.onLogoLine2Change.bind(this)
    this.onLogoLine3Change         = this.onLogoLine3Change.bind(this)
    this.onDefaultSaleMarginChange = this.onDefaultSaleMarginChange.bind(this)

    this.onShowConsignmentHistoryInSaleCheckChanged = this.onShowConsignmentHistoryInSaleCheckChanged.bind(this)

    this.printerApi = props.api.printer
    this.settingsApi = props.api.settings
    this.state = {
      printers: []
    }
    this.t = this.props.t
    this.S = {
      appMode: [
        { key: "auto/parts"      , value: "auto/parts"      , text: this.t("autoParts")       },
        { key: "auto/accessories", value: "auto/accessories", text: this.t("autoAccessories") },
        { key: "miniMarket"      , value: "miniMarket"      , text: this.t("miniMarket")      },
      ],
      labelSize: [
        { key: "30x20", value: "30x20", text: "30mm x 20mm" },
        { key: "60x30", value: "60x30", text: "60mm x 30mm" },
        { key: "60x40", value: "60x40", text: "60mm x 40mm" },
      ],
    }
  }

  componentDidMount() {
    this.printerApi.rescanPrinters()
      .then(items => this.setState({
        printers: items,
      }))
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

  onLabelOffsetXChange(ev) {
    this.settingsApi
      .changeProductLabelOffsetX(ev.target.value)
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

  onChoosePrinter(printer) {
    this.settingsApi
      .choosePrinter(printer.id)
      .then(_ => this.props.reloadSettings())
  }

  onLogoLine1Change(ev) { this.settingsApi.changeLogoLine(1, ev.target.value).then(_ => this.props.reloadSettings()) }
  onLogoLine2Change(ev) { this.settingsApi.changeLogoLine(2, ev.target.value).then(_ => this.props.reloadSettings()) }
  onLogoLine3Change(ev) { this.settingsApi.changeLogoLine(3, ev.target.value).then(_ => this.props.reloadSettings()) }

  printers() {
    return (
      <Segment raised color={this.props.theme.mainColor}>
        <Header as="h2" dividing color={this.props.theme.mainColor} textAlign="center">
          <Icon name="print" />
          {this.t("printers")}
        </Header>
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>{this.t("model")}</Table.HeaderCell>
              <Table.HeaderCell>{this.t("manufacturer")}</Table.HeaderCell>
              <Table.HeaderCell>{this.t("id")}</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {this.state.printers.map(printer => (
              <Table.Row key={printer.id} onClick={() => this.onChoosePrinter(printer)} positive={printer.id === this.props.opt.labelPrinterId}>
                <Table.Cell>{printer.iProduct}</Table.Cell>
                <Table.Cell>{printer.iManufacturer}</Table.Cell>
                <Table.Cell>{printer.id}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Segment>
    )
  }

  table() {
    return (
      <Segment raised color={this.props.theme.mainColor} onKeyDown={this.onKeyDown} tabIndex={-1}>
        <Header as="h2" dividing color={this.props.theme.mainColor} textAlign="center">
          <Icon name="settings" />
          {this.t("settings")}
        </Header>
        <Form width={16}>
          <Form.Group>
            <Form.Field width={8}>
              <label>{this.t("defaultClient")}</label>
              <ClientPicker
                api={this.props.api}
                value={this.props.opt.defaultClientId}
                onPick={this.onDefaultClientChange}
              />
            </Form.Field>
            <Form.Field width={8}>
              <label>{this.t("defaultSupplier")}</label>
              <SupplierPicker
                api={this.props.api}
                value={this.props.opt.defaultSupplierId}
                onPick={this.onDefaultSupplierChange}
              />
            </Form.Field>
          </Form.Group>
          <Form.Group>
            <Form.Field width={8}>
              <label>{this.t("defaultUnit")}</label>
              <UnitPicker
                api={this.props.api}
                value={this.props.opt.defaultUnitId}
                onPick={this.onDefaultUnitChange}
              />
            </Form.Field>
            <Form.Input
              label={this.t("defaultMarkup")}
              width={8}
              value={this.props.opt.defaultSaleMargin}
              onChange={this.onDefaultSaleMarginChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Select
              label={this.t("labelTapeSize")}
              width={8}
              value={this.props.opt.productLabelSize}
              options={this.S.labelSize}
              onChange={this.onLabelSizeChange}
            />
            <Form.Input
              label={this.t("leftIndent")}
              width={8}
              value={this.props.opt.productLabelOffsetX}
              onChange={this.onLabelOffsetXChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Input
              label={this.t("checkTitle1")}
              width={8}
              value={this.props.opt.logoLine1}
              onChange={this.onLogoLine1Change}
            />
          </Form.Group>
          <Form.Group>
            <Form.Input
              label={this.t("checkTitle2")}
              width={8}
              value={this.props.opt.logoLine2}
              onChange={this.onLogoLine2Change}
            />
          </Form.Group>
          <Form.Group>
            <Form.Input
              label={this.t("checkTitle3")}
              width={8}
              value={this.props.opt.logoLine3}
              onChange={this.onLogoLine3Change}
            />
          </Form.Group>
          <Form.Group>
            <Form.Field width={16}>
              <Radio
                label={this.t("showPurchasePrices")}
                toggle
                checked={this.props.opt.showConsignmentHistoryInSaleCheck}
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
            <Grid.Column width={6}>
              {this.printers()}
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

export default connect(stateMap,
  { ...SettingsActions })(withTranslation("base_settings_editor.form")(SettingsEditor))

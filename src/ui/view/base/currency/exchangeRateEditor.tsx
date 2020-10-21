import SupplierBalanceItemEditor from "./balanceItemEditor.tsx"

import {
  numberInputWithRef,
  ifNumberF,
}                         from "Util"
import CurrencyPicker     from "View/base/currency/picker"

import React, { Fragment } from "react"
import moment from "moment"
import {
  Table, Header, Segment, Icon,
  Container, Input, Button, Form,
} from "semantic-ui-react"
import { withTranslation } from 'react-i18next';

class ExchangeRateEditor extends React.Component {

  constructor(props) {
    super(props)

    this.onRateChange         = this.onRateChange.bind(this)
    this.onFromCurrencyChange = this.onFromCurrencyChange.bind(this)
    this.onToCurrencyChange   = this.onToCurrencyChange.bind(this)
    this.onAddRate            = this.onAddRate.bind(this)

    this.rateInputRef          = React.createRef()
    this.fromCurrencyPickerRef = React.createRef()
    this.toCurrencyPickerRef   = React.createRef()
    this.rateInput             = numberInputWithRef(this.rateInputRef)

    this.currencyApi = props.api.currency
    this.state = {
      rates: [],
      rate: 0,
      fromCurrencyId: props.opt.defaultCurrencyId,
      toCurrencyId  : props.opt.defaultCurrencyId,
    }
    this.t = this.props.t
  }

  componentDidMount() {
    this.reloadRates()
  }

  rateIsValid() {
    return Number(this.state.rate) > 0 &&
      this.state.fromCurrencyId > 0 &&
      this.state.toCurrencyId > 0 &&
      this.state.fromCurrencyId !== this.state.toCurrencyId
  }

  reloadRates() {
    this.currencyApi
      .selectExchangeRates()
      .then(rates => this.setState({
        rates: rates,
      }))
  }

  onRateChange(ev) {
    ifNumberF(ev, (value) => this.setState({ rate: value }))
  }

  onFromCurrencyChange(currency) {
    this.setState({
      fromCurrencyId : currency.id,
    })
  }

  onToCurrencyChange(currency) {
    this.setState({
      toCurrencyId : currency.id,
    })
  }

  onAddRate() {
    if (this.rateIsValid()) {
      this.currencyApi
        .updateRate(this.state)
        .then(_ => this.reloadRates())
    }
  }

  form() {
    return (
      <Form width={16}>
        <Form.Group>
          <Form.Input
            width={4}
            value={this.state.rate}
            control={this.rateInput}
            onChange={this.onRateChange}
          />
          <Form.Field width={6}>
            <CurrencyPicker
              api={this.props.api}
              forwardRef={this.fromCurrencyPickerRef}
              value={this.state.fromCurrencyId}
              onPick={this.onFromCurrencyChange}
            />
          </Form.Field>
          <Form.Field width={6}>
            <CurrencyPicker
              api={this.props.api}
              forwardRef={this.toCurrencyPickerRef}
              value={this.state.toCurrencyId}
              onPick={this.onToCurrencyChange}
            />
          </Form.Field>
          <Button type="button" icon="plus" disabled={!this.rateIsValid()} onClick={this.onAddRate} />
        </Form.Group>
      </Form>
    )
  }

  table() {
    return (
      <Table>
        <Table.Body>
          { this.state.rates.map((rate, idx) => (
            <Table.Row key={idx}>
              <Table.Cell>{rate.fromCurrencyNotation}</Table.Cell>
              <Table.Cell>{rate.toCurrencyNotation}</Table.Cell>
              <Table.Cell>{rate.rate}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    )
  }

  render() {
    return (
      <Segment raised color={this.props.theme.mainColor} onKeyDown={this.onKeyDown} tabIndex={-1}>
        <Header as="h2" dividing color={this.props.theme.mainColor} textAlign="center">
          <Icon name="exchange" />
          {this.t("exchangeRates")}
        </Header>
        {this.form()}
        {this.table()}
      </Segment>
    )
  }
}

export default withTranslation("currency_exchangeRateEditor.form", { withRef: true })(React.forwardRef((props, ref) => <ExchangeRateEditor innerRef={ref} {...props} />))

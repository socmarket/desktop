import CurrencyInfoEditor         from "./infoEditor"
import {
  inputWithRef
}                    from "Util"

import React, { Fragment } from "react"
import moment from "moment"
import { Translation } from 'react-i18next'
import {
  Header, Grid, Table, Form, Input, Select,
  TextArea, Button, Segment, Image, Icon,
  Label, Container, Menu, Message, Divider,
  Rail, Dropdown
} from "semantic-ui-react"
import { withTranslation } from 'react-i18next';

class CurrencyListEditor extends React.Component {

  emptyCurrency = {
    id       : -1,
    title     : "",
    notation : "",
  }

  constructor(props) {
    super(props)

    this.onCreate        = this.onCreate.bind(this)
    this.onUpdate        = this.onUpdate.bind(this)
    this.onKeyDown       = this.onKeyDown.bind(this)
    this.onGlobalKeyDown = this.onGlobalKeyDown.bind(this)
    this.onPatternChange = this.onPatternChange.bind(this)

    this.closeInfoEditor = this.closeInfoEditor.bind(this)

    this.tableRef        = React.createRef()
    this.patternInputRef = React.createRef()
    this.patternInput    = inputWithRef(this.patternInputRef)

    this.currencyApi = props.api.currency
    this.state = {
      currency            : this.emptyCurrency,
      items             : [],
      exhangeRates           : [],
      pattern           : "",
      infoEditorVisible : false,
      idx               : -1,
    }
    this.t = this.props.t
  }

  reloadCurrencyList() {
    const idx = this.state.idx
    return this.currencyApi
      .find(this.state.pattern)
      .then(items => this.setState({
        items: items,
        idx  : idx >= items.length ? items.length - 1: idx
      }))
  }

  componentDidMount() {
    this.reloadCurrencyList()
  }

  openCurrency(currency, idx) {
    this.setState({
      currency            : currency,
      infoEditorVisible : true,
    })
  }

  closeInfoEditor() {
    this.setState({
      infoEditorVisible : false,
    }, () => {
      this.patternInputRef.current.focus()
    })
  }

  openExhangeRatesFor(currency, idx) {
    this.setState({
      idx    : idx,
      currency : currency,
    })
  }

  onCreate() {
    this.closeInfoEditor()
    this.reloadCurrencyList()
  }

  onUpdate() {
    this.closeInfoEditor()
    this.reloadCurrencyList()
  }

  onKeyDown(ev) {
    const count = this.state.items.length
    switch (ev.key) {
      case "ArrowUp": {
        const cidx = this.state.idx <= 0 ? count : this.state.idx
        const currency = this.state.items[cidx - 1]
        this.setState({
          idx: cidx - 1,
          currency: currency ? currency : this.emptyCurrency,
        })
        break
      }
      case "ArrowDown": {
        const cidx = this.state.idx === (count - 1) ? -1 : this.state.idx
        const currency = this.state.items[cidx + 1]
        this.setState({
          idx: cidx + 1,
          currency: currency ? currency : this.emptyCurrency,
        })
        break
      }
      case "Enter": {
        if (ev.shiftKey) {
          this.onActivate()
        } else {
          const currency = this.state.items[this.state.idx]
          this.openCurrency(currency ? currency : emptyCurrency, this.state.idx)
        }
        break
      }
    }
  }

  onGlobalKeyDown(ev) {
    switch (ev.key) {
      case "Escape": {
        this.patternInputRef.current.focus()
      }
    }
  }

  onPatternChange(ev) {
    this.setState({
      pattern: ev.target.value,
    }, () => this.reloadCurrencyList())
  }

  infoEditor() {
    return (
      <CurrencyInfoEditor
        open
        api={this.props.api}
        theme={this.props.theme}
        currency={this.state.currency}
        onCreate={this.onCreate}
        onUpdate={this.onUpdate}
        onClose={this.closeInfoEditor}
      />
    )
  }

  list() {
    return (
      <Segment raised color={this.props.theme.mainColor} onKeyDown={this.onKeyDown} tabIndex={-1}>
        <Header as="h2" dividing color={this.props.theme.mainColor} textAlign="center">
          <Icon name="dollar" />
          {this.t("currencyList")}
        </Header>
        <Form width={16}>
          <Form.Group>
            <Form.Input
              floated="left"
              icon="search"
              placeholder={this.t("currencySearch")}
              value={this.state.pattern}
              control={this.patternInput}
              onChange={this.onPatternChange}
            />
            <Button floated="right" icon="plus" onClick={() => this.openCurrency(this.emptyCurrency, -1)} />
          </Form.Group>
        </Form>
        <Menu vertical fluid>
          {this.state.items.map((currency, idx) => (
            <Menu.Item
              key={currency.id}
              active={this.state.currency.id === currency.id}
              color={this.props.theme.mainColor}
              onClick={() => this.openExhangeRatesFor(currency, idx)}
              onDoubleClick={() => this.openCurrency(currency, idx)}
            >
              {currency.title}
              <Label size="large" color={currency.balance < 0 ? "red" : "green"}>
                {currency.balance}
              </Label>
            </Menu.Item>
          ))}
        </Menu>
      </Segment>
    )
  }

  render() {
    return (
      <Fragment>
        {this.list()}
        {this.state.infoEditorVisible && this.infoEditor()}
      </Fragment>
    )
  }
}

export default (withTranslation("currency_listEditor.form")(CurrencyListEditor))

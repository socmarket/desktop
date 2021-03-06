import ClientBalanceItemEditor from "./balanceItemEditor.tsx"

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

class ClientJournal extends React.Component {

  constructor(props) {
    super(props)

    this.onKeyDown        = this.onKeyDown.bind(this)
    this.onMoneyIn        = this.onMoneyIn.bind(this)
    this.onMoneyOut       = this.onMoneyOut.bind(this)
    this.onAmountChange   = this.onAmountChange.bind(this)
    this.onCurrencyChange = this.onCurrencyChange.bind(this)

    this.amountInputRef    = React.createRef()
    this.currencyPickerRef = React.createRef()
    this.amountInput       = numberInputWithRef(this.amountInputRef)

    this.clientApi = props.api.client

    this.state = {
      idx        : -1,
      amount     : 0,
      currencyId : props.opt.defaultCurrencyId,
      journal    : [],
    }
    this.t = this.props.t
  }

  componentDidMount() {
    this.reloadJournal()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.client.id !== this.props.client.id) {
      this.reloadJournal()
    }
  }

  reloadJournal() {
    this.clientApi.selectJournalById(this.props.client.id)
      .then(journal => this.setState({
        journal: journal,
        amount: 0,
      }))
  }

  onAmountChange(ev) {
    ifNumberF(ev, (value) => this.setState({ amount: value }))
  }

  onCurrencyChange(currency) {
    this.setState({
      currencyId   : currency.id,
      currencyTitle: currency.title,
    })
  }

  onMoneyIn() {
    if (this.state.amount <= 0) {
      this.amountInputRef.current.focus()
    } else if (this.state.currencyId < 0) {
      this.currencyPickerRef.current.focus()
    } else {
      this.clientApi.moneyIn({
        id         : this.props.client.id,
        amount     : this.state.amount,
        currencyId : this.state.currencyId,
      })
        .then(_ => this.props.onUpdate())
        .then(_ => this.reloadJournal())
    }
  }

  onMoneyOut() {
    if (this.state.amount <= 0) {
      this.amountInputRef.current.focus()
    } else if (this.state.currencyId < 0) {
      this.currencyPickerRef.current.focus()
    } else {
      this.clientApi.moneyOut({
        id         : this.props.client.id,
        amount     : this.state.amount,
        currencyId : this.state.currencyId,
      })
        .then(_ => this.props.onUpdate())
        .then(_ => this.reloadJournal())
    }
  }

  onKeyDown(ev) {
    const count = this.state.journal.length
    switch (ev.key) {
      default:
        break;
    }
  }

  onRowOpen(id, idx) {
    if (typeof this.props.onRowOpen === "function") {
      this.setState({
        idx: idx,
      }, () => {
        this.props.onRowOpen(id)
      })
    }
  }

  table() {
    const items = this.state.journal.map(item => ({
      id           : item.id,
      registeredAt : moment.utc(item.registeredAt).local().format("DD-MM-YYYY HH:mm"),
      amount       : item.amount,
      kind         : this.t(item.kind),
    }))
    return (
      <Segment raised color={this.props.theme.mainColor}
        onKeyDown={this.onKeyDown}
        tabIndex={-1}
      >
        <Header as="h2" dividing color={this.props.theme.mainColor} textAlign="center">
          <Icon name="exchange" />
          {this.t("settlementWith") + this.props.client.name}
        </Header>
        <Form width={16}>
          <Form.Group>
            <Form.Input
              width={4}
              value={this.state.amount}
              control={this.amountInput}
              onChange={this.onAmountChange}
            />
            <Form.Field width={8}>
              <CurrencyPicker
                api={this.props.api}
                forwardRef={this.currencyPickerRef}
                value={this.state.currencyId}
                onPick={this.onCurrencyChange}
              />
            </Form.Field>
            <Button type="button" icon="plus"  onClick={this.onMoneyIn } />
            <Button type="button" icon="minus" onClick={this.onMoneyOut} />
          </Form.Group>
        </Form>
        <div style={{ height: "70vh", overflowY: "auto" }}>
          <Table
            className="ui compact celled selectable table"
            tabIndex={1000}
          >
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell textAlign="center" >{this.t("number")}    </Table.HeaderCell>
                <Table.HeaderCell textAlign="center" >{this.t("dateTime")}  </Table.HeaderCell>
                <Table.HeaderCell textAlign="center" >{this.t("amount")}    </Table.HeaderCell>
                <Table.HeaderCell textAlign="center" >{this.t("whoToWhom")} </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              { items.map((item, ridx) => (
                <Table.Row key={ridx} active={ridx === this.state.idx} onClick={() => this.onRowOpen(item.id, ridx)}>
                  <Table.Cell textAlign="right">{ridx+1}</Table.Cell>
                  <Table.Cell textAlign="left" >{item.registeredAt}</Table.Cell>
                  <Table.Cell textAlign="right">{item.amount}</Table.Cell>
                  <Table.Cell textAlign="left" >{item.kind}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      </Segment>
    )
  }

  render() {
    return this.table()
  }
}

export default (withTranslation("clientJournal", { withRef: true })(React.forwardRef((props, ref) => <ClientJournal innerRef={ref} {...props} />)))

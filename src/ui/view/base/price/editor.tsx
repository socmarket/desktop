import DTable                 from "View/comp/dtable"
import AutoPartsProductPicker from "View/auto/parts/product/picker"
import CurrencyPicker         from "View/base/currency/picker"
import {
  numberInputWithRef,
  ifNumberF,
  asDate,
}                             from "Util"

import React, { Fragment } from "react"
import { connect } from "react-redux"
import { Translation } from "react-i18next"
import { ResponsiveLine } from "@nivo/line"
import {
  Header, Grid, Table, Form, Input, Select,
  TextArea, Button, Segment, Image, Icon,
  Label, Container, Menu, Message, Divider,
  Rail, Dropdown
} from "semantic-ui-react"
import { withTranslation } from 'react-i18next';

class PriceEditor extends React.Component {

  constructor(props) {
    super(props)

    this.onProductPick = this.onProductPick.bind(this)
    this.onPriceChange = this.onPriceChange.bind(this)
    this.onPriceSet    = this.onPriceSet.bind(this)
    this.onKeyDown     = this.onKeyDown.bind(this)

    this.productPickerRef  = React.createRef()
    this.currencyPickerRef = React.createRef()
    this.priceInputRef     = React.createRef()
    this.priceInput        = numberInputWithRef(this.priceInputRef)

    this.priceApi = props.api.price

    this.state = {
      productId  : -1,
      price      : 0,
      currencyId : props.opt.defaultCurrencyId,
      history    : [],
    }
    this.t = this.props.t
  }

  priceIsValid() {
    return this.state.price > 0 && this.state.productId > 0
  }

  reloadPrices(productId) {
    return this.priceApi
      .getPriceHistoryFor(productId)
      .then(history => this.setState({
        productId: productId,
        history: history,
      }))
  }

  onPriceChange(ev) {
    ifNumberF(ev, (value) => {
      if (value >= 0) {
        this.setState({ price: value })
      }
    })
  }

  onProductPick(product) {
    this.reloadPrices(product.id)
  }

  onPriceSet() {
    this.priceApi
      .setPrice({
        productId  : this.state.productId,
        price      : this.state.price,
        currencyId : this.state.currencyId,
      })
      .then(_ => this.reloadPrices(this.state.productId))
  }

  onKeyDown(ev) {
    switch (ev.key) {
      case "Escape": {
        this.productPickerRef.current.focus()
        break
      }
    }
  }

  table() {
    return (
      <Segment raised color={this.props.theme.mainColor} onKeyDown={this.onKeyDown} tabIndex={-1}>
        <Header as="h2" dividing color={this.props.theme.mainColor} textAlign="center">
          <Icon name="chart line" />
          {this.t("priceHistory")}
        </Header>
        <Form width={16}>
          <Form.Group>
            <Form.Input
              width={6}
              value={this.state.price}
              control={this.priceInput}
              onChange={this.onPriceChange}
            />
            <Form.Field width={10} disabled>
              <CurrencyPicker
                api={this.props.api}
                forwardRef={this.currencyPickerRef}
                value={this.state.currencyId}
                onPick={this.onFromCurrencyChange}
              />
            </Form.Field>
            <Button type="button" icon="plus" disabled={!this.priceIsValid()} onClick={this.onPriceSet} />
          </Form.Group>
        </Form>
        <Table>
          <Table.Body>
            { this.state.history.map((price, idx) => (
              <Table.Row key={idx}>
                <Table.Cell>{asDate(price.setAt)}</Table.Cell>
                <Table.Cell>{price.price}</Table.Cell>
                <Table.Cell>{price.currencyNotation}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Segment>
    )
  }

  graphContent() {
    const graph1 = this.state.history
      .slice()
      .reverse()
      .map(item => ({
        x: item.setAt,
        y: item.price
      }))
    const data = [
      { id: this.t("price"), data: graph1 }
    ]
    return (
      <ResponsiveLine
        data={data}
        colors={{ scheme: "nivo" }}
        margin={{ top: 10, right: 40, bottom: 50, left: 50 }}
        xScale={{ type: "point" }}
        yScale={{ type: "linear", min: "auto", max: "auto", stacked: true, reverse: false }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          orient: "bottom",
          legend: this.t("date"),
          legendPosition: "middle"
        }}
        axisLeft={{
          orient: "left",
          legendPosition: "middle"
        }}
        pointSize={10}
        pointLabel="y"
        useMesh={true}
      />
    )
  }

  graph() {
    return (
      <Segment raised color={this.props.theme.mainColor} onKeyDown={this.onKeyDown} tabIndex={-1}>
        <Header as="h2" dividing color={this.props.theme.mainColor} textAlign="center">
          <Icon name="chart area" />
          {this.t("chartArea")}
        </Header>
        <div style={{ height: 400 }}>
          {this.graphContent()}
        </div>
      </Segment>
    )
  }

  render() {
    return (
      <Fragment>
        <Grid padded tabIndex={-1} onKeyDown={this.onKeyDown} className="light-focus">
          <Grid.Row>
            <Grid.Column width={16}>
              <Segment>
                <AutoPartsProductPicker
                  floated="right"
                  api={this.props.api}
                  forwardRef={this.productPickerRef}
                  onPick={this.onProductPick}
                />
              </Segment>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={5}>
              {this.table()}
            </Grid.Column>
            <Grid.Column width={11}>
              {this.graph()}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Fragment>
    )
  }
}

export default (withTranslation("price_editor.form")(PriceEditor))

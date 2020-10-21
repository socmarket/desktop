import UnitPicker     from "View/base/unit/picker"
import {
  numberInputWithRef,
  ifNumberF,
  asDate,
}                     from "Util"

import React, { Fragment } from "react"
import { connect } from "react-redux"
import {
  Grid, Form, Input, Button,
  Segment, Message, Modal,
  Container, Header, Divider,
  Menu, Table,
} from "semantic-ui-react"
import { withTranslation } from "react-i18next"

class SaleCheckItem extends React.Component {

  constructor(props) {
    super(props)

    this.onPriceChange    = this.onPriceChange.bind(this)
    this.onQuantityChange = this.onQuantityChange.bind(this)
    this.onUnitChange     = this.onUnitChange.bind(this)
    this.onKeyDown        = this.onKeyDown.bind(this)
    this.onUpdate         = this.onUpdate.bind(this)

    this.priceInputRef    = React.createRef()
    this.quantityInputRef = React.createRef()
    this.priceInput       = numberInputWithRef(this.priceInputRef)
    this.quantityInput    = numberInputWithRef(this.quantityInputRef)

    this.priceApi       = props.api.price
    this.saleCheckApi   = props.api.saleCheck
    this.consignmentApi = props.api.consignment

    this.state = {
      ...props.item,
      errorMsg: "",
      history: [],
      activeTab: (props.opt.showConsignmentHistoryInSaleCheck ? "history" : "photos"),
    }
    this.t = this.props.t
  }

  componentDidMount() {
    this.priceInputRef.current.focus()
    this.priceInputRef.current.select()
    this.consignmentApi
      .productHistory(this.props.item.productId)
      .then(history => this.setState({
        history: history,
      }))
  }

  onPriceChange(ev) {
    ifNumberF(ev, (value) => this.setState({ price: value }))
  }

  onQuantityChange(ev) {
    ifNumberF(ev, (value) => this.setState({ quantity: value }))
  }

  onUnitChange(unit) {
    this.setState({
      unitId: unit.id,
      unitTitle: unit.title,
    })
  }

  onUpdate() {
    this.saleCheckApi
      .updateCurrentSaleCheckItem(this.state)
      .then(_ => {
        if (this.state.originalPrice < this.state.price) {
          return this.priceApi.setPrice(this.state)
        } else {
          return Promise.resolve()
        }
      })
      .then(_ => this.props.onUpdate(this.state))
  }

  onKeyDown(ev) {
    if (ev.key === "Enter" && ev.shiftKey) {
      ev.preventDefault()
      this.onUpdate()
    }
  }

  form() {
    return (
      <Form size="large" width={16} onKeyDown={this.onKeyDown}>
        <Message header={this.state.productBarcode} content={this.state.productTitle + ": " + this.state.productBrand} />
        <Form.Group>
          <Form.Input
            autoFocus
            width={6}
            label={this.t("price")}
            onChange={this.onPriceChange}
            value={this.state.price || 0}
            control={this.priceInput}
          />
          <Form.Input
            width={6}
            label={this.t("quantity")}
            onChange={this.onQuantityChange}
            value={this.state.quantity || 0}
            control={this.quantityInput}
          />
          <Form.Field width={4}>
            <label>{this.t("unit")}</label>
            <UnitPicker
              api={this.props.api}
              size="large"
              value={this.state.unitId}
              onPick={this.onUnitChange}
            />
          </Form.Field>
        </Form.Group>
        <Button fluid type="button" color={this.props.theme.mainColor} onClick={this.onUpdate}>{this.t("update")} (Shift + Enter)</Button>
      </Form>
    )
  }

  photos() {
    return (
      <Segment inverted color={this.props.theme.mainColor} style={{ height: "100%" }}>
        { this.state.errorMsg.length > 0 &&
          <Message error>
            {this.state.errorMsg}
          </Message>
        }
        <p>{this.t("productPhotos")}</p>
        <p>{this.t("remark")}</p>
      </Segment>
    )
  }

  history() {
    return (
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>{this.t("date")}    </Table.HeaderCell>
            <Table.HeaderCell>{this.t("supplier")}</Table.HeaderCell>
            <Table.HeaderCell>{this.t("quantity")}</Table.HeaderCell>
            <Table.HeaderCell>{this.t("price")}   </Table.HeaderCell>
            <Table.HeaderCell>{this.t("currency")}</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {this.state.history.map((item, idx) => (
            <Table.Row key={idx}>


              <Table.Cell                  >{asDate(item.acceptedAt)}</Table.Cell>
              <Table.Cell                  >{item.supplierName      }</Table.Cell>
              <Table.Cell textAlign="right">{item.quantity          }</Table.Cell>
              <Table.Cell textAlign="right">{item.price             }</Table.Cell>
              <Table.Cell                  >{item.currencyNotation  }</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    )
  }

  content() {
    return (
      <Grid>
        <Grid.Row>
          <Grid.Column width={8}>
            <Menu attached="top" inverted color={this.props.theme.mainColor}>
              { this.props.opt.showConsignmentHistoryInSaleCheck &&
                <Menu.Item name={this.t("history")} active={this.state.activeTab === "history"} onClick={() => this.setState({ activeTab: "history" })} />
              }
              <Menu.Item name={this.t("photos")} active={this.state.activeTab === "photos"}  onClick={() => this.setState({ activeTab: "photos" })}  />
            </Menu>
            <Segment attached="bottom" style={{ height: "92%" }}>
              { this.state.activeTab === "history" && this.history() }
              { this.state.activeTab === "photos"  && this.photos()  }
            </Segment>
          </Grid.Column>
          <Grid.Column width={8}>
            <Segment>
              {this.form()}
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }

  render() {
    return (
      <Modal
        open={this.props.open}
        centered={false}
        size="large"
        onClose={this.props.onClose}
      >
        <Modal.Header>
          {this.t("sale")}: {this.state.productTitle}
        </Modal.Header>
        <Modal.Content>
          {this.content()}
        </Modal.Content>
      </Modal>
    )
  }
}

export default (withTranslation("base_salecheck_itemEditor.form")(SaleCheckItem))

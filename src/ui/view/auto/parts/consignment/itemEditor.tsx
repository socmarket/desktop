import UnitPicker     from "View/base/unit/picker"
import CurrencyPicker from "View/base/currency/picker"
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
  Container, Header, Table,
  Menu
} from "semantic-ui-react"

class ConsignmentItem extends React.Component {

  constructor(props) {
    super(props)

    this.onPriceChange        = this.onPriceChange.bind(this)
    this.onSalePriceChange    = this.onSalePriceChange.bind(this)
    this.onQuantityChange     = this.onQuantityChange.bind(this)
    this.onUnitChange         = this.onUnitChange.bind(this)
    this.onCurrencyChange     = this.onCurrencyChange.bind(this)
    this.onSaleCurrencyChange = this.onSaleCurrencyChange.bind(this)
    this.onKeyDown            = this.onKeyDown.bind(this)
    this.onUpdate             = this.onUpdate.bind(this)

    this.priceInputRef     = React.createRef()
    this.salePriceInputRef = React.createRef()
    this.quantityInputRef  = React.createRef()
    this.priceInput        = numberInputWithRef(this.priceInputRef)
    this.salePriceInput    = numberInputWithRef(this.salePriceInputRef)
    this.quantityInput     = numberInputWithRef(this.quantityInputRef)

    this.priceApi       = props.api.price
    this.consignmentApi = props.api.consignment

    this.state = {
      ...props.item,
      errorMsg: "",
      history: [],
      activeTab: "history",
      salePrice: props.item.consignmentPrice * (props.opt.defaultSaleMargin / 100.0) + props.item.consignmentPrice,
      saleCurrencyId: props.item.currencyId,
    }
  }

  componentDidMount() {
    if (this.state.price > 0) {
      this.quantityInputRef.current.focus()
      this.quantityInputRef.current.select()
    } else {
      this.priceInputRef.current.focus()
      this.priceInputRef.current.select()
    }
    this.consignmentApi
      .productHistory(this.props.item.productId)
      .then(history => this.setState({
        history: history,
      }))
  }

  componentDidUpdate(prevProps) {
    if (prevProps.item.productId !== this.props.item.productId) { 
      this.consignmentApi
        .productHistory(this.state.productId)
        .then(history => this.setState({
          history: history,
        }))
    }
  }

  onPriceChange(ev) {
    ifNumberF(ev, (value) => this.setState({
      price: +value,
      salePrice: (this.props.opt.defaultSaleMargin / 100.0) * Number(value) + Number(value),
    }))
  }

  onSalePriceChange(ev) {
    ifNumberF(ev, (value) => this.setState({ salePrice: +value }))
  }

  onQuantityChange(ev) {
    ifNumberF(ev, (value) => this.setState({ quantity: +value }))
  }

  onUnitChange(unit) {
    this.setState({
      unitId: unit.id,
      unitTitle: unit.title,
    })
  }

  onCurrencyChange(currency) {
    this.setState({
      currencyId: currency.id,
      currencyTitle: currency.title,
    })
  }

  onSaleCurrencyChange(currency) {
    this.setState({
      saleCurrencyChange: currency.id,
    })
  }

  onUpdate() {
    this.consignmentApi
      .updateCurrentConsignmentItem(this.state)
      .then(_ => {
        if (this.state.salePrice > 0) {
          return this.priceApi.setPrice({
            productId  : this.state.productId,
            price      : this.state.salePrice,
            currencyId : this.state.saleCurrencyId,
          })
        } else {
          return Promise.resolve()
        }
      })
      .then(_ => this.props.onUpdate(this.state))
  }

  onKeyDown(ev) {
    if (ev.key === "Enter") {
      ev.preventDefault()
      this.onUpdate()
    }
  }

  form() {
    return (
      <Form size="large" width={16} onKeyDown={this.onKeyDown}>
        <Message header={this.state.productBarcode} content={this.state.productTitle} />
        <Form.Group>
          <Form.Input
            autoFocus
            width={10}
            label="Цена покупки"
            onChange={this.onPriceChange}
            value={this.state.price || 0}
            control={this.priceInput}
          />
          <Form.Field width={6}>
            <label>Валюта покупки</label>
            <CurrencyPicker
              size="large"
              api={this.props.api}
              value={this.state.currencyId}
              onPick={this.onCurrencyChange}
            />
          </Form.Field>
        </Form.Group>
        <Form.Group>
          <Form.Input
            width={10}
            label="Количество"
            onChange={this.onQuantityChange}
            value={this.state.quantity || 0}
            control={this.quantityInput}
          />
          <Form.Field width={6}>
            <label>Ед. изм.</label>
            <UnitPicker
              size="large"
              api={this.props.api}
              value={this.state.unitId}
              onPick={this.onUnitChange}
            />
          </Form.Field>
        </Form.Group>
        <Form.Group>
          <Form.Input
            autoFocus
            width={10}
            label="Цена продажи"
            onChange={this.onSalePriceChange}
            value={this.state.salePrice || 0}
            control={this.salePriceInput}
          />
          <Form.Field width={6}>
            <label>Валюта продажи</label>
            <CurrencyPicker
              size="large"
              api={this.props.api}
              value={this.state.saleCurrencyId}
              onPick={this.onSaleCurrencyChange}
            />
          </Form.Field>
        </Form.Group>
        <Button fluid type="button" color={this.props.theme.mainColor} onClick={this.onUpdate}>Изменить (Enter)</Button>
        <Message size="mini" header="Модель" content={this.state.productModel} />
        <Message size="mini" header="Мотор"  content={this.state.productEngine} />
        <Form.Group widths="equal">
          <Form.Field><Message size="mini" header="Бренд"    content={this.state.productBrand}  /></Form.Field>
          <Form.Field><Message size="mini" header="OEM"      content={this.state.productOemNo}  /></Form.Field>
          <Form.Field><Message size="mini" header="Серийник" content={this.state.productSerial} /></Form.Field>
        </Form.Group>
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
        <p>Фотографии товара</p>
        <p>Добавление фотографий будет доступно в новых обновлениях программы</p>
      </Segment>
    )
  }

  history() {
    return (
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Дата     </Table.HeaderCell>
            <Table.HeaderCell>Поставщик</Table.HeaderCell>
            <Table.HeaderCell>Кол-во   </Table.HeaderCell>
            <Table.HeaderCell>Цена     </Table.HeaderCell>
            <Table.HeaderCell>Валюта   </Table.HeaderCell>
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
              <Menu.Item name="История" active={this.state.activeTab === "history"} onClick={() => this.setState({ activeTab: "history" })} />
              <Menu.Item name="Фото"    active={this.state.activeTab === "photos"}  onClick={() => this.setState({ activeTab: "photos" })}  />
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
        <Modal.Header color={this.props.theme.mainColor} >
          Приёмка на склад: {this.state.productTitle}
        </Modal.Header>
        <Modal.Content>
          {this.content()}
        </Modal.Content>
      </Modal>
    )
  }
}

export default ConsignmentItem

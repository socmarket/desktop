import UnitPicker     from "View/base/unit/picker"
import {
  numberInputWithRef,
  ifNumberF
}                     from "Util"

import React, { Fragment } from "react"
import { connect } from "react-redux"
import {
  Grid, Form, Input, Button,
  Segment, Message, Modal,
  Container, Header, Divider
} from "semantic-ui-react"

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

    this.saleCheckApi = props.api.saleCheck

    this.state = {
      ...props.item,
      errorMsg: "",
    }
  }

  componentDidMount() {
    this.priceInputRef.current.focus()
    this.priceInputRef.current.select()
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
        <Message header={this.state.productBarcode} content={this.state.productTitle} />
        <Form.Group>
          <Form.Input
            autoFocus
            width={6}
            label="Цена"
            onChange={this.onPriceChange}
            value={this.state.price || 0}
            control={this.priceInput}
          />
          <Form.Input
            width={6}
            label="Количество"
            onChange={this.onQuantityChange}
            value={this.state.quantity || 0}
            control={this.quantityInput}
          />
          <Form.Field width={4}>
            <label>Ед. изм.</label>
            <UnitPicker
              api={this.props.api}
              size="large"
              value={this.state.unitId}
              onPick={this.onUnitChange}
            />
          </Form.Field>
        </Form.Group>
        <Button fluid type="button" color={this.props.theme.mainColor} onClick={this.onUpdate}>Изменить (Shift + Enter)</Button>
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

  content() {
    return (
      <Grid>
        <Grid.Row>
          <Grid.Column width={8}>
            <Segment style={{ height: "100%" }}>
              <Segment inverted color={this.props.theme.mainColor} style={{ height: "100%" }}>
                { this.state.errorMsg.length > 0 &&
                  <Message error>
                    {this.state.errorMsg}
                  </Message>
                }
                <p>Фотографии товара</p>
                <p>Добавление фотографий будет доступно в новых обновлениях программы</p>
              </Segment>
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
          Продажа: {this.state.productTitle}
        </Modal.Header>
        <Modal.Content>
          {this.content()}
        </Modal.Content>
      </Modal>
    )
  }
}

export default SaleCheckItem

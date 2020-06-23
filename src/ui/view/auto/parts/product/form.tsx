import UnitPicker     from "View/base/unit/picker"
import CategoryPicker from "View/base/category/picker"

import React, { Fragment } from "react"
import { connect } from "react-redux"
import {
  Grid, Form, Input, Button,
  Segment, Message, Modal,
  Container,
} from "semantic-ui-react"

const inputWithRef = (ref, icon, onClickF) => (props) => (
  <div className="ui action input">
    <input ref={ref} {...props} />
    { icon && <Button type="button" icon={icon} onClick={onClickF} /> }
  </div>
)

class ProductForm extends React.Component {

  constructor(props) {
    super(props)
    this.productApi = props.api.autoParts.product

    this.onCreate         = this.onCreate.bind(this)
    this.onUpdate         = this.onUpdate.bind(this)
    this.onNewBarcode     = this.onNewBarcode.bind(this)
    this.onBarcodeChange  = this.onBarcodeChange.bind(this)
    this.onTitleChange    = this.onTitleChange.bind(this)
    this.onBrandChange    = this.onBrandChange.bind(this)
    this.onModelChange    = this.onModelChange.bind(this)
    this.onEngineChange   = this.onEngineChange.bind(this)
    this.onOemNoChange    = this.onOemNoChange.bind(this)
    this.onSerialChange   = this.onSerialChange.bind(this)
    this.onUnitChange     = this.onUnitChange.bind(this)
    this.onCategoryChange = this.onCategoryChange.bind(this)
    this.onKeyDown        = this.onKeyDown.bind(this)

    this.state = props.product
    this.state.errorMsg = ""
    this.state.barcodeValidated = props.product.barcode.length > 0
    this.state.titleValidated   = props.product.title.length > 0

    this.barcodeInputRef     = React.createRef()
    this.barcodeDupCheckerId = React.createRef(-1)

    this.barcodeInput = inputWithRef(this.barcodeInputRef, "add", this.onNewBarcode)
  }

  componentDidMount() {
    this.focusBarcode()
  }

  focusBarcode() {
    this.barcodeInputRef.current.focus()
    this.barcodeInputRef.current.select()
  }

  validated() {
    return this.state.barcodeValidated && this.state.titleValidated
  }

  checkBarcodeDuplicates() {
    if (this.barcodeDupCheckerId.current > 0)
      clearTimeout(this.barcodeDupCheckerId.current)
    if (this.state.barcode.length > 0) {
      this.barcodeDupCheckerId.current = setTimeout(() => {
        this.productApi.selectProductWithSameBarcode(this.state.barcode, this.state.id)
          .then(p => {
            if (p) {
              this.setState({
                barcodeValidated: false,
                errorMsg: "Есть другой товар с таким же штрихкодом: " +
                  `${p.title}:${p.model}:${p.engine}:OEM:${p.oemNo}:Ser:${p.serial}`
              })
            } else {
              this.setState({
                barcodeValidated: true,
                errorMsg: "",
              })
            }
          })
      }, 200)
    } else {
      this.setState({
        barcodeValidated: false,
      })
    }
  }

  onNewBarcode() {
    this.productApi.genBarcode()
      .then(
        barcode => this.setState({
          barcode: barcode,
          barcodeValidated: true,
        }, () => this.focusBarcode())
      )
  }

  onBarcodeChange(ev) {
    this.setState({
      barcode: ev.target.value,
    }, () => this.checkBarcodeDuplicates())
  }

  onTitleChange(ev) {
    this.setState({
      title: ev.target.value,
      titleValidated: ev.target.value.length > 0,
    })
  }

  onModelChange(ev) {
    this.setState({
      model: ev.target.value,
    })
  }

  onEngineChange(ev) {
    this.setState({
      engine: ev.target.value,
    })
  }

  onOemNoChange(ev) {
    this.setState({
      oemNo: ev.target.value,
    })
  }

  onSerialChange(ev) {
    this.setState({
      serial: ev.target.value,
    })
  }

  onBrandChange(ev) {
    this.setState({
      brand: ev.target.value,
    })
  }

  onUnitChange(unit) {
    this.setState({
      unitId: unit.id,
      unitTitle: unit.title,
    })
  }

  onCategoryChange(category) {
    this.setState({
      categoryId: category.id,
      categoryTitle: category.title,
    })
  }

  onKeyDown(ev) {
    if (ev.key === "Enter" && ev.shiftKey && this.validated()) {
      if (this.props.id < 0) {
        this.onCreate()
      } else {
        this.onUpdate()
      }
    }
  }

  onCreate() {
    this.productApi
      .upsert(this.state)
      .then(_ => this.props.onCreate(this.state))
  }

  onUpdate() {
    this.productApi
      .upsert(this.state)
      .then(_ => this.props.onUpdate(this.state))
  }

  form() {
    const existing  = this.state.id > 0
    return (
      <Form size="small" width={16} onKeyDown={this.onKeyDown}>
        <Form.Group>
          <Form.Input
            width={7}
            label="Штрихкод"
            error={!this.state.barcodeValidated}
            onChange={this.onBarcodeChange}
            value={this.state.barcode || ""}
            control={this.barcodeInput}
          />
          <Form.Field width={3}>
            <label>Ед. изм.</label>
            <UnitPicker api={this.props.api} value={this.state.unitId} onPick={this.onUnitChange} />
          </Form.Field>
          <Form.Field width={6}>
            <label>Категория товара</label>
            <CategoryPicker api={this.props.api} value={this.state.categoryId} onPick={this.onCategoryChange} />
          </Form.Field>
        </Form.Group>
        <Form.Group>
          <Form.Input width={16} label="Наименование" value={this.state.title || ""} onChange={this.onTitleChange} error={!this.state.titleValidated} />
        </Form.Group>
        <Form.Group>
          <Form.Input width={16} label="Модель"  value={this.state.model || ""}  onChange={this.onModelChange} />
        </Form.Group>
        <Form.Group>
          <Form.Input width={16} label="Движок"  value={this.state.engine || ""} onChange={this.onEngineChange} />
        </Form.Group>
        <Form.Group>
          <Form.Input width={5} label="OEM"      value={this.state.oemNo || ""}  onChange={this.onOemNoChange} />
          <Form.Input width={5} label="Серийник" value={this.state.serial || ""} onChange={this.onSerialChange} />
          <Form.Input width={6} label="Бренд"    value={this.state.brand || ""}  onChange={this.onBrandChange} />
        </Form.Group>
        <Button.Group fluid>
          {this.state.id < 0 && <Button type="button" disabled={!this.validated()} onClick={this.onCreate}>Создать (Shift + Enter)</Button>}
          {this.state.id > 0 && <Button type="button" disabled={!this.validated()} onClick={this.onUpdate}>Изменить (Shift + Enter)</Button>}
        </Button.Group>
      </Form>
    )
  }

  buttons() {
    const existing = this.state.id > 0
    return (
      <Form>
        <Form.Group>
          <Form.Input
            style={{ width: 50 }}
            size="small"
          />
          <Button
            fluid
            size="small"
          >
            Печатать
          </Button>
        </Form.Group>
        {errorMsg.length > 0 && <Message danger>{errorMsg}</Message> }
        { validated && (
          <Fragment>
            <Form.Group>
            </Form.Group>
          </Fragment>
        )}
      </Form>
    )
  }

  content() {
    return (
      <Grid>
        <Grid.Row>
          <Grid.Column width={8}>
            <Segment style={{ height: "100%" }}>
              <Segment inverted color="grey" style={{ height: "100%" }}>
                { this.state.errorMsg.length > 0 &&
                  <Message error>
                    {this.state.errorMsg}
                  </Message>
                }
                <p>Фотографии товара</p>
                <p>Будет доступно в новых обновлениях программы</p>
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

  productDesc() {
    return `#${this.props.product.id}: ${this.props.product.title}` 
  }

  render() {
    const header =
      this.state.id ?
        (this.state.id > 0 ? this.productDesc() : "регистрация нового товара") :
        "Ошибка открытия"
    return (
      <Modal
        open={this.props.open}
        centered={false}
        size="large"
        onClose={this.props.onClose}
      >
        <Modal.Header>
          Карточка товара: {header}
        </Modal.Header>
        <Modal.Content>
          {this.content()}
        </Modal.Content>
      </Modal>
    )
  }
}

export default ProductForm

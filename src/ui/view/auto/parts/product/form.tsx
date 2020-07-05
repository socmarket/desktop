import UnitPicker     from "View/base/unit/picker"
import CategoryPicker from "View/base/category/picker"
import {
  asDate,
  actionInputWithRef,
}                     from "Util"

import React, { Fragment } from "react"
import { connect } from "react-redux"
import {
  Grid, Form, Input, Button, Segment,
  Message, Modal, Container, Divider,
  Menu, Table,
} from "semantic-ui-react"

function opToLocal(op) {
  var local = ""
  switch (op) {
    case "sale"        : local = "продажа" ; break
    case "consignment" : local = "покупка" ; break
    case "inPriceSet"  : local = "цена покупки" ; break
    case "outPriceSet" : local = "цена продажи" ; break
    default            : local = "неизвестно" ; break
  }
  return local
}

class ProductForm extends React.Component {

  constructor(props) {
    super(props)

    this.onCreate           = this.onCreate.bind(this)
    this.onUpdate           = this.onUpdate.bind(this)
    this.onNewBarcode       = this.onNewBarcode.bind(this)
    this.onBarcodeChange    = this.onBarcodeChange.bind(this)
    this.onTitleChange      = this.onTitleChange.bind(this)
    this.onBrandChange      = this.onBrandChange.bind(this)
    this.onModelChange      = this.onModelChange.bind(this)
    this.onEngineChange     = this.onEngineChange.bind(this)
    this.onOemNoChange      = this.onOemNoChange.bind(this)
    this.onSerialChange     = this.onSerialChange.bind(this)
    this.onUnitChange       = this.onUnitChange.bind(this)
    this.onCategoryChange   = this.onCategoryChange.bind(this)
    this.onKeyDown          = this.onKeyDown.bind(this)
    this.onPrintLabel       = this.onPrintLabel.bind(this)
    this.onLabelCountChange = this.onLabelCountChange.bind(this)

    this.printerApi = this.props.api.printer
    this.productApi = props.api.autoParts.product

    this.state = props.product
    this.state.errorMsg = ""
    this.state.barcodeValidated = props.product.barcode.length > 0
    this.state.titleValidated   = props.product.title.length > 0
    this.state.labelCount = 1
    this.state.activeTab = "history"
    this.state.history = []

    this.barcodeInputRef     = React.createRef()
    this.labelCountInputRef  = React.createRef()
    this.barcodeDupCheckerId = React.createRef(-1)

    this.barcodeInput    = actionInputWithRef(this.barcodeInputRef, "add", this.onNewBarcode)
    this.labelCountInput = actionInputWithRef(this.labelCountInputRef, "barcode", this.onPrintLabel)
  }

  componentDidMount() {
    this.focusBarcode()
    this.productApi.selectProductFlow(this.props.product.id)
      .then(history => this.setState({
        history: history,
      }))
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
    this.productApi.genBarcode(this.props.opt.barcodePrefix)
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

  onLabelCountChange(ev) {
    this.setState({
      labelCount: +ev.target.value,
    })
  }

  onPrintLabel() {
    this.printerApi.printLabel({
      barcode   : this.state.barcode,
      text      : this.state.title + ": " + this.state.oemNo + ": " + this.state.brand,
      count     : this.state.labelCount,
      labelSize : this.props.opt.productLabelSize,
      offsetX   : this.props.opt.productLabelOffsetX,
      printerId : this.props.opt.labelPrinterId,
    })
  }

  form() {
    return (
      <Form size="small" width={16} onKeyDown={this.onKeyDown} error={this.state.errorMsg.length > 0}>
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
        <Message error>{this.state.errorMsg}</Message>
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
          {this.state.id < 0 && <Button type="button" color={this.props.theme.mainColor}
            disabled={!this.validated()} onClick={this.onCreate}>Создать (Shift + Enter)</Button>}
          {this.state.id > 0 && <Button type="button" color={this.props.theme.mainColor}
            disabled={!this.validated()} onClick={this.onUpdate}>Изменить (Shift + Enter)</Button>}
        </Button.Group>
        <Divider />
        <Form.Group>
          <Form.Input
            width={16}
            label="Печатать штрихкод"
            onChange={this.onLabelCountChange}
            value={this.state.labelCount || 0}
            control={this.labelCountInput}
          />
        </Form.Group>
      </Form>
    )
  }

  buttons() {
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

  photos() {
    return (
      <Segment inverted color={this.props.opt.theme.mainColor} style={{ height: "100%" }}>
        <p>Фотографии товара</p>
        <p>Будет доступно в новых обновлениях программы</p>
      </Segment>
    )
  }

  history() {
    return (
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell textAlign="center">Дата     </Table.HeaderCell>
            <Table.HeaderCell textAlign="center">#</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">#</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">Операция</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {this.state.history.map((item, idx) => (
            <Table.Row key={idx}>
              <Table.Cell textAlign="center">{asDate(item.opAt) }</Table.Cell>
              <Table.Cell textAlign="right" >{item.amount       }</Table.Cell>
              <Table.Cell                   >{item.units        }</Table.Cell>
              <Table.Cell                   >{opToLocal(item.op)}</Table.Cell>
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
            <Segment color={this.props.theme.mainColor}>
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

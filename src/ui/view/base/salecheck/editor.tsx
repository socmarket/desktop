import SaleCheckItem from "./itemEditor"

import DTable        from "View/comp/dtable"
import ProductPicker from "View/base/product/picker"
import ClientPicker  from "View/base/client/picker"
import {
  numberInputWithRef,
  ifNumberF,
  mround,
}                    from "Util"

import React, { Fragment } from "react"
import { connect } from "react-redux"
import {
  Header, Grid, Table, Form, Input, Select,
  Button, Segment, Icon, Modal,
} from "semantic-ui-react"
import moment from "moment"
import { withTranslation } from "react-i18next"

class SaleCheckEditor extends React.Component {

  emptyItem = {
    id             : -1,
    productId      : -1,
    productTitle   : "",
    productBarcode : "",
    unitId         : -1,
    unitTitle      : "",
    currencyId     : -1,
    currencyTitle  : "",
    price          : 0,
    quantity       : 0,
    cost           : 0,
  }

  constructor(props) {
    super(props)

    this.onProductPick         = this.onProductPick.bind(this)
    this.onClientChange        = this.onClientChange.bind(this)
    this.onExtraDiscountChange = this.onExtraDiscountChange.bind(this)
    this.onCashChange          = this.onCashChange.bind(this)
    this.onOpenItem            = this.onOpenItem.bind(this)
    this.onDeleteItem          = this.onDeleteItem.bind(this)
    this.onItemUpdate          = this.onItemUpdate.bind(this)
    this.onItemEditorClose     = this.onItemEditorClose.bind(this)
    this.onGlobalKeyDown       = this.onGlobalKeyDown.bind(this)
    this.onActivate            = this.onActivate.bind(this)
    this.onPrintCheck          = this.onPrintCheck.bind(this)
    this.onWantClearCheck      = this.onWantClearCheck.bind(this)
    this.onExportToExcel       = this.onExportToExcel.bind(this)
    this.onConfirmClearCheck   = this.onConfirmClearCheck.bind(this)

    this.productPickerRef      = React.createRef()
    this.clientPickerRef       = React.createRef()
    this.tableRef              = React.createRef()
    this.cashInputRef          = React.createRef()
    this.extraDiscountInputRef = React.createRef()
    this.extraDiscountInput    = numberInputWithRef(this.extraDiscountInputRef)
    this.cashInput             = numberInputWithRef(this.cashInputRef)

    this.activateLock = React.createRef(false)

    this.fileApi      = props.api.file
    this.priceApi     = props.api.price
    this.printerApi   = props.api.printer
    this.saleCheckApi = props.api.saleCheck

    this.state = {
      items               : [],
      cost                : 0,
      discount            : 0,
      total               : 0,
      change              : 0,
      extraDiscount       : 0,
      cash                : "",
      itemEditorVisible   : false,
      clientId            : props.opt.defaultClientId || 1,
      item                : this.emptyItem,
      clearConfirmVisible : false,
    }
    this.t = this.props.t
  }

  componentDidMount() {
    this.reloadCurrentSaleCheck()
      .then(_ => this.productPickerRef.current.focus())
  }

  reloadCurrentSaleCheck() {
    return this.saleCheckApi.selectCurrentSaleCheck()
      .then(saleCheck => {
        this.setState({
          ...saleCheck,
          cash                : "",
          extraDiscount       : 0,
          clientId            : this.props.opt.defaultClientId || 1,
          clearConfirmVisible : false,
        })
      })
  }

  onProductPick(product) {
    this.priceApi.getPriceFor({
        productId  : product.id,
        currencyId : this.props.opt.defaultCurrencyId,
        margin     : this.props.opt.defaultSaleMargin,
      })
      .then(priceRow => priceRow ? priceRow.price : 0)
      .then(price => {
        this.saleCheckApi
          .insertCurrentSaleCheckItem({
            productId  : product.id,
            quantity   : 1,
            price      : price,
          })
          .then(_ => this.reloadCurrentSaleCheck())
      })
  }

  onClientChange(client) {
    this.setState({
      clientId: client.id
    })
  }

  onCashChange(ev) {
    ifNumberF(ev, (value) => this.setState({ cash: value }))
  }

  onExtraDiscountChange(ev) {
    ifNumberF(ev, (value) => {
      if (value <= this.state.cost) {
        this.setState({ extraDiscount: value })
      }
    })
  }

  onGlobalKeyDown(ev) {
    switch (ev.key) {
      case "Escape": {
        this.productPickerRef.current.focus()
        break
      }
      case "Enter": {
        if (ev.shiftKey) {
          ev.preventDefault()
          this.onActivate()
        }
        break
      }
    }
  }

  lockActivation() {
    if (this.activateLock.current)
      return false
    this.activateLock.current = true
    setTimeout(() => {
      this.activateLock.current = false
    }, 2000)
    return true
  }

  onActivate() {
    if (!this.lockActivation())
      return
    if (this.state.items.length === 0) {
      this.productPickerRef.current.focus()
    } else if (!this.state.clientId || this.state.clientId < 0) {
      this.clientPickerRef.current.focus()
    } else if ((this.state.cash + "").length === 0) {
      this.cashInputRef.current.focus()
    } else {
      this.saleCheckApi.closeCurrentSaleCheck(this.state)
        .then(_ => this.reloadCurrentSaleCheck())
        .then(_ => this.productPickerRef.current.focus())
    }
  }

  onOpenItem(item, idx) {
    this.setState({
      item: item,
      itemEditorVisible: true,
    })
  }

  onDeleteItem(item, idx) {
    this.saleCheckApi
      .deleteCurrentSaleCheckItem(item)
      .then(_ => this.reloadCurrentSaleCheck())
  }

  onItemEditorClose() {
    this.setState({
      itemEditorVisible: false,
    }, () => this.tableRef.current.focus())
  }

  onItemUpdate(item) {
    this.setState({
      itemEditorVisible: false,
    }, () => {
      this.reloadCurrentSaleCheck()
        .then(_ => this.tableRef.current.focus())
    })
  }

  onPrintCheck() {
    this.printerApi
      .printCheck({
        check: {
          dateTime : moment().format("DD-MM-YYYY HH:mm"),
          items : this.state.items.map(x => ({
            barcode  : x.productBarcode,
            title    : x.productTitle,
            price    : x.price,
            quantity : x.quantity,
          })),
        },
        logo : [
          this.props.opt.logoLine1,
          this.props.opt.logoLine2,
          this.props.opt.logoLine3,
        ],
        offsetX   : this.props.opt.productLabelOffsetX,
        printerId : this.props.opt.labelPrinterId,
      })
  }

  onWantClearCheck() {
    this.setState({
      clearConfirmVisible: true,
    })
  }

  onExportToExcel() {
    const dt = moment().format("YYYY-MM-DD-HH-ss")
    return this.fileApi.saveFile("chek-" + dt + ".xlsx", [ "xls", "xlsx" ])
      .then(file => {
        if (file) {
          return this.saleCheckApi
            .exportToExcel(
              file,
              this.state.items,
              [
                this.props.opt.logoLine1,
                this.props.opt.logoLine2,
                this.props.opt.logoLine3,
                dt,
              ]
            )
        }
      })
  }

  onConfirmClearCheck() {
    this.saleCheckApi.clearCurrentSaleCheck()
      .then(_ => this.reloadCurrentSaleCheck())
  }

  clearConfirmDialog() {
    return (
      <Modal color="red" size="mini" dimmer="inverted" open onClose={() => this.setState({ clearConfirmVisible: false })}>
        <Modal.Header>{this.t("clearChek")}</Modal.Header>
        <Modal.Content>
          <p>{this.t("clearCart")}</p>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => this.setState({ clearConfirmVisible: false })}>{this.t("no")}</Button>
          <Button
            color={this.props.opt.theme.mainColor}
            content={this.t("yes")}
            onClick={this.onConfirmClearCheck}
          />
        </Modal.Actions>
      </Modal>
    )
  }

  itemEditor() {
    return (
      <SaleCheckItem
        open
        api={this.props.api}
        opt={this.props.opt}
        theme={this.props.theme}
        item={this.state.item}
        onClose={this.onItemEditorClose}
        onUpdate={this.onItemUpdate}
      />
    )
  }

  table() {
    return (
      <DTable
        ref={this.tableRef}
        titleIcon="cart"
        title={this.t("cart")}
        color={this.props.theme.mainColor}
        items={this.state.items}
        columns={[
          { key: "productTitle"  , title: this.t("product")       ,                             },
          { key: "originalPrice" , title: this.t("originalPrice") , align: "right"              },
          { key: "price"         , title: this.t("price")         , align: "right", positive: 1 },
          { key: "quantity"      , title: this.t("quantity")      , align: "right", positive: 1 },
          { key: "unitTitle"     , title: this.t("unitTitle")     ,                             },
          { key: "cost"          , title: this.t("cost")          , align: "right"              },
          { key: "total"         , title: this.t("totalWithtDiscount")  , align: "right", positive: 1 },
          { key: "productBarcode", title: this.t("barcode")       ,                             },
        ]}
        menu={{
          header: {
            title: this.t("currentReceipt"),
          },
          items: [
            { title: this.t("printCheck")   , description: ""                         , icon: "print"     , onClick: this.onPrintCheck },
            { title: this.t("saveToExcel")  , description: this.t("saveToExcelDiscr") , icon: "file excel", onClick: this.onExportToExcel },
            { divider: true },
            { title: this.t("clearChek"), description: this.t("clearChekDiscr"),        onClick: this.onWantClearCheck },
          ]
        }}
        onOpenRow={this.onOpenItem}
        onDeleteRow={this.onDeleteItem}
        onActivate={this.onActivate}
      />
    )
  }

  summary() {
    const change = mround(+this.state.cash - (this.state.total - this.state.extraDiscount))
    return (
      <Segment textAlign="left" color={this.props.theme.mainColor} raised clearing>
        <Header as="h2" dividing color={this.props.theme.mainColor} textAlign="center">
          <Icon name="clipboard list" />
          {this.t("currentReceipt")}
        </Header>
        <Grid padded>
          <Grid.Row>
            <Grid.Column width={6}><Header as="h2">{this.t("cost")}</Header></Grid.Column>
            <Grid.Column width={10}><Header as="h2" dividing textAlign="right">{this.state.cost}</Header></Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={6}><Header as="h2">{this.t("discount")}</Header></Grid.Column>
            <Grid.Column width={10}>
              <Header as="h2" dividing textAlign="right">
                {this.state.discount} + {this.state.extraDiscount} = {mround((+this.state.discount) + (+this.state.extraDiscount))}
              </Header>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={6}><Header as="h1">{this.t("total")}</Header></Grid.Column>
            <Grid.Column width={10}>
              <Header dividing as="h1" textAlign="right" color={this.props.theme.mainColor}>
                {mround(this.state.total - this.state.extraDiscount)}
              </Header>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={6}><Header as="h2">{this.t("change")}</Header></Grid.Column>
            <Grid.Column width={10}>
              <Header dividing as="h2" textAlign="right">
                {change > 0 ? change : "0" }
              </Header>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <br />
        <Form>
          <Form.Field>
            <label>{this.t("client")}</label>
            <ClientPicker
              api={this.props.api}
              forwardRef={this.clientPickerRef}
              value={this.state.clientId}
              onPick={this.onClientChange}
            />
          </Form.Field>
          <Form.Group>
            <Form.Input
              width={16}
              label={this.t("discount")}
              value={this.state.extraDiscount}
              onChange={this.onExtraDiscountChange}
              control={this.extraDiscountInput}
            />
          </Form.Group>
          <Form.Group>
            <Form.Input
              width={16}
              label={this.t("cash")}
              value={this.state.cash}
              onChange={this.onCashChange}
              control={this.cashInput}
            />
          </Form.Group>
          <Button floated="right" color={this.props.theme.mainColor} onClick={this.onActivate}>{this.t("closeReceipt")} (Shift + Enter)</Button>
        </Form>
      </Segment>
    )
  }

  render() {
    return (
      <Fragment>
        <Grid padded tabIndex={-1} onKeyDown={this.onGlobalKeyDown} className="light-focus">
          <Grid.Row>
            <Grid.Column width={16}>
              <Segment>
                <ProductPicker
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
              {this.summary()}
            </Grid.Column>
            <Grid.Column width={11}>
              {this.table()}
            </Grid.Column>
          </Grid.Row>
        </Grid>
        {this.state.itemEditorVisible && this.itemEditor()}
        {this.state.clearConfirmVisible && this.clearConfirmDialog()}
      </Fragment>
    )
  }
}

export default (withTranslation("base_salecheck_editor.form")(SaleCheckEditor))

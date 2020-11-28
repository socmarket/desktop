import ConsignmentItem from "./itemEditor"

import DTable        from "View/comp/dtable"
import ProductPicker from "View/base/product/picker"
import SupplierPicker  from "View/base/supplier/picker"
import {
  numberInputWithRef,
  ifNumberF,
  spacedNum,
}                    from "Util"

import React, { Fragment } from "react"
import { connect } from "react-redux"
import moment from "moment"
import { Translation } from 'react-i18next'
import {
  Header, Grid, Table, Form, Input, Select,
  TextArea, Button, Segment, Image, Icon,
  Label, Container, Menu, Message, Divider,
  Rail, Dropdown, Modal,
} from "semantic-ui-react"
import { withTranslation } from 'react-i18next';

class ConsignmentEditor extends React.Component {

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

    this.onProductPick       = this.onProductPick.bind(this)
    this.onSupplierChange    = this.onSupplierChange.bind(this)
    this.onOpenItem          = this.onOpenItem.bind(this)
    this.onDeleteItem        = this.onDeleteItem.bind(this)
    this.onItemUpdate        = this.onItemUpdate.bind(this)
    this.onItemEditorClose   = this.onItemEditorClose.bind(this)
    this.onGlobalKeyDown     = this.onGlobalKeyDown.bind(this)
    this.onActivate          = this.onActivate.bind(this)
    this.onWantClearList     = this.onWantClearList.bind(this)
    this.onExportToExcel     = this.onExportToExcel.bind(this)
    this.onConfirmClearList  = this.onConfirmClearList.bind(this)

    this.productPickerRef      = React.createRef()
    this.supplierPickerRef     = React.createRef()
    this.tableRef              = React.createRef()

    this.activateLock = React.createRef(false)

    this.fileApi        = props.api.file
    this.consignmentApi = props.api.consignment

    this.state = {
      items               : [],
      cost                : 0,
      itemEditorVisible   : false,
      supplierId          : props.opt.defaultSupplierId || 1,
      lastUsedCurrencyId  : props.opt.defaultCurrencyId || 1,
      item                : this.emptyItem,
      clearConfirmVisible : false,
      consignmentId       : this.props.consignmentId || -1,
    }
    this.t = this.props.t
  }

  componentDidMount() {
    this.reloadConsignment()
      .then(_ => this.productPickerRef.current.focus())
  }

  reloadConsignment() {
    return this.consignmentApi
      .selectConsignment(this.state.consignmentId)
      .then(consignment => {
        if (this.state.consignmentId < 0) {
          this.setState({
            ...consignment,
            supplierId      : this.props.opt.defaultSupplierId || 1,
            clearConfirmVisible : false,
          })
        } else {
          this.setState({
            ...consignment,
            clearConfirmVisible : false,
          })
        }
      })
  }

  onProductPick(product) {
    this.consignmentApi.selectLastConsignmentPrice(product.id)
      .then(price => {
        return this.consignmentApi
          .insertConsignmentItem({
            consignmentId : this.state.consignmentId,
            productId     : product.id,
            quantity      : 1,
            price         : price,
            currencyId    : this.state.lastUsedCurrencyId,
            unitId        : product.unitId,
          })
          .then(_ => this.reloadConsignment())
          .then(_ => {
            const idx = this.state.items.findIndex(x => x.productId === product.id)
            return this.setState({
              item: this.state.items[idx],
              itemEditorVisible : true,
            })
          })
      })
  }

  onSupplierChange(supplier) {
    this.setState({
      supplierId: supplier.id,
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
    } else if (!this.state.supplierId || this.state.supplierId < 0) {
      this.supplierPickerRef.current.focus()
    } else {
      this.consignmentApi.closeConsignment(this.state)
        .then(_ => this.reloadConsignment())
        .then(_ => this.productPickerRef.current.focus())
        .then(_ => {
          if (this.props.onSave) {
            this.props.onSave()
          }
        })
    }
  }

  onOpenItem(item, idx) {
    this.setState({
      item: item,
      itemEditorVisible: true,
    })
  }

  onDeleteItem(item, idx) {
    this.consignmentApi
      .deleteConsignmentItem(item)
      .then(_ => this.reloadConsignment())
  }

  onItemEditorClose() {
    this.setState({
      itemEditorVisible: false,
    }, () => this.tableRef.current.focus())
  }

  onItemUpdate(item) {
    this.setState({
      itemEditorVisible  : false,
      lastUsedCurrencyId : item.currencyId,
    }, () => {
      this.reloadConsignment()
        .then(_ => this.productPickerRef.current.focus())
    })
  }

  onWantClearList() {
    this.setState({
      clearConfirmVisible: true,
    })
  }

  onExportToExcel() {
    const dt = moment().format("YYYY-MM-DD-HH-ss")
    return this.fileApi.saveFile("consignment-" + dt + ".xlsx", [ "xls", "xlsx" ])
      .then(file => {
        if (file) {
          return this.consignmentApi
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

  onConfirmClearList() {
    this.consignmentApi.clearConsignment(this.state.consignmentId)
      .then(_ => this.reloadConsignment())
  }

  onCancel() {
    if (this.props.onCancel) {
      this.props.onCancel()
     }
  }

  clearConfirmDialog() {
    return (
      <Modal color="red" size="mini" dimmer="inverted" open onClose={() => this.setState({ clearConfirmVisible: false })}>
        <Modal.Header>{this.t("clearConsignmentQ")}</Modal.Header>
        <Modal.Content>
          <p>{this.t("clearConsignmentQDesc")}</p>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => this.setState({ clearConfirmVisible: false })}>{this.t("no")}</Button>
          <Button
            color={this.props.opt.theme.mainColor}
            content={this.t("yes")}
            onClick={this.onConfirmClearList}
          />
        </Modal.Actions>
      </Modal>
    )
  }

  itemEditor() {
    return (
      <ConsignmentItem
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
        titleIcon="clipboard list"
        title={this.t("consignment")}
        color={this.props.theme.mainColor}
        items={this.state.items}
        columns={[
          { key: "productTitle"  , title: this.t("product")  ,                             },
          { key: "price"         , title: this.t("price")    , align: "right", positive: 1 },
          { key: "quantity"      , title: this.t("quantity") , align: "right", positive: 1 },
          { key: "unitTitle"     , title: this.t("unit")     ,                             },
          { key: "cost"          , title: this.t("amount")   , align: "right", positive: 1 },
          { key: "currencyTitle" , title: this.t("currency") ,                             },
          { key: "productBarcode", title: this.t("barcode")  ,                             },
          { key: "salePrice"     , title: this.t("salePrice"), align: "right", positive: 1 },
        ]}
        menu={{
          header: {
            title: this.t("currentConsignment"),
          },
          items: [
            { title: this.t("saveToExcel")  , description: this.t("saveToExcelDesc") , icon: "file excel", onClick: this.onExportToExcel },
            { divider: true },
            { title: this.t("clearConsignment"), description: this.t("clearConsignmentDesc"),        onClick: this.onWantClearList },
          ]
        }}
        onOpenRow={this.onOpenItem}
        onDeleteRow={this.onDeleteItem}
        onActivate={this.onActivate}
      />
    )
  }

  summary() {
    return (
      <Segment textAlign="left" color={this.props.theme.mainColor} raised clearing>
        <Header as="h2" dividing color={this.props.theme.mainColor} textAlign="center">
          {this.state.consignmentId < 0 && this.t("warehouseAcceptance")}
          {this.state.consignmentId > 0 && this.t("consignmentNo") + this.state.consignmentId}
          {this.state.consignmentId > 0 && <Fragment>
            <br />
            {this.state.acceptedAtDate} {this.state.acceptedAtTime}
          </Fragment>}
        </Header>
        <Grid padded>
          <Grid.Row>
            <Grid.Column width={6}><Header as="h2">{this.t("cost")}</Header></Grid.Column>
            <Grid.Column width={10}><Header as="h2" dividing textAlign="right">{spacedNum(this.state.cost)}</Header></Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={6}><Header as="h1">{this.t("total")}</Header></Grid.Column>
            <Grid.Column width={10}>
              <Header dividing as="h1" textAlign="right" color={this.props.theme.mainColor}>
                {spacedNum(this.state.cost)}
              </Header>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <br />
        <Form>
          <Form.Field>
            <label>{this.t("supplier")}</label>
            <SupplierPicker
              api={this.props.api}
              forwardRef={this.supplierPickerRef}
              value={this.state.supplierId}
              onPick={this.onSupplierChange}
            />
          </Form.Field>
          { this.state.consignmentId > 0 &&
            <Button floated="left" onClick={() => this.onCancel()}>
              {this.t("cancelSave")}
            </Button>
          }
          <Button floated="right" color={this.props.theme.mainColor} onClick={this.onActivate}>
            {this.state.consignmentId < 0 ? this.t("acceptConsignment") : this.t("saveChanges")} (Shift + Enter)
          </Button>
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

export default (withTranslation("consignmentEditor")(ConsignmentEditor))

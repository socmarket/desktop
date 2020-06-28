import ConsignmentItem from "./itemEditor"

import DTable        from "View/comp/dtable"
import ProductPicker from "View/auto/parts/product/picker"
import SupplierPicker  from "View/base/supplier/picker"
import {
  numberInputWithRef,
  ifNumberF
}                    from "Util"

import React, { Fragment } from "react"
import { connect } from "react-redux"
import moment from "moment"
import { Translation } from 'react-i18next'
import {
  Header, Grid, Table, Form, Input, Select,
  TextArea, Button, Segment, Image, Icon,
  Label, Container, Menu, Message, Divider,
  Rail, Dropdown
} from "semantic-ui-react"

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

    this.onProductPick          = this.onProductPick.bind(this)
    this.onSupplierChange       = this.onSupplierChange.bind(this)
    this.onOpenItem             = this.onOpenItem.bind(this)
    this.onDeleteItem           = this.onDeleteItem.bind(this)
    this.onItemUpdate           = this.onItemUpdate.bind(this)
    this.onItemEditorClose      = this.onItemEditorClose.bind(this)
    this.onGlobalKeyDown        = this.onGlobalKeyDown.bind(this)
    this.onActivate             = this.onActivate.bind(this)

    this.productPickerRef      = React.createRef()
    this.supplierPickerRef     = React.createRef()
    this.tableRef              = React.createRef()

    this.activateLock = React.createRef(false)

    this.consignmentApi = props.api.consignment
    this.state = {
      items             : [],
      cost              : 0,
      itemEditorVisible : false,
      supplierId        : props.opt.defaultSupplierId || 1,
      item              : this.emptyItem,
    }
  }

  componentDidMount() {
    this.reloadCurrentConsignment()
      .then(_ => this.productPickerRef.current.focus())
  }

  reloadCurrentConsignment() {
    return this.consignmentApi.selectCurrentConsignment()
      .then(consignment => {
        this.setState({
          ...consignment,
          supplierId      : this.props.opt.defaultSupplierId || 1,
        })
      })
  }

  onProductPick(product) {
    this.consignmentApi
      .insertCurrentConsignmentItem({
        productId : product.id,
        quantity  : 1,
        price     : 0,
      })
      .then(_ => this.reloadCurrentConsignment())
      .then(_ => {
        const idx = this.state.items.findIndex(x => x.productId === product.id)
        return this.setState({
          item: this.state.items[idx],
          itemEditorVisible : true,
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
      this.consignmentApi.closeCurrentConsignment(this.state)
        .then(_ => this.reloadCurrentConsignment())
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
    this.consignmentApi
      .deleteCurrentConsignmentItem(item)
      .then(_ => this.reloadCurrentConsignment())
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
      this.reloadCurrentConsignment()
        .then(_ => this.tableRef.current.focus())
    })
  }

  itemEditor() {
    return (
      <ConsignmentItem
        open
        api={this.props.api}
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
        titleIcon="settings"
        title="Комплектующие"
        color={this.props.theme.mainColor}
        items={this.state.items}
        columns={[
          { key: "productTitle"  , title: "Товар"   ,                             },
          { key: "price"         , title: "Цена"    , align: "right", positive: 1 },
          { key: "quantity"      , title: "Кол-во"  , align: "right", positive: 1 },
          { key: "unitTitle"     , title: "Ед."     ,                             },
          { key: "cost"          , title: "Сумма"   , align: "right", positive: 1 },
          { key: "currencyTitle" , title: "Валюта"  ,                             },
          { key: "productBarcode", title: "Штрихкод",                             },
        ]}
        onOpenRow={this.onOpenItem}
        onDeleteRow={this.onDeleteItem}
        onActivate={this.onActivate}
      />
    )
  }

  summary() {
    return (
      <Translation ns={"consignment.form"}>
      { (t, { i18n }) => (
        <Segment textAlign="left" color={this.props.theme.mainColor} raised clearing>
          <Header as="h2" dividing color={this.props.theme.mainColor} textAlign="center">
            <Icon name="clipboard list" />
            Текущая партия
          </Header>
          <Grid padded>
            <Grid.Row>
              <Grid.Column width={6}><Header as="h2">{t("cost")}</Header></Grid.Column>
              <Grid.Column width={10}><Header as="h2" dividing textAlign="right">{this.state.cost}</Header></Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column width={6}><Header as="h1">{t("total")}</Header></Grid.Column>
              <Grid.Column width={10}>
                <Header dividing as="h1" textAlign="right" color={this.props.theme.mainColor}>
                  {this.state.cost}
                </Header>
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <br />
          <Form>
            <Form.Field>
              <label>Поставщик</label>
              <SupplierPicker
                api={this.props.api}
                forwardRef={this.supplierPickerRef}
                value={this.state.supplierId}
                onPick={this.onSupplierChange}
              />
            </Form.Field>
            <Button floated="right" color={this.props.theme.mainColor} onClick={this.onActivate}>{t("acceptConsignment")} (Shift + Enter)</Button>
          </Form>
        </Segment>
      )}
      </Translation>
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
      </Fragment>
    )
  }
}

export default ConsignmentEditor

import UnitPicker      from "View/base/unit/picker"
import CurrencyPicker  from "View/base/currency/picker"

import InventoryList     from "./list"
import CategoryEditor  from "../category/editor"

import {
  ifNumberF,
  inputWithRef,
  numberInputWithRef,
}                     from "Util"

import React, { Fragment } from "react"
import { connect } from "react-redux"
import {
  Grid, Container, Input, Label, Button,
  Menu, Icon, Popup, Modal, Form, Message,
} from "semantic-ui-react"
import moment from "moment"
import { withTranslation } from "react-i18next"

class Inventory extends React.Component {

  constructor(props) {
    super(props)

    this.onItemEdited          = this.onItemEdited.bind(this)
    this.onFilterChange        = this.onFilterChange.bind(this)
    this.onPrevPage            = this.onPrevPage.bind(this)
    this.onNextPage            = this.onNextPage.bind(this)
    this.onExportToExcel       = this.onExportToExcel.bind(this)
    this.onPrintPreview        = this.onPrintPreview.bind(this)
    this.onSaveCorrections     = this.onSaveCorrections.bind(this)
    this.onShowOnlyCorrections = this.onShowOnlyCorrections.bind(this)

    this.onItemEditorActualQuantityChange = this.onItemEditorActualQuantityChange.bind(this)
    this.onItemEditorSellPriceChange      = this.onItemEditorSellPriceChange.bind(this)
    this.onItemEditorCostPriceChange      = this.onItemEditorCostPriceChange.bind(this)

    this.filterRef = React.createRef()
    this.filterInput = inputWithRef(this.filterRef)

    this.fileApi = props.api.file
    this.priceApi = props.api.price
    this.inventoryApi = props.api.inventory
    this.printPreviewApi = props.api.printPreview


    this.itemEditor = {}
    this.itemEditor.quantityInput       = numberInputWithRef()
    this.itemEditor.actualQuantityRef   = React.createRef()
    this.itemEditor.actualQuantityInput = numberInputWithRef(this.actualQuantityRef)
    this.itemEditor.sellPriceRef        = React.createRef()
    this.itemEditor.sellPriceInput      = numberInputWithRef(this.sellPriceRef)
    this.itemEditor.costPriceRef        = React.createRef()
    this.itemEditor.costPriceInput      = numberInputWithRef(this.costPriceRef)

    this.state = {
      inventoryId: -1,
      responsibleStaffId: -1,
      product: {},
      productList: { items: [] },
      totals: {
        itemCount: 0,
        totalCost: 0,
      },
      showOnlyCorrections: false,
      itemEditor: {
        show: false,
        actualQuantity: 0,
        sellPrice: 0,
        costPrice: 0,
      },
      search: {
        id: -1,
        pattern: "",
        limit: 30,
        offset: 0,
        category: { id: -1 },
      },
    }

    this.t = this.props.t
  }

  componentDidMount() {
    this.updateList()
  }

  onFilterChange(ev) {
    this.setFilter(ev.target.value, this.state.search.limit, this.state.search.offset, this.state.search.category)
  }

  onNextPage() {
    const lim = this.state.search.limit
    const ofs = this.state.search.offset
    const cnt = this.state.productList.items.length
    const inc = cnt < lim ? 0 : lim
    this.setFilter(this.state.search.pattern, lim, ofs + inc, this.state.search.category)
  }

  onPrevPage() {
    const lim = this.state.search.limit
    const ofs = this.state.search.offset
    const rem = this.state.productList.items.length
    const inc = ofs < lim ? ofs : lim
    this.setFilter(this.state.search.pattern, lim, ofs - inc, this.state.search.category)
  }

  onExportToExcel() {
    const dt = moment().format("YYYY-MM-DD-HH-ss")
    return this.fileApi.saveFile("prod-" + dt + ".xlsx", [ "xls", "xlsx" ])
      .then(file => {
        if (file) {
          return this.inventoryApi
            .exportAllToExcel(
              file,
              [
                this.props.opt.logoLine1,
                this.props.opt.logoLine2,
                this.props.opt.logoLine3,
                this.t("makedIn"),
                dt,
              ]
            )
        }
      })
  }

  onPrintPreview() {
    this.inventoryApi.find(this.state.inventoryId, this.state.showOnlyCorrections, "", 99999999, 0).then(({ items, totals }) => {
      const dt = moment().format("YYYY-MM-DD HH:mm")
      this.printPreviewApi.preview({
        view: "Inventory",
        data: {
          report: {
            items: items,
            totals: totals,
            printedAt: dt,
          },
          logo : [
            this.props.opt.logoLine1,
            this.props.opt.logoLine2,
            this.props.opt.logoLine3,
          ],
        }
      })
    })
  }

  updateList() {
    if (this.state.search.category.id < 0) {
      this.inventoryApi
        .find(
          this.state.inventoryId,
          this.state.showOnlyCorrections,
          this.state.search.pattern,
          this.state.search.limit,
          this.state.search.offset,
        )
        .then(({ items, totals }) => {
          this.setState({
            itemEditor: {
              ...this.state.itemEditor,
              show: false,
            },
            productList: { items: items },
            totals: totals,
          })
        })
        .then(_ => this.filterRef.current.focus())
    } else {
      this.inventoryApi
        .findInCategory(
          this.state.inventoryId,
          this.state.showOnlyCorrections,
          this.state.search.category,
          this.state.search.pattern,
          this.state.search.limit,
          this.state.search.offset,
        )
        .then(({ items, totals }) => {
          this.setState({
            itemEditor: {
              ...this.state.itemEditor,
              show: false,
            },
            productList: { items: items },
            totals: totals,
          })
        })
        .then(_ => this.filterRef.current.focus())
    }
  }

  setFilter(pattern, limit, offset, category = { id: -1 }) {
    if (this.state.search.id > 0) { clearTimeout(this.state.search.id) }
    this.setState({
      search: {
        pattern: pattern,
        limit: limit,
        offset: offset,
        category: category,
        id: setTimeout(
          () => {
            clearTimeout(this.state.search.id)
            this.updateList()
          },
          200
        )
      }
    })
  }

  onItemEdited() {
    const upsert = () =>{
      this.inventoryApi.upsertInventoryItem({
        inventoryId: this.state.inventoryId,
        productId: this.state.product.id,
        productTitle: this.state.product.title,
        quantity: this.state.product.quantity,
        actualQuantity: this.state.itemEditor.actualQuantity,
        sellPrice: this.state.itemEditor.sellPrice,
        costPrice: this.state.itemEditor.costPrice,
        unitId: this.state.product.unitId,
        currencyId: this.state.product.sellPriceCurrencyId || 1,
      }).then(_ => {
        this.updateList()
      })
    }
    if (this.state.itemEditor.sellPrice != this.state.product.sellPrice) {
      this.priceApi.setPrice({
          productId  : this.state.product.id,
          price      : +this.state.itemEditor.sellPrice,
          currencyId : this.state.product.sellPriceCurrencyId || 1,
        }).then(_ => upsert())
    } else {
      upsert()
    }
  }

  onItemEditorActualQuantityChange(ev) {
    ifNumberF(ev, value => {
      this.setState({
        itemEditor: {
          ...this.state.itemEditor,
          actualQuantity: value,
        }
      })
    })
  }

  onItemEditorSellPriceChange(ev) {
    ifNumberF(ev, value => {
      this.setState({
        itemEditor: {
          ...this.state.itemEditor,
          sellPrice: value,
        }
      })
    })
  }

  onItemEditorCostPriceChange(ev) {
    ifNumberF(ev, value => {
      this.setState({
        itemEditor: {
          ...this.state.itemEditor,
          costPrice: value,
        }
      })
    })
  }

  onCategorySelected(category) {
    this.setFilter(this.state.search.pattern, 30, 0, category)
  }

  onShowOnlyCorrections() {
    if (!this.state.showOnlyCorrections) {
      this.setState({
        search: {
          ...this.state.search,
          limit: 30,
          offset: 0,
        },
        showOnlyCorrections: !this.state.showOnlyCorrections,
      }, () => this.updateList())
    } else {
      this.setState({
        showOnlyCorrections: !this.state.showOnlyCorrections,
      }, () => this.updateList())
    }
  }

  onSaveCorrections() {
    this.inventoryApi.closeInventory({
      responsibleStaffId: this.state.responsibleStaffId,
      inventoryId: this.state.inventoryId,
    }).then(_ =>
        this.setState({
          showConfirmation: false,
        }, () => this.updateList())
    )
  }

  openInventoryItemEditor(product, idx) {
    this.setState({
      product: product,
      itemEditor: {
        show: true,
        actualQuantity: product.actualQuantity,
        sellPrice: product.sellPrice,
        costPrice: product.costPrice,
      }
    })
  }

  list() {
    return (
      <InventoryList
        theme={this.props.theme}
        items={this.state.productList.items}
        onItemClick={(product, idx) => this.openInventoryItemEditor(product, idx)}
        showCategory={this.state.search.category.id < 0}
        offset={this.state.search.offset}
      />
    )
  }

  quantityEditor() {
    return (
      <Modal
        open={this.state.itemEditor.show}
        centered={false}
        size="mini"
        onClose={() => this.setState({ itemEditor: { show: false } })}
      >
        <Modal.Header>{this.t("correction")}</Modal.Header>
        <Modal.Content>
          <Form size="large" width={16} onKeyDown={this.onKeyDown}>
            <Message content={[this.state.product.title, this.state.product.brand].filter(x => x && x.length > 0).join(":")} info />
            <Form.Group>
              <Form.Input
                width={10}
                label={this.t("quantity")}
                value={this.state.product.quantity || 0}
                control={this.itemEditor.quantityInput}
                readOnly
              />
              <Form.Field width={6}>
                <label>{this.t("unitTitle")}</label>
                <UnitPicker
                  size="large"
                  api={this.props.api}
                  value={this.state.product.unitId}
                  isDisabled={true}
                />
              </Form.Field>
            </Form.Group>
            <Form.Group>
              <Form.Input
                autoFocus
                width={10}
                label={this.t("actualQuantity")}
                onChange={this.onItemEditorActualQuantityChange}
                value={this.state.itemEditor.actualQuantity || 0}
                control={this.itemEditor.actualQuantityInput}
              />
              <Form.Field width={6}>
                <label>{this.t("unitTitle")}</label>
                <UnitPicker
                  size="large"
                  api={this.props.api}
                  value={this.state.product.unitId}
                  isDisabled={true}
                />
              </Form.Field>
            </Form.Group>
            <Form.Group>
              <Form.Input
                width={10}
                label={this.t("byCostPrice")}
                onChange={this.onItemEditorCostPriceChange}
                value={this.state.itemEditor.costPrice || 0}
                control={this.itemEditor.costPriceInput}
              />
              <Form.Field width={6}>
                <label>{this.t("currency")}</label>
                <CurrencyPicker
                  size="large"
                  api={this.props.api}
                  value={this.state.product.sellPriceCurrencyId || 1}
                  isDisabled={true}
                />
              </Form.Field>
            </Form.Group>
            <Form.Group>
              <Form.Input
                width={10}
                label={this.t("sellPrice")}
                onChange={this.onItemEditorSellPriceChange}
                value={this.state.itemEditor.sellPrice || 0}
                control={this.itemEditor.sellPriceInput}
              />
              <Form.Field width={6}>
                <label>{this.t("currency")}</label>
                <CurrencyPicker
                  size="large"
                  api={this.props.api}
                  value={this.state.product.sellPriceCurrencyId || 1}
                  isDisabled={true}
                />
              </Form.Field>
            </Form.Group>
            <Button fluid type="button" color={this.props.theme.mainColor} onClick={this.onItemEdited}>{this.t("insertCorrection")}</Button>
          </Form>
        </Modal.Content>
      </Modal>
    )
  }

  confirmation() {
    return (
      <Modal
        size="mini"
        open={this.state.showConfirmation}
        onClose={() => this.setState({ showConfirmation: false })}
      >
        <Modal.Header>{this.t("saveCorrections")}</Modal.Header>
        <Modal.Content>
          <p>{this.t("saveCorrections?")}</p>
        </Modal.Content>
        <Modal.Actions>
          <Button negative onClick={() => this.setState({ showConfirmation: false })}>{this.t("no")}</Button>
          <Button positive onClick={() => this.onSaveCorrections()}>{this.t("yes")}</Button>
        </Modal.Actions>
      </Modal>
    )
  }

  render() {
    return (
      <Fragment>
        <Container
          fluid
          style={{
            flex: "1 1 auto",
            overflow: "auto",
            paddingLeft: 10,
            paddingRight: 10,
            marginBottom: 20
          }}
        >
          <Grid>
            <Grid.Row> 
              <Grid.Column width={3}>
                <CategoryEditor
                  api={this.props.api}
                  theme={this.props.theme}
                  opt={this.props.opt}
                  onCategorySelected={(c) => this.onCategorySelected(c)}
                />
              </Grid.Column>
              <Grid.Column width={13}>
                <Menu icon>
                  <Menu.Item>
                    {this.filterInput({
                      autoFocus: true,
                      icon     : "search",
                      style    : { width: 300 },
                      value    : this.state.search.pattern,
                      onChange : this.onFilterChange,
                    })}
                  </Menu.Item>
                  <Popup content={this.t("prevPage")} trigger= { <Menu.Item onClick={this.onPrevPage}><Icon name="angle left"  /></Menu.Item> } />
                  <Popup content={this.t("nextPage")} trigger= { <Menu.Item onClick={this.onNextPage}><Icon name="angle right" /></Menu.Item> } />

                  <Menu.Item>{this.t("diffedCount")}: {this.state.totals.itemCount}</Menu.Item>
                  <Menu.Item>{this.t("totalCost")}: {this.state.totals.totalCost}</Menu.Item>
                  <Popup content={this.t("showOnlyCorrections")} trigger= {
                    <Menu.Item onClick={this.onShowOnlyCorrections} active={this.state.showOnlyCorrections}><Icon name="edit outline" /></Menu.Item> } />
                  <Popup content={this.t("saveCorrections")} trigger= {
                    <Menu.Item onClick={() => this.setState({ showConfirmation: true })}><Icon name="save" /></Menu.Item> } />

                  <Menu.Menu position="right">
                    {/*
                    <Popup content={this.t("saveToExcel")} trigger= { <Menu.Item onClick={this.onExportToExcel}><Icon name="file excel" /></Menu.Item> } />
                    */}
                    <Popup content={this.t("printPreview")} trigger= { <Menu.Item onClick={this.onPrintPreview}><Icon name="print" /></Menu.Item> } />
                  </Menu.Menu>
                </Menu>
                {this.list()}
              </Grid.Column>
            </Grid.Row> 
          </Grid>
        </Container>
        {this.quantityEditor()}
        {this.confirmation()}
      </Fragment>
    )
  }
}

export default (withTranslation("inventory")(Inventory))

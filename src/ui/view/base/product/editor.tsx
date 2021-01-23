import UnitPicker     from "View/base/unit/picker"
import CategoryPicker from "View/base/category/picker"

import ProductForm     from "./form"
import ProductList     from "./list"
import CategoryEditor  from "../category/editor"

import { ProductActions } from "Store/base/product"

import {
  inputWithRef,
}                     from "Util"

import React, { Fragment } from "react"
import { connect } from "react-redux"
import {
  Grid, Container, Input, Label, Button,
  Menu, Icon, Popup,
} from "semantic-ui-react"
import moment from "moment"
import { withTranslation } from "react-i18next"

class ProductEditor extends React.Component {

  emptyProduct = {
    id            : -1,
    title         : "",
    unitId        : "",
    unitTitle     : "",
    categoryId    : "",
    categoryTitle : "",
    barcode       : "",
    serial        : "",
    brand         : "",
  }

  constructor(props) {
    super(props)

    this.onCreate         = this.onCreate.bind(this)
    this.onUpdate         = this.onUpdate.bind(this)
    this.onFilterChange   = this.onFilterChange.bind(this)
    this.onPrevPage       = this.onPrevPage.bind(this)
    this.onNextPage       = this.onNextPage.bind(this)
    this.onExportToExcel  = this.onExportToExcel.bind(this)
    this.onPrintPreview   = this.onPrintPreview.bind(this)

    this.newProduct       = this.newProduct.bind(this)
    this.openProductForm  = this.openProductForm.bind(this)
    this.closeProductForm = this.closeProductForm.bind(this)

    this.filterRef = React.createRef()
    this.filterInput = inputWithRef(this.filterRef)

    this.fileApi    = props.api.file
    this.productApi = props.api.product
    this.printPreviewApi = props.api.printPreview

    this.state = {
      product: {
        unitId     : props.opt.defaultUnitId,
        categoryId : props.opt.defaultCategoryId,
        ...this.emptyProduct
      },
      productList: { items: [] },
      formVisible: false,
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

  onCreate() {
    this.closeProductForm()
    this.updateList()
  }

  onUpdate() {
    this.closeProductForm()
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
          return this.productApi
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
    this.productApi.find("", 99999999, 0).then(items => {
      const dt = moment().format("YYYY-MM-DD-HH-ss")
      this.printPreviewApi.preview({
        view: "Stocks",
        data: {
          report: {
            items: items,
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
      this.productApi
        .find(
          this.state.search.pattern,
          this.state.search.limit,
          this.state.search.offset,
        )
        .then(items => {
          this.setState({
            productList: { items: items }
          })
        })
        .then(_ => this.filterRef.current.focus())
    } else {
      this.productApi
        .findInCategory(
          this.state.search.category,
          this.state.search.pattern,
          this.state.search.limit,
          this.state.search.offset,
        )
        .then(items => {
          this.setState({
            productList: { items: items },
          })
        })
        .then(_ => this.filterRef.current.focus())
    }
  }

  openProductForm(product, idx) {
    this.setState({
      product: product,
      formVisible: true,
    })
  }

  closeProductForm() {
    this.setState({
      formVisible: false,
    }, () => {
      this.filterRef.current.focus()
    })
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

  newProduct() {
    this.props.api.product.genBarcode(this.props.opt.barcodePrefix)
      .then(barcode => this.setState({
        product: Object.assign({}, this.emptyProduct, {
          barcode    : barcode,
          unitId     : this.props.opt.defaultUnitId,
          categoryId : this.props.opt.defaultCategoryId,
        }),
        formVisible: true,
      }))
  }

  onCategorySelected(category) {
    this.setFilter(this.state.search.pattern, 30, 0, category)
  }

  form() {
    return (
      <ProductForm
        open
        api={this.props.api}
        opt={this.props.opt}
        theme={this.props.theme}
        product={this.state.product}
        onCreate={this.onCreate}
        onUpdate={this.onUpdate}
        onClose={this.closeProductForm}
      />
    )
  }

  list() {
    return (
      <ProductList
        items={this.state.productList.items}
        onProductOpen={this.openProductForm}
        showCategory={this.state.search.category.id < 0}
        offset={this.state.search.offset}
      />
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
                  <Menu.Menu position="right">
                    <Popup content={this.t("saveToExcel")} trigger= { <Menu.Item onClick={this.onExportToExcel}><Icon name="file excel" /></Menu.Item> } />
                    <Popup content={this.t("printPreview")} trigger= { <Menu.Item onClick={this.onPrintPreview}><Icon name="print" /></Menu.Item> } />
                    <Popup content={this.t("newProduct")}  trigger= { <Menu.Item onClick={this.newProduct}>     <Icon name="plus" />      </Menu.Item> } />
                  </Menu.Menu>
                </Menu>
                {this.list()}
              </Grid.Column>
            </Grid.Row> 
          </Grid>
        </Container>
        {this.state.formVisible && this.form()}
      </Fragment>
    )
  }
}

const stateMap = (state) => {
  return {
    productList: state.product.productList
  }
}

export default connect(stateMap, {
  ...ProductActions,
})(withTranslation("productEditor")(ProductEditor))

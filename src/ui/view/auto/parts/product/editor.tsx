import UnitPicker     from "View/base/unit/picker"
import CategoryPicker from "View/base/category/picker"

import ProductForm     from "./form"
import ProductList     from "./list"

import { AutoPartsProductActions } from "Store/auto/parts/product"

import {
  inputWithRef,
}                     from "Util"

import React, { Fragment } from "react"
import { connect } from "react-redux"
import {
  Grid, Container, Input, Label, Button,
  Menu, Icon,
} from "semantic-ui-react"

class ProductEditor extends React.Component {

  emptyProduct = {
    id            : -1,
    title         : "",
    unitId        : "",
    unitTitle     : "",
    categoryId    : "",
    categoryTitle : "",
    barcode       : "",
    model         : "",
    engine        : "",
    oemNo         : "",
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

    this.newProduct       = this.newProduct.bind(this)
    this.openProductForm  = this.openProductForm.bind(this)
    this.closeProductForm = this.closeProductForm.bind(this)

    this.filterRef = React.createRef()
    this.filterInput = inputWithRef(this.filterRef)

    this.state = {
      product: {
        unitId     : props.opt.defaultUnitId,
        categoryId : props.opt.defaultCategoryId,
        ...this.emptyProduct
      },
      formVisible: false,
      search: {
        id: -1,
        pattern: "",
        limit: 20,
        offset: 0,
      },
    }
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
    this.setFilter(ev.target.value, this.state.search.limit, this.state.search.offset)
  }

  onNextPage() {
    const lim = this.state.search.limit
    const ofs = this.state.search.offset
    const cnt = this.props.productList.items.length
    const inc = cnt < lim ? 0 : lim
    this.setFilter(this.state.search.pattern, lim, ofs + inc)
  }

  onPrevPage() {
    const lim = this.state.search.limit
    const ofs = this.state.search.offset
    const rem = this.props.productList.items.length
    const inc = ofs < lim ? ofs : lim
    this.setFilter(this.state.search.pattern, lim, ofs - inc)
  }

  updateList() {
    this.props.filterProductList(
        this.state.search.pattern,
        this.state.search.limit,
        this.state.search.offset,
      )
      .then(_ => this.filterRef.current.focus())
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

  setFilter(pattern, limit, offset) {
    if (this.state.search.id > 0) { clearTimeout(this.state.search.id) }
    this.setState({
      search: {
        pattern: pattern,
        limit: limit,
        offset: offset,
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
    this.props.api.autoParts.product.genBarcode(this.props.opt.barcodePrefix)
      .then(barcode => this.setState({
        product: Object.assign({}, this.emptyProduct, {
          barcode    : barcode,
          unitId     : this.props.opt.defaultUnitId,
          categoryId : this.props.opt.defaultCategoryId,
        }),
        formVisible: true,
      }))
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
        items={this.props.productList.items}
        onProductOpen={this.openProductForm}
      />
    )
  }

  render() {
    return (
      <Fragment>
        <Container style={{ marginLeft: 10, marginRight: 10, padding: 10 }}>
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
            <Menu.Item onClick={this.onPrevPage}><Icon name="angle left"  /></Menu.Item>
            <Menu.Item onClick={this.onNextPage}><Icon name="angle right" /></Menu.Item>
            <Menu.Item onClick={this.newProduct} position="right"><Icon name="plus" /></Menu.Item>
          </Menu>
        </Container>
        {this.state.formVisible && this.form()}
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
          {this.list()}
        </Container>
      </Fragment>
    )
  }
}

const stateMap = (state) => {
  return {
    productList: state.autoParts.product.productList
  }
}

export default connect(stateMap, {
  ...AutoPartsProductActions,
})(ProductEditor)

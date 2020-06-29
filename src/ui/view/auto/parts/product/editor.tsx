import UnitPicker     from "View/base/unit/picker"
import CategoryPicker from "View/base/category/picker"

import ProductForm     from "./form"
import ProductList     from "./list"

import { AutoPartsProductActions } from "Store/auto/parts/product"


import React, { Fragment } from "react"
import { connect } from "react-redux"
import {
  Grid, Container, Input, Label, Button,
  Menu,
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

    this.newProduct       = this.newProduct.bind(this)
    this.openProductForm  = this.openProductForm.bind(this)
    this.closeProductForm = this.closeProductForm.bind(this)

    this.state = {
      product: this.emptyProduct,
      formVisible: false,
      search: {
        id: -1,
        pattern: "",
      },
    }
  }

  componentDidMount() {
    this.props.filterProductList(this.state.search.pattern)
  }

  onCreate() {
    this.closeProductForm()
    this.props.filterProductList(this.state.search.pattern)
  }

  onUpdate() {
    this.closeProductForm()
    this.props.filterProductList(this.state.search.pattern)
  }

  onFilterChange(ev) {
    this.setFilter(ev.target.value)
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
    })
  }

  setFilter(pattern) {
    if (this.state.search.id > 0) { clearTimeout(this.state.search.id) }
    this.setState({
      search: {
        pattern: pattern,
        id: setTimeout(
          () => {
            clearTimeout(this.state.search.id)
            this.props.filterProductList(this.state.search.pattern)
          },
          200
        )
      }
    })
  }

  newProduct() {
    this.props.api.autoParts.product.genBarcode()
      .then(barcode => this.setState({
        product: Object.assign({}, this.emptyProduct, {
          barcode: barcode,
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
      <Container fluid style={{ padding: 10 }}>
        <Menu>
          <Menu.Item>
            <Input
              icon="search"
              style={{ width: 300 }}
              value={this.state.search.pattern}
              onChange={this.onFilterChange}
            />
          </Menu.Item>
          <Menu.Item position="right">
            <Button
              floated="right"
              icon="plus"
              onClick={this.newProduct}
            />
          </Menu.Item>
        </Menu>
        {this.state.formVisible && this.form()}
        <Container fluid>
          {this.list()}
        </Container>
      </Container>
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

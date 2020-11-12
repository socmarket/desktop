import React from "react"
import { Table, Icon } from "semantic-ui-react"
import { withTranslation } from "react-i18next"

class ProductList extends React.Component {

  constructor(props) {
    super(props)
    this.t = this.props.t
  }

  table(height) {
    return (
      <Table compact celled selectable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>#</Table.HeaderCell>
            <Table.HeaderCell>{this.t("name")}</Table.HeaderCell>
            <Table.HeaderCell>{this.t("brand")}</Table.HeaderCell>
            <Table.HeaderCell>{this.t("quantity")}</Table.HeaderCell>
            <Table.HeaderCell>{this.t("unit")}</Table.HeaderCell>
            { this.props.showCategory && <Table.HeaderCell>{this.t("category")}</Table.HeaderCell> }
            <Table.HeaderCell>{this.t("barcode")}</Table.HeaderCell>
            <Table.HeaderCell><Icon name="map marker alternate" /></Table.HeaderCell>
            <Table.HeaderCell>{this.t("notes")}</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          { this.props.items.map((product, idx) => (
            <Table.Row key={product.id} onClick={() => this.props.onProductOpen(product, idx)}
              {...(product.quantity < 0 ? {negative: true} : {})}
              {...(product.quantity == 0 ? {warning: true} : {})}
            >
              <Table.Cell textAlign="right">{idx + this.props.offset + 1}</Table.Cell>
              <Table.Cell style={{whiteSpace: "nowrap"}}>{product.title}</Table.Cell>
              <Table.Cell>{product.brand}</Table.Cell>
              <Table.Cell textAlign="right">{product.quantity}</Table.Cell>
              <Table.Cell>{product.unitNotation}</Table.Cell>
              { this.props.showCategory && <Table.Cell>{product.categoryTitle}</Table.Cell> }
              <Table.Cell>{product.barcode}</Table.Cell>
              <Table.Cell>{product.coord}</Table.Cell>
              <Table.Cell>{product.notes}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    )
  }

  render() {
    return this.table()
  }

}

export default (withTranslation("productList")(ProductList))

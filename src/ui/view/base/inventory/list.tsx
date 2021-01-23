import React from "react"
import { Table, Icon } from "semantic-ui-react"
import { withTranslation } from "react-i18next"

class InventoryList extends React.Component {

  constructor(props) {
    super(props)
    this.t = this.props.t
  }

  table(height) {
    return (
      <Table compact celled selectable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell rowSpan={2} textAlign="center">#</Table.HeaderCell>
            <Table.HeaderCell rowSpan={2} textAlign="center">{this.t("name")}</Table.HeaderCell>
            <Table.HeaderCell colSpan={3} textAlign="center">{this.t("quantity")}</Table.HeaderCell>
            <Table.HeaderCell rowSpan={2} textAlign="center">{this.t("unit")}</Table.HeaderCell>
            <Table.HeaderCell colSpan={2} textAlign="center">{this.t("price")}</Table.HeaderCell>
            { this.props.showCategory && <Table.HeaderCell rowSpan={2} textAlign="center">{this.t("category")}</Table.HeaderCell> }
            <Table.HeaderCell rowSpan={2} textAlign="center">{this.t("barcode")}</Table.HeaderCell>
          </Table.Row>
          <Table.Row>
            <Table.HeaderCell textAlign="center">{this.t("calculatedQuantity")}</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">{this.t("actualQuantity")}</Table.HeaderCell>
            <Table.HeaderCell textAlign="center" warning>{this.t("quantityDifference")}</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">{this.t("costPrice")}</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">{this.t("sellPrice")}</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          { this.props.items.map((product, idx) => {
            return (
              <Table.Row key={product.id} onClick={() => this.props.onItemClick(product, idx)}
                {...(product.quantity > product.actualQuantity ? {negative: true} : {})}
                {...(product.quantity < product.actualQuantity ? {warning: true} : {})}
              >
                <Table.Cell textAlign="right">{idx + this.props.offset + 1}</Table.Cell>
                <Table.Cell style={{whiteSpace: "nowrap"}}>{product.title}</Table.Cell>
                <Table.Cell textAlign="right">{product.quantity}</Table.Cell>
                <Table.Cell textAlign="right">{product.actualQuantity}</Table.Cell>
                <Table.Cell textAlign="right">{product.quantityDifference}</Table.Cell>
                <Table.Cell>{product.unitNotation}</Table.Cell>
                <Table.Cell textAlign="right">{product.costPrice}</Table.Cell>
                <Table.Cell textAlign="right">{product.sellPrice}</Table.Cell>
                { this.props.showCategory && <Table.Cell>{product.categoryTitle}</Table.Cell> }
                <Table.Cell>{product.barcode}</Table.Cell>
              </Table.Row>
            )
          })}
        </Table.Body>
      </Table>
    )
  }

  render() {
    return this.table()
  }

}

export default (withTranslation("inventoryList")(InventoryList))

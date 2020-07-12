import React from "react";
import { Table, Icon } from "semantic-ui-react"

class ProductList extends React.Component {

  constructor(props) {
    super(props)
  }

  table(height) {
    return (
      <Table compact celled selectable style={{ height: "100%" }}>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Кат</Table.HeaderCell>
            <Table.HeaderCell>Название</Table.HeaderCell>
            <Table.HeaderCell>Ед</Table.HeaderCell>
            <Table.HeaderCell>Модель</Table.HeaderCell>
            <Table.HeaderCell>Движок</Table.HeaderCell>
            <Table.HeaderCell>Штрихкод</Table.HeaderCell>
            <Table.HeaderCell>Бренд</Table.HeaderCell>
            <Table.HeaderCell>OEM</Table.HeaderCell>
            <Table.HeaderCell><Icon name="map marker alternate" /></Table.HeaderCell>
            <Table.HeaderCell>Заметки</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          { this.props.items.map((product, idx) => (
            <Table.Row key={product.id} onClick={() => this.props.onProductOpen(product, idx)}>
              <Table.Cell>{product.categoryTitle}</Table.Cell>
              <Table.Cell style={{whiteSpace: "nowrap"}}>{product.title}</Table.Cell>
              <Table.Cell>{product.unitTitle}</Table.Cell>
              <Table.Cell>{product.model}</Table.Cell>
              <Table.Cell>{product.engine}</Table.Cell>
              <Table.Cell>{product.barcode}</Table.Cell>
              <Table.Cell>{product.brand}</Table.Cell>
              <Table.Cell>{product.oemNo}</Table.Cell>
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

export default ProductList

import React, { Fragment } from "react";
import { connect } from "react-redux";
import { ProductActions } from "serv/product"
import { Menu, Input, Button, Table, Segment, Container } from "semantic-ui-react"

import ProductCard from "./card"

class ProductList extends React.Component {

  constructor(props) {
    super(props);
    this.handleFilterChange = this.handleFilterChange.bind(this);
  }

  componentDidMount() {
    this.props.setProductListFilter(this.props.productList.filterPattern);
  }

  handleFilterChange(event) {
    this.props.setProductListFilter(event.target.value);
  }

  private table() {
    return (
      <Table compact celled selectable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Штрихкод</Table.HeaderCell>
            <Table.HeaderCell>Название</Table.HeaderCell>
            <Table.HeaderCell>Артикул</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          { this.props.productList.items.map(product => (
            <Table.Row key={product.id}>
              <Table.Cell>{product.barcode}</Table.Cell>
              <Table.Cell>{product.title}</Table.Cell>
              <Table.Cell>{product.code}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    );
  }

  private menu() {
    return (
      <Menu>
        <Menu.Item>
          <h4>Номенклатура</h4>
        </Menu.Item>
        <Menu.Item style={{ flexGrow: 1 }}>
          <Input
            className="icon"
            icon="search"
            value={this.props.productList.filterPattern}
            onChange={this.handleFilterChange}
          />
        </Menu.Item>
        <Menu.Item position="right">
          <Button.Group>
            <Button icon="angle down" />
            <Button icon="angle up" />
          </Button.Group>
        </Menu.Item>
      </Menu>
    );
  }

  render() {
    return (
      <Container>
        {this.menu()}
        <Segment>
          <ProductCard />
        </Segment>
        {this.table()}
      </Container>
    );
  }
}

const stateMap = (state) => {
  return { productList: state.productList };
}

export default connect(stateMap, ProductActions)(ProductList);


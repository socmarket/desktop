import React, { Fragment } from "react";
import { connect } from "react-redux";
import { Menu, Input, Button, Table, Segment, Container } from "semantic-ui-react"

import ProductCard from "./card"
import { ProductActions } from "../../serv/product"

class ProductList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      formHeight: 0,
    };
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.productForm = React.createRef(); 
  }

  componentDidMount() {
    this.props.setProductListFilter(this.props.productList.filterPattern);
  }

  componentDidUpdate() {
    if (this.productForm.current && this.state.formHeight !== this.productForm.current.clientHeight + 15) {
      this.setState({
        formHeight: this.productForm.current.clientHeight + 15,
      });
    }
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
            <Table.HeaderCell>№</Table.HeaderCell>
            <Table.HeaderCell>Описание</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          { this.props.productList.items.map(product => (
            <Table.Row key={product.id}>
              <Table.Cell>{product.barcode}</Table.Cell>
              <Table.Cell>{product.title}</Table.Cell>
              <Table.Cell>{product.code}</Table.Cell>
              <Table.Cell>{product.notes}</Table.Cell>
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
            { !this.props.productList.showForm && <Button icon="angle down" onClick={() => this.props.showProductForm()} /> }
            { this.props.productList.showForm && <Button icon="angle up" onClick={() => this.props.hideProductForm()} /> }
          </Button.Group>
        </Menu.Item>
      </Menu>
    );
  }

  render() {
    const formVisible = this.props.productList.showForm;
    const minHeight = 200;
    const maxHeight = formVisible ? 200 : 200 + this.state.formHeight;
    return (
      <Container>
        {this.menu()}
        { this.props.productList.showForm &&
          <div ref={this.productForm} className="ui segment">
            <ProductCard/>
          </div>
        }
        <Container style={{ minHeight: minHeight, maxHeight: maxHeight, overflowY: "scroll"}}>
          {this.table()}
        </Container>
      </Container>
    );
  }
}

const stateMap = (state) => {
  return { productList: state.productList };
}

export default connect(stateMap, ProductActions)(ProductList);


import React, { Fragment } from "react";
import { connect } from "react-redux";
import { ProductActions } from "serv/product"
import { Grid, Input, Button, Segment, Table, Container } from "semantic-ui-react"

class ProductList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      filter: ""
    };
    this.handleFilterChange = this.handleFilterChange.bind(this);
  }

  componentDidMount() {
    this.props.getList("");
  }

  handleFilterChange(event) {
    this.setState(Object.assign({}, this.state, {
      filter: event.target.value
    }));
    this.props.getList(event.target.value);
  }

  private table() {
    return (
      <Table compact>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Штрихкод</Table.HeaderCell>
            <Table.HeaderCell>Название</Table.HeaderCell>
            <Table.HeaderCell>Артикул</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          { this.props.product.products.map(product => (
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

  render() {
    return (
      <Container>
        <Input fluid value={this.state.filter} onChange={this.handleFilterChange} />
        {this.table()}
      </Container>
    );
  }
}

const stateMap = (state) => {
  return { product: state.product };
}

export default connect(stateMap, ProductActions)(ProductList);


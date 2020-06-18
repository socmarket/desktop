import React, { Fragment } from "react";
import { connect } from "react-redux";
import { Grid, Menu, Input, Button, Table, Segment, Container } from "semantic-ui-react"

import ProductCard from "./card"
import { ProductActions } from "../../serv/product"

class ProductList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      formHeight: 0,
      searchId: -1,
      filterPattern: "",
    };
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.setFilter = this.setFilter.bind(this);
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

  setFilter(filterPattern) {
    const self = this;
    if (self.state.searchId > 0) {
      clearTimeout(self.state.searchId);
    }
    self.setState({
      filterPattern: filterPattern,
      searchId: setTimeout(
        () => {
          clearTimeout(self.state.searchId);
          self.props.setProductListFilter(self.state.filterPattern);
        },
        200
      )
    });
  }

  handleFilterChange(event) {
    const filterPattern = event.target.value;
    this.setFilter(filterPattern);
  }

  private table(height) {
    return (
      <Container style={{ minHeight: height, maxHeight: height, overflowY: "auto" }}>
        <Table compact celled selectable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Кат</Table.HeaderCell>
              <Table.HeaderCell>Название</Table.HeaderCell>
              <Table.HeaderCell>Штрихкод</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            { this.props.productList.items.map(product => (
              <Table.Row key={product.id}>
                <Table.Cell>{product.categoryTitle}</Table.Cell>
                <Table.Cell>{product.title}</Table.Cell>
                <Table.Cell>{product.barcode}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Container>
    );
  }

  render() {
    const height = this.state.formHeight;
    return (
      <Grid>
        <Grid.Column width={8}>
          <div ref={this.productForm} className="ui segment">
            {this.menu()}
            <ProductCard setFilter={this.setFilter} visible={this.props.productList.showForm} />
          </div>
        </Grid.Column>
        <Grid.Column width={8}>
          {this.table(height)}
        </Grid.Column>
      </Grid>
    );
  }
}

const stateMap = (state) => {
  return { productList: state.productList };
}

export default connect(stateMap, ProductActions)(ProductList);

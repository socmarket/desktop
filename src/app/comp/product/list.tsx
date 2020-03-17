import React, { Fragment } from "react";
import { connect } from "react-redux";
import { AppActions } from "serv/app"
import { Grid, Input, Button, Segment, Table, Container } from "semantic-ui-react"

class ProductList extends React.Component {
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
          <Table.Row>
            <Table.Cell>John</Table.Cell>
            <Table.Cell>Approved</Table.Cell>
            <Table.Cell>None</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Jamie</Table.Cell>
            <Table.Cell>Approved</Table.Cell>
            <Table.Cell>Requires call</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    );
  }

  render() {
    return (
      <Container>
        <Input fluid attached />
        {this.table()}
      </Container>
    );
  }
}

const stateMap = (state) => {
  return {};
}

export default connect(stateMap, AppActions)(ProductList);


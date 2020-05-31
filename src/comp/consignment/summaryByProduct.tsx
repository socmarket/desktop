import React, { Fragment } from "react";
import { connect } from "react-redux";
import moment from "moment";
import { ResponsivePie } from '@nivo/pie'
import { Container, Menu, Grid, Form, Input, Table, Button, Segment, Image, Label } from "semantic-ui-react"
import { AppActions } from "../../serv/app"
import { ConsignmentActions } from "../../serv/consignment"

class ConsignmentSummaryByProduct extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const product = this.props.summaryByProduct.product;
    const items = this.props.summaryByProduct.items;
    return (
      <Table compact celled selectable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell colSpan={3}>
              История
              <br />
              {product.categoryTitle} : {product.title} : {product.barcode}
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Дата</Table.HeaderCell>
            <Table.HeaderCell>Цена</Table.HeaderCell>
            <Table.HeaderCell>Кол-во</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          { items.map( (item, idx) => (
            <Table.Row key={idx}>
              <Table.Cell>
                {moment.utc(item.acceptedAt).local().format("DD-MM-YYYY HH:mm")}
              </Table.Cell>
              <Table.Cell textAlign="right">{item.price}</Table.Cell>
              <Table.Cell textAlign="right">{item.quantity}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    );
  }

}

const stateMap = (state) => {
  return {
    summaryByProduct: state.consignment.summaryByProduct,
  };
}

export default connect(stateMap, { ...ConsignmentActions })(ConsignmentSummaryByProduct);



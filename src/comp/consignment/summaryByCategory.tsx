import React, { Fragment } from "react";
import { connect } from "react-redux";
import moment from "moment";
import { ResponsivePie } from '@nivo/pie'
import { Container, Menu, Grid, Form, Input, Table, Button, Segment, Image, Label } from "semantic-ui-react"
import { AppActions } from "../../serv/app"
import { ConsignmentActions } from "../../serv/consignment"

class ConsignmentSummaryByCategory extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.reloadSummaryByCategory();
  }

  render() {
    const summaryByCategory = this.props.summaryByCategory;
    return (
      <Table compact celled selectable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Категория</Table.HeaderCell>
            <Table.HeaderCell>Позиций</Table.HeaderCell>
            <Table.HeaderCell>Товаров</Table.HeaderCell>
            <Table.HeaderCell>Сумма</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Всего</Table.HeaderCell>
            <Table.HeaderCell textAlign="right">{summaryByCategory.summary.uniqueQuantity}</Table.HeaderCell>
            <Table.HeaderCell textAlign="right">{summaryByCategory.summary.quantity}</Table.HeaderCell>
            <Table.HeaderCell textAlign="right">{summaryByCategory.summary.cost}</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          { summaryByCategory.items.map( (item, idx) => (
            <Table.Row key={idx}>
              <Table.Cell>{item.categoryTitle}</Table.Cell>
              <Table.Cell textAlign="right">{item.uniqueQuantity}</Table.Cell>
              <Table.Cell textAlign="right">{item.quantity}</Table.Cell>
              <Table.Cell textAlign="right">{item.cost}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    );
  }

}

const stateMap = (state) => {
  return {
    summaryByCategory: state.consignment.summaryByCategory,
  };
}

export default connect(stateMap, { ...ConsignmentActions })(ConsignmentSummaryByCategory);


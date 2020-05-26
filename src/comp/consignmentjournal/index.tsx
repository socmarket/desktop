import React, { Fragment } from "react";
import { connect } from "react-redux";
import moment from "moment";
import { ResponsivePie } from '@nivo/pie'
import { Container, Menu, Grid, Form, Input, Table, Button, Segment, Image, Label } from "semantic-ui-react"
import { AppActions } from "../../serv/app"
import { ConsignmentJournalActions } from "../../serv/consignmentjournal"

class ConsignmentJournal extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.reloadConsignmentJournal();
  }

  render() {
    const data = this.props.consignmentJournal.items;
    return (
      <Grid padded>
        <Grid.Column width={16}>
          <Table basic compact structured>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Партия</Table.HeaderCell>
                <Table.HeaderCell>Товар</Table.HeaderCell>
                <Table.HeaderCell>Катег</Table.HeaderCell>
                <Table.HeaderCell>Кол-во</Table.HeaderCell>
                <Table.HeaderCell>Ед.изм.</Table.HeaderCell>
                <Table.HeaderCell>Цена</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              { data.map(consignment => (
                <Fragment key={consignment.id}>
                  <Table.Row warning>
                    <Table.Cell colSpan={5}>
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell rowSpan={consignment.items.length}>
                      {moment.utc(consignment.acceptedAt).local().format("DD-MM-YYYY HH:mm")}
                      <br />
                      {consignment.supplierName}
                    </Table.Cell>
                    { consignment.items.slice(0, 1).map(item => (
                      <Fragment key={item.id}>
                        <Table.Cell>{item.productTitle.substring(0, 80)}</Table.Cell>
                        <Table.Cell>{item.categoryTitle}</Table.Cell>
                        <Table.Cell textAlign="right">{item.quantity}</Table.Cell>
                        <Table.Cell>{item.unitTitle}</Table.Cell>
                        <Table.Cell textAlign="right">{item.price / 100}</Table.Cell>
                      </Fragment>
                    ))}
                  </Table.Row>
                  { consignment.items.slice(1).map(item => (
                    <Table.Row key={item.id}>
                      <Table.Cell>{item.productTitle.substring(0, 50)}</Table.Cell>
                      <Table.Cell>{item.categoryTitle}</Table.Cell>
                      <Table.Cell textAlign="right">{item.quantity}</Table.Cell>
                      <Table.Cell>{item.unitTitle}</Table.Cell>
                      <Table.Cell textAlign="right">{item.price / 100.00}</Table.Cell>
                    </Table.Row>
                  ))}
                </Fragment>
              ))}
            </Table.Body>
          </Table>
        </Grid.Column>
      </Grid>
    );
  }

}

const stateMap = (state) => {
  return {
    consignmentJournal: state.consignmentJournal,
  };
}

export default connect(stateMap, { ...ConsignmentJournalActions })(ConsignmentJournal);



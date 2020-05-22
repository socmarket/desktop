import React from "react";
import { connect } from "react-redux";
import moment from "moment";
import { ResponsivePie } from '@nivo/pie'
import { Container, Grid, Form, Input, Table, Button, Segment, Image, Label } from "semantic-ui-react"
import { AppActions } from "../../serv/app"
import { SaleJournalActions } from "../../serv/salejournal"

class SaleJournal extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }

  componentDidMount() {
    this.props.reloadSaleJournal();
  }

  render() {
    const data = this.props.data.items;
    return (
      <div style={{ width: "100%", height: "95.5%", padding: 0 }}>
        <Table compact celled selectable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Товар</Table.HeaderCell>
              <Table.HeaderCell>Кол-во</Table.HeaderCell>
              <Table.HeaderCell>Цена</Table.HeaderCell>
              <Table.HeaderCell>Стоимость</Table.HeaderCell>
              <Table.HeaderCell>Оплачено</Table.HeaderCell>
              <Table.HeaderCell>Дата</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            { data.map(item => (
              <Table.Row key={item.id}>
                <Table.Cell>{item.title}</Table.Cell>
                <Table.Cell>{item.quantity}</Table.Cell>
                <Table.Cell>{item.price}</Table.Cell>
                <Table.Cell>{item.cost}</Table.Cell>
                <Table.Cell>{item.cash}</Table.Cell>
                <Table.Cell>{moment.utc(item.soldAt).local().format("DD-MM-YYYY HH:mm")}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    );
  }

}

const stateMap = (state) => {
  return {
    data: state.saleJournal,
  };
}

export default connect(stateMap, { ...SaleJournalActions })(SaleJournal);


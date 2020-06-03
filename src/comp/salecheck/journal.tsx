import React, { Fragment } from "react";
import { connect } from "react-redux";
import moment from "moment";
import { ResponsivePie } from '@nivo/pie'
import { Container, Grid, Form, Input, Table, Button, Segment, Image, Label } from "semantic-ui-react"
import { SaleCheckActions } from "../../serv/salecheck"

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
    const data = this.props.journal.items.filter(saleCheck => saleCheck.items.length > 0);
    return (
      <Grid padded>
        <Grid.Column width={16}>
          <Table basic compact structured>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Чек</Table.HeaderCell>
                <Table.HeaderCell>Товар</Table.HeaderCell>
                <Table.HeaderCell>Кол-во</Table.HeaderCell>
                <Table.HeaderCell>Ед.изм.</Table.HeaderCell>
                <Table.HeaderCell>Цена</Table.HeaderCell>
                <Table.HeaderCell>Стоимость</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              { data.map(saleCheck => (
                <Fragment key={saleCheck.id}>
                  <Table.Row warning>
                    <Table.Cell colSpan={6}>
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell rowSpan={saleCheck.items.length}>
                      {moment.utc(saleCheck.soldAt).local().format("DD-MM-YYYY HH:mm")}
                      <br />{saleCheck.clientName}
                      <br />Сумма: {saleCheck.cost}
                      { (saleCheck.cash < saleCheck.cost) &&
                        <Fragment>
                          <br />Оплачено: {saleCheck.cash}
                          <br />Долг: {saleCheck.cost - saleCheck.cash}
                        </Fragment>
                      }
                    </Table.Cell>
                    { saleCheck.items.slice(0, 1).map(item => (
                      <Fragment key={item.id}>
                        <Table.Cell>{item.productTitle.substring(0, 80)}</Table.Cell>
                        <Table.Cell textAlign="right">{item.quantity}</Table.Cell>
                        <Table.Cell>{item.unitNotation}</Table.Cell>
                        <Table.Cell textAlign="right">{item.price}</Table.Cell>
                        <Table.Cell textAlign="right">{item.cost}</Table.Cell>
                      </Fragment>
                    ))}
                  </Table.Row>
                  { saleCheck.items.slice(1).map(item => (
                    <Table.Row key={item.id}>
                      <Table.Cell>{item.productTitle.substring(0, 50)}</Table.Cell>
                      <Table.Cell textAlign="right">{item.quantity}</Table.Cell>
                      <Table.Cell>{item.unitNotation}</Table.Cell>
                      <Table.Cell textAlign="right">{item.price}</Table.Cell>
                      <Table.Cell textAlign="right">{item.cost}</Table.Cell>
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
    journal: state.saleCheck.journal,
  };
}

export default connect(stateMap, { ...SaleCheckActions })(SaleJournal);

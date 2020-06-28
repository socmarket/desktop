import React, { Fragment } from "react"
import { connect } from "react-redux"
import moment from "moment"
import { ResponsivePie } from '@nivo/pie'
import { Container, Grid, Form, Input, Table, Button, Segment, Image, Label } from "semantic-ui-react"

class ConsignmentJournal extends React.Component {

  constructor(props) {
    super(props)

    this.consignmentApi = props.api.consignment
    this.state = {
      items: []
    }
  }

  componentDidMount() {
    this.reloadJournal()
  }

  reloadJournal() {
    this.consignmentApi.selectConsignmentJournal()
      .then(items => this.setState({
        items: items
      }))
  }

  returnConsignmentItem(id, quantity) {
    this.consignmentApi.returnConsignmentItem(id, quantity)
      .then(_ => this.reloadJournal())
  }

  render() {
    return (
      <Segment raised style={{ flex: "1 1 auto", overflow: "auto", margin: 15 }}>
        <Table basic compact structured style={{ height: "100%" }}>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Чек</Table.HeaderCell>
              <Table.HeaderCell>Товар</Table.HeaderCell>
              <Table.HeaderCell>Кол-во</Table.HeaderCell>
              <Table.HeaderCell>Возврат</Table.HeaderCell>
              <Table.HeaderCell>Ед.изм.</Table.HeaderCell>
              <Table.HeaderCell>Цена</Table.HeaderCell>
              <Table.HeaderCell>Общ ст-сть</Table.HeaderCell>
              <Table.HeaderCell>Стоимость</Table.HeaderCell>
              <Table.HeaderCell>Операции</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            { this.state.items.map(({ consignment, items }) => (
              <Fragment key={consignment.id}>
                <Table.Row warning><Table.Cell colSpan={9}></Table.Cell></Table.Row>
                <Table.Row>
                  <Table.Cell rowSpan={items.length}>
                    {moment.utc(consignment.soldAt).local().format("DD-MM-YYYY HH:mm")}
                    <br />{consignment.supplierName}
                    <br />Сумма: {consignment.cost}
                    { (consignment.cash < consignment.cost) &&
                      <Fragment>
                        <br />Оплачено: {consignment.cash}
                        <br />Долг: {consignment.cost - consignment.cash}
                      </Fragment>
                    }
                    { (consignment.cash >= consignment.cost) &&
                      <Fragment>
                        <br />Наличными: {consignment.cash}
                        <br />Сдача: {consignment.cash - consignment.cost}
                      </Fragment>
                    }
                  </Table.Cell>
                  { items.slice(0, 1).map(item => (
                    <Fragment key={item.id}>
                      <Table.Cell>{item.productTitle.substring(0, 80)}</Table.Cell>
                      <Table.Cell textAlign="right">{item.quantity}</Table.Cell>
                      <Table.Cell textAlign="right">{item.retQuantity}</Table.Cell>
                      <Table.Cell>{item.unitNotation}</Table.Cell>
                      <Table.Cell textAlign="right">{item.price}</Table.Cell>
                      <Table.Cell textAlign="right">{item.costBeforeRet}</Table.Cell>
                      <Table.Cell textAlign="right">{item.cost}</Table.Cell>
                      <Table.Cell textAlign="right">
                        { (item.retQuantity > 0) && <Button size="mini" icon="plus" onClick={() => this.returnConsignmentItem(item.id, -1)} /> }
                        { (item.quantity > item.retQuantity) && <Button size="mini" icon="minus" onClick={() => this.returnConsignmentItem(item.id, 1)} /> }
                      </Table.Cell>
                    </Fragment>
                  ))}
                </Table.Row>
                { items.slice(1).map(item => (
                  <Table.Row key={item.id}>
                    <Table.Cell>{item.productTitle.substring(0, 50)}</Table.Cell>
                    <Table.Cell textAlign="right">{item.quantity}</Table.Cell>
                    <Table.Cell textAlign="right">{item.retQuantity}</Table.Cell>
                    <Table.Cell>{item.unitNotation}</Table.Cell>
                    <Table.Cell textAlign="right">{item.price}</Table.Cell>
                    <Table.Cell textAlign="right">{item.costBeforeRet}</Table.Cell>
                    <Table.Cell textAlign="right">{item.cost}</Table.Cell>
                    <Table.Cell textAlign="right">
                      { (item.retQuantity > 0) && <Button size="mini" icon="plus" onClick={() => this.returnConsignmentItem(item.id, -1)} /> }
                      { (item.quantity > item.retQuantity) && <Button size="mini" icon="minus" onClick={() => this.returnConsignmentItem(item.id, 1)} /> }
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Fragment>
            ))}
          </Table.Body>
        </Table>
      </Segment>
    )
  }

}

export default ConsignmentJournal

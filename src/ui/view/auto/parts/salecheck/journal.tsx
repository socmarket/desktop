import React, { Fragment } from "react"
import { connect } from "react-redux"
import moment from "moment"
import { ResponsivePie } from '@nivo/pie'
import { Container, Grid, Form, Input, Table, Button, Segment, Image, Label } from "semantic-ui-react"

class SaleJournal extends React.Component {

  constructor(props) {
    super(props)

    this.saleCheckApi = props.api.saleCheck
    this.state = {
      items: []
    }
  }

  componentDidMount() {
    this.reloadJournal()
  }

  reloadJournal() {
    this.saleCheckApi.selectSaleJournal()
      .then(items => this.setState({
        items: items
      }))
  }

  returnSaleCheckItem(id, quantity) {
    this.saleCheckApi.returnSaleCheckItem(id, quantity)
      .then(_ => this.reloadJournal())
  }

  render() {
    return (
      <Grid padded style={{ minHeight: 0, flexShrink: 1, overflowY: "visible" }}>
        <Grid.Row style={{ minHeight: 0 }} >
          <Grid.Column width={16} style={{ minHeight: 0 }} >
            <Segment raised style={{ minHeight: 0 }} >
              <Table basic compact structured style={{ minHeight: 0 }} >
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
                  { this.state.items.map(({ saleCheck, items }) => (
                    <Fragment key={saleCheck.id}>
                      <Table.Row warning><Table.Cell colSpan={9}></Table.Cell></Table.Row>
                      <Table.Row>
                        <Table.Cell rowSpan={items.length}>
                          {moment.utc(saleCheck.soldAt).local().format("DD-MM-YYYY HH:mm")}
                          <br />{saleCheck.clientName}
                          <br />Сумма: {saleCheck.cost}
                          { (saleCheck.cash < saleCheck.cost) &&
                            <Fragment>
                              <br />Оплачено: {saleCheck.cash}
                              <br />Долг: {saleCheck.cost - saleCheck.cash}
                            </Fragment>
                          }
                          { (saleCheck.cash >= saleCheck.cost) &&
                            <Fragment>
                              <br />Наличными: {saleCheck.cash}
                              <br />Сдача: {saleCheck.cash - saleCheck.cost}
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
                              { (item.retQuantity > 0) && <Button size="mini" icon="plus" onClick={() => this.returnSaleCheckItem(item.id, -1)} /> }
                              { (item.quantity > item.retQuantity) && <Button size="mini" icon="minus" onClick={() => this.returnSaleCheckItem(item.id, 1)} /> }
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
                            { (item.retQuantity > 0) && <Button size="mini" icon="plus" onClick={() => this.returnSaleCheckItem(item.id, -1)} /> }
                            { (item.quantity > item.retQuantity) && <Button size="mini" icon="minus" onClick={() => this.returnSaleCheckItem(item.id, 1)} /> }
                          </Table.Cell>
                        </Table.Row>
                      ))}
                    </Fragment>
                  ))}
                </Table.Body>
              </Table>
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }

}

export default SaleJournal

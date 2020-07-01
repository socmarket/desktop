import { spacedNum } from "Util"

import React from "react"
import moment from "moment"
import {
  Menu, Container, Grid, Form, Input,
  Table, Button, Segment, Image, Label,
  Statistic, Header, Icon,
} from "semantic-ui-react"

class Turnover extends React.Component {

  constructor(props) {
    super(props)
    this.reportApi = props.api.report
    this.state = {
      start : moment().subtract(14, "days"),
      end   : moment(),
      turnover: {
        items: [],
        inQuantity  : 0,
        inCost      : 0,
        outQuantity : 0,
        outCost     : 0,
        total       : 0,
      },
    }
  }

  componentDidMount() {
    this.reload(this.state.start, this.state.end)
  }

  reload(startM, endM) {
    Promise.resolve()
      .then(_ => this.reportApi.turnover())
      .then(r => this.setState({
        turnover: r,
      }))
  }

  turnover() {
    const data = this.state.turnover
    console.log(data)
    return (
      <Table celled structured>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell rowSpan={2} textAlign="center">Группа</Table.HeaderCell>
            <Table.HeaderCell colSpan={2} textAlign="center">Куплено</Table.HeaderCell>
            <Table.HeaderCell colSpan={2} textAlign="center">Продано</Table.HeaderCell>
            <Table.HeaderCell rowSpan={2} textAlign="center">Всего</Table.HeaderCell>
          </Table.Row>
          <Table.Row>
            <Table.HeaderCell textAlign="center">Кол-во</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">Сумма</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">Кол-во</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">Сумма</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Всего                                          </Table.HeaderCell>
            <Table.HeaderCell textAlign="right">{spacedNum(data.inQuantity )}</Table.HeaderCell>
            <Table.HeaderCell textAlign="right">{spacedNum(data.inCost     )}</Table.HeaderCell>
            <Table.HeaderCell textAlign="right">{spacedNum(data.outQuantity)}</Table.HeaderCell>
            <Table.HeaderCell textAlign="right">{spacedNum(data.outCost    )}</Table.HeaderCell>
            <Table.HeaderCell textAlign="right">{spacedNum(data.total      )}</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          { data.items.map((item, idx) => (
            <Table.Row key={idx}>
              <Table.Cell>{item.categoryTitle}</Table.Cell>
              <Table.Cell textAlign="right">{spacedNum(item.inQuantity )}</Table.Cell>
              <Table.Cell textAlign="right">{spacedNum(item.inCost     )}</Table.Cell>
              <Table.Cell textAlign="right">{spacedNum(item.outQuantity)}</Table.Cell>
              <Table.Cell textAlign="right">{spacedNum(item.outCost    )}</Table.Cell>
              <Table.Cell textAlign="right">{spacedNum(item.total      )}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    )
  }

  render() {
    return (
      <Container style={{ flex: "1 1 auto", overflow: "auto", marginTop: 15 }}>
        <Segment raised style={{ height: "100%" }}>
          <Header as="h2" dividing color={this.props.theme.mainColor} textAlign="center">
            <Icon name="refresh" />
            Оборот
          </Header>
          {this.turnover()}
        </Segment>
      </Container>
    )
  }

}

export default Turnover

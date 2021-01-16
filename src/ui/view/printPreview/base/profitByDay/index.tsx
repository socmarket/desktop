import React, { Fragment } from "react"
import { connect } from "react-redux"
import moment from "moment"
import { withTranslation } from "react-i18next"
import {
  Container, Grid, Form, Input, Table,
  Button, Segment, Image, Label, Menu,
  Popup, Icon, Header
} from "semantic-ui-react"

const minib = {
  padding: "0.5em 0.5em",
}

class ProfitByDay extends React.Component {

  constructor(props) {
    super(props)
    this.t = this.props.t
  }

  info() {
    return (
      <Table.Row>
        <Table.Cell colSpan={5}>
          {saleCheck.soldAtDate} {saleCheck.soldAtTime}
        </Table.Cell>
      </Table.Row>
    )
  }

  table() {
    return (
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell textAlign="center">{this.t("day")}</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">{this.t("cost")}</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">{this.t("revenue")}</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">{this.t("profit")}</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          { this.props.report.items.map((item, idx) => (
            <Table.Row key={idx}>
              <Table.Cell>{item.day}</Table.Cell>
              <Table.Cell textAlign="right">{item.cost}</Table.Cell>
              <Table.Cell textAlign="right">{item.revenue}</Table.Cell>
              <Table.Cell textAlign="right">{item.profit}</Table.Cell>
            </Table.Row>
          )) }
        </Table.Body>
      </Table>
    )
  }

  render() {
    return (
      <Fragment>
        <Header as="h2" dividing textAlign="left">
          {this.t("profitByDay")}
        </Header>
        <Grid>
          <Grid.Column width={11}>
            <table className="ui compact table">
              <tbody>
                <Table.Row>
                  <Table.Cell>{this.t("revenue")}</Table.Cell>
                  <Table.Cell textAlign="right" >{this.props.report.summary.revenue}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>{this.t("costPrice")}</Table.Cell>
                  <Table.Cell textAlign="right" >{this.props.report.summary.cost}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>{this.t("onCredit")}</Table.Cell>
                  <Table.Cell textAlign="right" >{this.props.report.summary.credit}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>{this.t("profit")}</Table.Cell>
                  <Table.Cell textAlign="right" >{this.props.report.summary.profit}</Table.Cell>
                </Table.Row>
              </tbody>
            </table>
          </Grid.Column>
        </Grid>
        {this.table()}
      </Fragment>
    )
  }

}

export default (withTranslation("dashboard")(ProfitByDay))

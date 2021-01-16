import React, { Fragment } from "react"
import { connect } from "react-redux"
import moment from "moment"
import { withTranslation } from "react-i18next"
import {
  mround,
  spacedNum,
} from "Util"
import {
  Container, Grid, Form, Input, Table,
  Button, Segment, Image, Label, Menu,
  Popup, Icon, Dimmer, Header,
} from "semantic-ui-react"

const minib = {
  padding: "0.5em 0.5em",
}

class SaleCheckJournal extends React.Component {

  constructor(props) {
    super(props)
    this.t = this.props.t
  }

  renderItem(item, saleCheck) {
    return (
      <Table.Row key={item.id} {...(item.retQuantity > 0 ? {negative: true} : {})}>
        <Table.Cell                   >{item.productTitle.substr(0, 50)}</Table.Cell>
        <Table.Cell                   >{item.categoryTitle}</Table.Cell>
        <Table.Cell textAlign="right" >{item.quantity}</Table.Cell>
        <Table.Cell                   >{item.unitNotation}</Table.Cell>
        <Table.Cell textAlign="right" >{item.price}</Table.Cell>
        <Table.Cell textAlign="right" >{spacedNum(item.cost)}</Table.Cell>
        <Table.Cell                   >{saleCheck.soldAtDate}</Table.Cell>
        <Table.Cell                   >{saleCheck.soldAtTime}</Table.Cell>
      </Table.Row>
    )
  }

  renderSaleCheckInfo(saleCheck, items, idx) {
    return (
      <Table.Row>
        <Table.Cell colSpan={5}>
          {saleCheck.soldAtDate} {saleCheck.soldAtTime}
        </Table.Cell>
      </Table.Row>
    )
  }

  renderSaleCheck(saleCheck) {
    return saleCheck.items.map(item => this.renderItem(item, saleCheck.saleCheck))
  }

  table() {
    return (
      <Table compact celled selectable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>#</Table.HeaderCell>
            <Table.HeaderCell>{this.t("product")}</Table.HeaderCell>
            <Table.HeaderCell>{this.t("quantity")}</Table.HeaderCell>
            <Table.HeaderCell>{this.t("unit")}</Table.HeaderCell>
            <Table.HeaderCell>{this.t("price")}</Table.HeaderCell>
            <Table.HeaderCell>{this.t("cost")}</Table.HeaderCell>
            <Table.HeaderCell>{this.t("date")}</Table.HeaderCell>
            <Table.HeaderCell>{this.t("time")}</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          { this.props.report.items.map(saleCheck => this.renderSaleCheck(saleCheck)) }
        </Table.Body>
      </Table>
    )
  }

  render() {
    return (
      <Fragment>
        <Header as="h2" dividing textAlign="left">
          {this.t("saleJournal")}
          <Label>{this.t("printedAt")}: {this.props.report.printedAt}</Label>
        </Header>
        <Grid>
          <Grid.Column width={11}>
            <table className="ui compact table">
              <tbody>
                <Table.Row>
                  <Table.Cell>{this.t("itemCount")}</Table.Cell>
                  <Table.Cell textAlign="right" >{this.props.report.items.length}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>{this.t("totalCost")}</Table.Cell>
                  <Table.Cell textAlign="right" positive>{spacedNum(this.props.report.totalCost)}</Table.Cell>
                </Table.Row>
              </tbody>
            </table>
          </Grid.Column>
          <Grid.Column width={5}>
            <table className="ui compact table">
              <tbody>
                <Table.Row><Table.Cell textAlign="center">{this.props.logo[0]}</Table.Cell></Table.Row>
                <Table.Row><Table.Cell textAlign="center">{this.props.logo[1]}</Table.Cell></Table.Row>
              </tbody>
            </table>
          </Grid.Column>
        </Grid>
        {this.table()}
      </Fragment>
    )
  }

}

export default (withTranslation("saleCheckJournal")(SaleCheckJournal))

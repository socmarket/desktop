import React, { Fragment } from "react"
import { connect } from "react-redux"
import moment from "moment"
import DTable from "View/comp/dtable"
import { withTranslation } from "react-i18next"
import {
  Container, Grid, Form, Input, Table,
  Button, Segment, Image, Label, Menu,
  Popup, Icon, Dimmer, Header,
} from "semantic-ui-react"

const minib = {
  padding: "0.5em 0.5em",
}

class SaleCheck extends React.Component {

  constructor(props) {
    super(props)
    this.t = this.props.t
  }

  table() {
    return (
      <Segment>
        <Header as="h2" dividing textAlign="left">
          {this.t("title")}{this.props.check.id}
          <Label>{this.t("soldAt")}: {this.props.check.soldAtDate} {this.props.check.soldAtTime}</Label>
          <Label>{this.t("printedAt")}: {this.props.check.printedAt}</Label>
        </Header>
        <Grid>
          <Grid.Column width={11}>
            <table className="ui compact table">
              <Table.Row>
                <Table.Cell>{this.t("totalItems")}</Table.Cell>
                <Table.Cell textAlign="right" >{this.props.check.items.length}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>{this.t("discount")}</Table.Cell>
                <Table.Cell textAlign="right">{this.props.check.extraDiscount || 0}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>{this.t("totalCost")}</Table.Cell>
                <Table.Cell textAlign="right" positive>{this.props.check.totalCost}</Table.Cell>
              </Table.Row>
            </table>
          </Grid.Column>
          <Grid.Column width={5}>
            <table className="ui compact table">
              <Table.Row><Table.Cell textAlign="center">{this.props.logo[0]}</Table.Cell></Table.Row>
              <Table.Row><Table.Cell textAlign="center">{this.props.logo[1]}</Table.Cell></Table.Row>
              <Table.Row><Table.Cell textAlign="center">{this.props.logo[2]}</Table.Cell></Table.Row>
            </table>
          </Grid.Column>
        </Grid>

        <table className="ui compact celled selectable table">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell textAlign="right" >#</Table.HeaderCell>
              <Table.HeaderCell textAlign="left"  >{this.t("product")}</Table.HeaderCell>
              <Table.HeaderCell textAlign="right" >{this.t("price")}</Table.HeaderCell>
              <Table.HeaderCell textAlign="right" >{this.t("quantity")}</Table.HeaderCell>
              <Table.HeaderCell textAlign="left"  >{this.t("unitTitle")}</Table.HeaderCell>
              <Table.HeaderCell textAlign="right" >{this.t("cost")}</Table.HeaderCell>
              <Table.HeaderCell textAlign="left"  >{this.t("barcode")}</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            { this.props.check.items.map((item, ridx) => (
              <Table.Row key={ridx}>
                <Table.Cell textAlign="right" >{ridx+1}</Table.Cell>
                <Table.Cell textAlign="left"  >{item.productTitle}</Table.Cell>
                <Table.Cell textAlign="right" >{item.price}</Table.Cell>
                <Table.Cell textAlign="right" >{item.quantity}</Table.Cell>
                <Table.Cell textAlign="left"  >{item.unitTitle}</Table.Cell>
                <Table.Cell textAlign="right" >{item.total}</Table.Cell>
                <Table.Cell textAlign="left"  >{item.productBarcode}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </table>
      </Segment>
    )
  }

  render() {
    return this.table()
  }

}

export default (withTranslation("saleCheckA4")(SaleCheck))

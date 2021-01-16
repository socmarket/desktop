import React, { Fragment } from "react"
import { connect } from "react-redux"
import moment from "moment"
import DTable from "View/comp/dtable"
import { withTranslation } from "react-i18next"
import {
  numberInputWithRef,
  ifNumberF,
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

class Consignment extends React.Component {

  constructor(props) {
    super(props)
    this.t = this.props.t
  }

  table() {
    return (
      <Segment>
        <Header as="h2" dividing textAlign="left">
          {this.t("title")}{this.props.consignment.id}
          <Label>{this.t("acceptedAt")}: {this.props.consignment.acceptedAtDate} {this.props.consignment.acceptedAtTime}</Label>
          <Label>{this.t("printedAt")}: {this.props.consignment.printedAt}</Label>
        </Header>
        <Grid>
          <Grid.Column width={11}>
            <table className="ui compact table">
              <tbody>
                <Table.Row>
                  <Table.Cell>{this.t("totalItems")}</Table.Cell>
                  <Table.Cell textAlign="right" >{this.props.consignment.items.length}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>{this.t("totalCost")}</Table.Cell>
                  <Table.Cell textAlign="right" positive>{spacedNum(this.props.consignment.cost)}</Table.Cell>
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
              <Table.HeaderCell textAlign="left"  >{this.t("salePrice")}</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            { this.props.consignment.items.map((item, ridx) => (
              <Table.Row key={ridx}>
                <Table.Cell textAlign="right" >{ridx+1}</Table.Cell>
                <Table.Cell textAlign="left"  >{item.productTitle}</Table.Cell>
                <Table.Cell textAlign="right" >{item.price}</Table.Cell>
                <Table.Cell textAlign="right" >{item.quantity}</Table.Cell>
                <Table.Cell textAlign="left"  >{item.unitTitle}</Table.Cell>
                <Table.Cell textAlign="right" >{spacedNum(item.cost)}</Table.Cell>
                <Table.Cell textAlign="left"  >{item.productBarcode}</Table.Cell>
                <Table.Cell textAlign="left"  >{item.salePrice}</Table.Cell>
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

export default (withTranslation("consignmentA4")(Consignment))

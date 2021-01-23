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

class Inventory extends React.Component {

  constructor(props) {
    super(props)
    this.t = this.props.t
  }

  table() {
    return (
      <Table compact celled selectable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell rowSpan={2} textAlign="center">#</Table.HeaderCell>
            <Table.HeaderCell rowSpan={2} textAlign="center">{this.t("name")}</Table.HeaderCell>
            <Table.HeaderCell colSpan={2} textAlign="center">{this.t("quantity")}</Table.HeaderCell>
            <Table.HeaderCell rowSpan={2} textAlign="center">{this.t("unit")}</Table.HeaderCell>
            <Table.HeaderCell colSpan={2} textAlign="center">{this.t("price")}</Table.HeaderCell>
            <Table.HeaderCell rowSpan={2} textAlign="center">{this.t("barcode")}</Table.HeaderCell>
          </Table.Row>
          <Table.Row>
            <Table.HeaderCell textAlign="center">{this.t("calculatedQuantity")}</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">{this.t("actualQuantity")}</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">{this.t("costPrice")}</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">{this.t("sellPrice")}</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          { this.props.report.items.map((product, idx) => {
            return (
              <Table.Row key={product.id}>
                <Table.Cell textAlign="right">{idx + 1}</Table.Cell>
                <Table.Cell style={{whiteSpace: "nowrap"}}>{product.title}</Table.Cell>
                <Table.Cell textAlign="right">{product.quantity}</Table.Cell>
                <Table.Cell textAlign="right"></Table.Cell>
                <Table.Cell>{product.unitNotation}</Table.Cell>
                <Table.Cell textAlign="right"></Table.Cell>
                <Table.Cell textAlign="right"></Table.Cell>
                <Table.Cell>{product.barcode}</Table.Cell>
              </Table.Row>
            )
          })}
        </Table.Body>
      </Table>
    )
  }

  render() {
    return (
      <Fragment>
        <Header as="h2" dividing textAlign="left">
          {this.t("inventory")}
        </Header>
        <table className="ui compact table">
          <tbody>
            <Table.Row>
              <Table.Cell>{this.t("printedAt")}: </Table.Cell>
              <Table.Cell textAlign="right" >{this.props.report.printedAt}</Table.Cell>
            </Table.Row>
            <Table.Row><Table.Cell colSpan={2}>{this.props.logo[0]}</Table.Cell></Table.Row>
            <Table.Row><Table.Cell colSpan={2}>{this.props.logo[1]}</Table.Cell></Table.Row>
          </tbody>
        </table>
        {this.table()}
      </Fragment>
    )
  }

}

export default (withTranslation("inventoryList")(Inventory))

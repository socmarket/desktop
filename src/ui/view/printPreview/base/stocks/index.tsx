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

class Stocks extends React.Component {

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
      <Table compact celled selectable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>#</Table.HeaderCell>
            <Table.HeaderCell>{this.t("name")}</Table.HeaderCell>
            <Table.HeaderCell>{this.t("brand")}</Table.HeaderCell>
            <Table.HeaderCell>{this.t("quantity")}</Table.HeaderCell>
            <Table.HeaderCell>{this.t("unit")}</Table.HeaderCell>
            <Table.HeaderCell>{this.t("category")}</Table.HeaderCell>
            <Table.HeaderCell>{this.t("barcode")}</Table.HeaderCell>
            <Table.HeaderCell><Icon name="map marker alternate" /></Table.HeaderCell>
            <Table.HeaderCell>{this.t("notes")}</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          { this.props.report.items.map((product, idx) => (
            <Table.Row key={product.id}>
              <Table.Cell textAlign="right">{idx + 1}</Table.Cell>
              <Table.Cell style={{whiteSpace: "nowrap"}}>{product.title}</Table.Cell>
              <Table.Cell>{product.brand}</Table.Cell>
              <Table.Cell textAlign="right">{product.quantity}</Table.Cell>
              <Table.Cell>{product.unitNotation}</Table.Cell>
              <Table.Cell>{product.categoryTitle}</Table.Cell>
              <Table.Cell>{product.barcode}</Table.Cell>
              <Table.Cell>{product.coord}</Table.Cell>
              <Table.Cell>{product.notes}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    )
  }

  render() {
    console.log(this.props)
    return (
      <Fragment>
        <Header as="h2" dividing textAlign="left">
          {this.t("stocks")}
        </Header>
        <Grid>
          <Grid.Column width={11}>
            <table className="ui compact table">
              <tbody>
                <Table.Row>
                  <Table.Cell>{this.t("printedAt")}</Table.Cell>
                  <Table.Cell textAlign="right" >{this.props.report.printedAt}</Table.Cell>
                </Table.Row>
                <Table.Row><Table.Cell colSpan={2}>{this.props.logo[0]}</Table.Cell></Table.Row>
                <Table.Row><Table.Cell colSpan={2}>{this.props.logo[1]}</Table.Cell></Table.Row>
                <Table.Row><Table.Cell colSpan={2}>{this.props.logo[2]}</Table.Cell></Table.Row>
              </tbody>
            </table>
          </Grid.Column>
        </Grid>
        {this.table()}
      </Fragment>
    )
  }

}

export default (withTranslation("productList")(Stocks))

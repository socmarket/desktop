
import React, { Fragment } from "react"
import { connect } from "react-redux"
import moment from "moment"
import { SingleDatePicker } from "react-dates"
import { withTranslation } from "react-i18next"
import {
  Container, Grid, Form, Input, Table,
  Button, Segment, Image, Label, Menu,
  Popup, Icon, List,
} from "semantic-ui-react"

import {
  mround,
  spacedNum,
} from "Util"

const minib = {
  padding: "0.5em 0.5em",
}

class ItemList extends React.Component {

  constructor(props) {
    super(props)
    this.t = this.props.t
    this.saleCheckApi = this.props.api.saleCheck;
  }

  returnSaleCheckItem(id, quantity) {
    this.saleCheckApi
      .returnSaleCheckItem(id, quantity)
      .then(_ => this.props.onReturnItem())
  }

  renderItem(item, saleCheck) {
    return (
      <Table.Row key={item.id} {...(item.retQuantity > 0 ? {negative: true} : {})}>
        <Table.Cell                   >{item.productTitle.substr(0, 50)}</Table.Cell>
        <Table.Cell                   >{item.categoryTitle}</Table.Cell>
        <Table.Cell textAlign="right" >{item.quantity}</Table.Cell>
        <Table.Cell textAlign="right" >{item.retQuantity}</Table.Cell>
        <Table.Cell                   >{item.unitNotation}</Table.Cell>
        <Table.Cell textAlign="right" >{item.price}</Table.Cell>
        <Table.Cell textAlign="right" >{item.cost}</Table.Cell>
        <Table.Cell                   >{saleCheck.soldAtDate}</Table.Cell>
        <Table.Cell                   >{saleCheck.soldAtTime}</Table.Cell>
        <Table.Cell textAlign="right">
          <Button
            style={minib}
            size="mini"
            icon="plus"
            disabled={item.retQuantity < 1}
            onClick={() => this.returnSaleCheckItem(item.id, -1)}
          />
          <Button
            style={minib}
            size="mini"
            icon="minus"
            disabled={item.quantity <= item.retQuantity}
            onClick={() => this.returnSaleCheckItem(item.id, 1)}
          />
        </Table.Cell>
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
            <Table.HeaderCell>{this.t("product")}</Table.HeaderCell>
            <Table.HeaderCell>{this.t("category")}</Table.HeaderCell>
            <Table.HeaderCell>{this.t("quantity")}</Table.HeaderCell>
            <Table.HeaderCell>{this.t("return")}</Table.HeaderCell>
            <Table.HeaderCell>{this.t("unit")}</Table.HeaderCell>
            <Table.HeaderCell>{this.t("price")}</Table.HeaderCell>
            <Table.HeaderCell>{this.t("cost")}</Table.HeaderCell>
            <Table.HeaderCell>{this.t("date")}</Table.HeaderCell>
            <Table.HeaderCell>{this.t("time")}</Table.HeaderCell>
            <Table.HeaderCell>+/-</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          { this.props.items.map(saleCheck => this.renderSaleCheck(saleCheck)) }
        </Table.Body>
      </Table>
    )
  }

  render() {
    return this.table()
  }

}

export default (withTranslation("saleCheckJournal")(ItemList))

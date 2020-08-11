import React, { Fragment } from "react"
import { connect } from "react-redux"
import moment from "moment"
import { ResponsivePie } from '@nivo/pie'
import { Container, Grid, Form, Input, Table, Button, Segment, Image, Label } from "semantic-ui-react"

const minib = {
  padding: "0.5em 0.5em",
}
import { withTranslation } from 'react-i18next';

class SaleJournal extends React.Component {

  constructor(props) {
    super(props)

    this.saleCheckApi = props.api.saleCheck
    this.state = {
      items: []
    }
    this.t = this.props.t
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
      <Segment raised style={{ flex: "1 1 auto", overflow: "auto", margin: 15 }}>
        <Table celled compact structured striped style={{ height: "100%" }}>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>{this.t("chek")}</Table.HeaderCell>
              <Table.HeaderCell>{this.t("product")}</Table.HeaderCell>
              <Table.HeaderCell>{this.t("quantity")}</Table.HeaderCell>
              <Table.HeaderCell>{this.t("return")}</Table.HeaderCell>
              <Table.HeaderCell>{this.t("unit")}</Table.HeaderCell>
              <Table.HeaderCell>{this.t("price")}</Table.HeaderCell>
              <Table.HeaderCell>{this.t("total")}</Table.HeaderCell>
              <Table.HeaderCell>{this.t("cost")}</Table.HeaderCell>
              <Table.HeaderCell>{this.t("barcode")}</Table.HeaderCell>
              <Table.HeaderCell>{this.t("oem")}</Table.HeaderCell>
              <Table.HeaderCell>{this.t("operations")}</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            { this.state.items.map(day => (
              <Fragment key={day.key}>
                <Table.Row><Table.Cell colSpan={11} textAlign="center">
                  <Label color={this.props.theme.mainColor} size="large">{moment.utc(day.maxKey).fromNow()}</Label>
                  <Label color={this.props.theme.mainColor} size="large">{moment.utc(day.key).local().format("dddd, MMMM Do YYYY")}</Label>
                </Table.Cell></Table.Row>
                { day.items.map(({ saleCheck, items }, idx) => (
                  <Fragment key={saleCheck.id}>
                    { idx > 0 && <Table.Row warning><Table.Cell colSpan={11}></Table.Cell></Table.Row> }
                    <Table.Row>
                      <Table.Cell rowSpan={items.length}>
                        {moment.utc(saleCheck.soldAt).local().format("DD-MM-YYYY HH:mm")}
                        <br />{saleCheck.clientName}
                        <br />{this.t("withoutDiscount")} {saleCheck.cost}
                        <br />{this.t("discount")} {saleCheck.discount}
                        <br />{this.t("amount")} {saleCheck.cost - saleCheck.discount}
                        { (saleCheck.cash < (saleCheck.cost - saleCheck.discount)) &&
                          <Fragment>
                            <br />{this.t("paidUp")} {saleCheck.cash}
                            <br />{this.t("debt")} {saleCheck.cost - saleCheck.cash - saleCheck.discount}
                          </Fragment>
                        }
                        { (saleCheck.cash >= (saleCheck.cost - saleCheck.discount)) &&
                          <Fragment>
                            <br />{this.t("inСash")} {saleCheck.cash}
                            <br />{this.t("surrender")} {saleCheck.cash - saleCheck.cost + saleCheck.discount}
                          </Fragment>
                        }
                      </Table.Cell>
                      { items.slice(0, 1).map(item => (
                        <Fragment key={item.id}>
                          <Table.Cell                   {...(item.retQuantity > 0 ? {negative: true} : {})} >{item.productTitle.substring(0, 80)}</Table.Cell>
                          <Table.Cell textAlign="right" {...(item.retQuantity > 0 ? {negative: true} : {})} >{item.quantity}</Table.Cell>
                          <Table.Cell textAlign="right" {...(item.retQuantity > 0 ? {negative: true} : {})} >{item.retQuantity}</Table.Cell>
                          <Table.Cell                   {...(item.retQuantity > 0 ? {negative: true} : {})} >{item.unitNotation}</Table.Cell>
                          <Table.Cell textAlign="right" {...(item.retQuantity > 0 ? {negative: true} : {})} >{item.price}</Table.Cell>
                          <Table.Cell textAlign="right" {...(item.retQuantity > 0 ? {negative: true} : {})} >{item.costBeforeRet}</Table.Cell>
                          <Table.Cell textAlign="right" {...(item.retQuantity > 0 ? {negative: true} : {})} >{item.cost}</Table.Cell>
                          <Table.Cell                   {...(item.retQuantity > 0 ? {negative: true} : {})} >{item.barcode}</Table.Cell>
                          <Table.Cell                   {...(item.retQuantity > 0 ? {negative: true} : {})} >{item.oemNo}</Table.Cell>
                          <Table.Cell textAlign="right" {...(item.retQuantity > 0 ? {negative: true} : {})} >
                            { (item.retQuantity > 0)             && <Button style={minib} size="mini" icon="plus"  onClick={() => this.returnSaleCheckItem(item.id, -1)} /> }
                            { (item.quantity > item.retQuantity) && <Button style={minib} size="mini" icon="minus" onClick={() => this.returnSaleCheckItem(item.id,  1)} /> }
                          </Table.Cell>
                        </Fragment>
                      ))}
                    </Table.Row>
                    { items.slice(1).map(item => (
                      <Table.Row key={item.id}>
                        <Table.Cell                   {...(item.retQuantity > 0 ? {negative: true} : {})} >{item.productTitle.substring(0, 50)}</Table.Cell>
                        <Table.Cell textAlign="right" {...(item.retQuantity > 0 ? {negative: true} : {})} >{item.quantity}</Table.Cell>
                        <Table.Cell textAlign="right" {...(item.retQuantity > 0 ? {negative: true} : {})} >{item.retQuantity}</Table.Cell>
                        <Table.Cell                   {...(item.retQuantity > 0 ? {negative: true} : {})} >{item.unitNotation}</Table.Cell>
                        <Table.Cell textAlign="right" {...(item.retQuantity > 0 ? {negative: true} : {})} >{item.price}</Table.Cell>
                        <Table.Cell textAlign="right" {...(item.retQuantity > 0 ? {negative: true} : {})} >{item.costBeforeRet}</Table.Cell>
                        <Table.Cell textAlign="right" {...(item.retQuantity > 0 ? {negative: true} : {})} >{item.cost}</Table.Cell>
                        <Table.Cell                   {...(item.retQuantity > 0 ? {negative: true} : {})} >{item.barcode}</Table.Cell>
                        <Table.Cell                   {...(item.retQuantity > 0 ? {negative: true} : {})} >{item.oemNo}</Table.Cell>
                        <Table.Cell textAlign="right" {...(item.retQuantity > 0 ? {negative: true} : {})} >
                          { (item.retQuantity > 0) && <Button style={minib} size="mini" icon="plus" onClick={() => this.returnSaleCheckItem(item.id, -1)} /> }
                          { (item.quantity > item.retQuantity) && <Button style={minib} size="mini" icon="minus" onClick={() => this.returnSaleCheckItem(item.id, 1)} /> }
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Fragment>
                ))}
              </Fragment>
            ))}
          </Table.Body>
        </Table>
      </Segment>
    )
  }

}

export default (withTranslation("auto_parts_salecheck_journal.form")(SaleJournal))

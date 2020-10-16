import React, { Fragment } from "react"
import { connect } from "react-redux"
import moment from "moment"
import { SingleDatePicker } from "react-dates"
import {
  Container, Grid, Form, Input,
  Table, Button, Segment, Image,
  Label, Menu, Popup, Icon,
} from "semantic-ui-react"

import "./journal.css"
import { withTranslation } from 'react-i18next';

const minib = {
  padding: "0.5em 0.5em",
}

class ConsignmentJournal extends React.Component {

  constructor(props) {
    super(props)

    this.consignmentApi = props.api.consignment
    this.state = {
      day   : moment().subtract(0, "days"),
      all   : false,
      items: [],
    }
    this.t = this.props.t
  }

  componentDidMount() {
    this.reloadJournal(this.state.day, this.state.all)
  }

  reloadJournal(day, all) {
    this.consignmentApi
      .selectConsignmentJournal(day.utc().format("YYYY-MM-DD"), all)
      .then(items => {
        this.setState({
          items: items
        })
      })
  }

  returnConsignmentItem(id, quantity) {
    this.consignmentApi.returnConsignmentItem(id, quantity)
      .then(_ => this.reloadJournal())
  }

  changeDay(day) {
    if (day) {
      this.setState({
        day: day,
        all: false,
      }, () => {
        this.reloadJournal(day, this.state.false)
      })
    }
  }

  nextDay() {
    this.changeDay(this.state.day.add(1, "day"))
  }

  prevDay() {
    this.changeDay(this.state.day.subtract(1, "day"))
  }

  showAll() {
    this.setState({
      all: true,
    }, () => {
      this.reloadJournal(this.state.day, true)
    })
  }

  dayPicker() {
    return (
      <SingleDatePicker
        isOutsideRange={() => false}
        date={this.state.day}
        onDateChange={(day) => this.changeDay(day)}
        focused={this.state.dayPickerFocused}
        onFocusChange={({focused}) => this.setState({ dayPickerFocused: focused })}
      />
    )
  }

  render() {
    const today     = moment()
    const yesterday = moment().subtract(1, "day")
    return (
      <Fragment>
        <Menu icon style={{ marginRight: 15, marginLeft: 15, marginTop: 0, marginBottom: 5 }}>
          <Menu.Menu position="left">
            <Menu.Item onClick={() => this.showAll()}            active={this.state.all}>{this.t("all")}</Menu.Item>
            <Menu.Item onClick={() => this.changeDay(today)}     active={today.isSame(this.state.day, 'day') && !this.state.all}>{this.t("today")}</Menu.Item>
            <Menu.Item onClick={() => this.changeDay(yesterday)} active={yesterday.isSame(this.state.day, 'day') && !this.state.all}>{this.t("yesterday")}</Menu.Item>
          </Menu.Menu>
          <Menu.Menu position="right">
            <Popup content={this.t("prevDay")} trigger= { <Menu.Item onClick={() => this.prevDay()}><Icon name="angle left"  /></Menu.Item> } />
            <Menu.Item fitted="vertically">
              {this.dayPicker()}
            </Menu.Item>
            <Popup content={this.t("nextDay")} trigger= { <Menu.Item onClick={() => this.nextDay()}><Icon name="angle right" /></Menu.Item> } />
          </Menu.Menu>
        </Menu>
        <Segment raised style={{ flex: "1 1 auto", overflow: "auto", margin: 15 }}>
          <Table celled compact structured striped style={{ height: "100%" }}>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>{this.t("check")}</Table.HeaderCell>
                <Table.HeaderCell>{this.t("product")}</Table.HeaderCell>
                <Table.HeaderCell>{this.t("quantity")}</Table.HeaderCell>
                <Table.HeaderCell>{this.t("return")}</Table.HeaderCell>
                <Table.HeaderCell>{this.t("unit")}</Table.HeaderCell>
                <Table.HeaderCell>{this.t("price")}</Table.HeaderCell>
                <Table.HeaderCell>{this.t("totalCost")}</Table.HeaderCell>
                <Table.HeaderCell>{this.t("cost")}</Table.HeaderCell>
                <Table.HeaderCell>{this.t("brand")}</Table.HeaderCell>
                <Table.HeaderCell>{this.t("barcode")}</Table.HeaderCell>
                <Table.HeaderCell>{this.t("oem")}</Table.HeaderCell>
                <Table.HeaderCell>{this.t("operations")}</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              { this.state.items.map(day => (
                <Fragment key={day.key}>
                  <Table.Row><Table.Cell colSpan={12} textAlign="center">
                    <Label color={this.props.theme.mainColor} size="large">{moment.utc(day.maxKey).fromNow()}</Label>
                    <Label color={this.props.theme.mainColor} size="large">{moment.utc(day.key).local().format("dddd, MMMM Do YYYY")}</Label>
                  </Table.Cell></Table.Row>
                  { day.items.map(({ consignment, items }) => (
                    <Fragment key={consignment.id}>
                      <Table.Row warning><Table.Cell colSpan={12}></Table.Cell></Table.Row>
                      <Table.Row>
                        <Table.Cell rowSpan={items.length}>
                          {moment.utc(consignment.acceptedAt).local().format("DD-MM-YYYY HH:mm")}
                          <br />{consignment.supplierName}
                          <br />{this.t("amount")}: {consignment.cost}
                          { (consignment.cash < consignment.cost) &&
                            <Fragment>
                              <br />{this.t("paidUp")}: {consignment.cash}
                              <br />{this.t("debt")}: {consignment.cost - consignment.cash}
                            </Fragment>
                          }
                          { (consignment.cash >= consignment.cost) &&
                            <Fragment>
                              <br />{this.t("cach")}: {consignment.cash}
                              <br />{this.t("change")}: {consignment.cash - consignment.cost}
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
                            <Table.Cell                   {...(item.retQuantity > 0 ? {negative: true} : {})} >{item.brand}</Table.Cell>
                            <Table.Cell                   {...(item.retQuantity > 0 ? {negative: true} : {})} >{item.barcode}</Table.Cell>
                            <Table.Cell                   {...(item.retQuantity > 0 ? {negative: true} : {})} >{item.oemNo}</Table.Cell>
                            <Table.Cell textAlign="right" {...(item.retQuantity > 0 ? {negative: true} : {})} >
                              { (item.retQuantity > 0) && <Button style={minib} size="mini" icon="plus" onClick={() => this.returnConsignmentItem(item.id, -1)} /> }
                              { (item.quantity > item.retQuantity) && <Button style={minib} size="mini" icon="minus" onClick={() => this.returnConsignmentItem(item.id, 1)} /> }
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
                          <Table.Cell                   {...(item.retQuantity > 0 ? {negative: true} : {})} >{item.brand}</Table.Cell>
                          <Table.Cell                   {...(item.retQuantity > 0 ? {negative: true} : {})} >{item.barcode}</Table.Cell>
                          <Table.Cell                   {...(item.retQuantity > 0 ? {negative: true} : {})} >{item.oemNo}</Table.Cell>
                          <Table.Cell textAlign="right" {...(item.retQuantity > 0 ? {negative: true} : {})} >
                            { (item.retQuantity > 0) && <Button style={minib} size="mini" icon="plus" onClick={() => this.returnConsignmentItem(item.id, -1)} /> }
                            { (item.quantity > item.retQuantity) && <Button style={minib} size="mini" icon="minus" onClick={() => this.returnConsignmentItem(item.id, 1)} /> }
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
      </Fragment>
    )
  }

}

export default (withTranslation("auto_part_consignmen_journal.form")(ConsignmentJournal))

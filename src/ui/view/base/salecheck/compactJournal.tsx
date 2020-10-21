import React, { Fragment } from "react"
import { connect } from "react-redux"
import moment from "moment"
import { ResponsivePie } from '@nivo/pie'
import { SingleDatePicker } from "react-dates"
import {
  Container, Grid, Form, Input, Table,
  Button, Segment, Image, Label, Menu,
  Popup, Icon,
} from "semantic-ui-react"

import {
  mround,
}                    from "Util"

const minib = {
  padding: "0.5em 0.5em",
}
import { withTranslation } from 'react-i18next';

class SaleJournal extends React.Component {

  constructor(props) {
    super(props)
    this.saleCheckApi = props.api.saleCheck
    this.state = {
      day   : moment().subtract(0, "days"),
      all   : false,
      items : [],
    }
    this.t = this.props.t
  }

  componentDidMount() {
    this.reloadJournal(this.state.day, this.state.all)
  }

  reloadJournal(day, all) {
    if (day) {
      this.saleCheckApi
        .selectSaleJournal(day.utc().format("YYYY-MM-DD"), all)
        .then(items => {
          this.setState({
            items: items
          })
        })
    }
  }

  changeDay(day) {
    this.setState({
      day: day,
      all: false,
    }, () => {
      this.reloadJournal(day, this.state.false)
    })
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

  returnSaleCheckItem(id, quantity) {
    this.saleCheckApi
      .returnSaleCheckItem(id, quantity)
      .then(_ => this.reloadJournal())
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
        <Segment raised style={{ flex: "1 1 auto", overflow: "auto", margin: 15, marginTop: 0 }}>
          <Table compact celled selectable style={{ height: "100%" }}>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>{this.t("product")}</Table.HeaderCell>
                <Table.HeaderCell>{this.t("date")}</Table.HeaderCell>
                <Table.HeaderCell>{this.t("time")}</Table.HeaderCell>
                <Table.HeaderCell>{this.t("quantity")}</Table.HeaderCell>
                <Table.HeaderCell>{this.t("unit")}</Table.HeaderCell>
                <Table.HeaderCell>{this.t("price")}</Table.HeaderCell>
                <Table.HeaderCell>{this.t("cost")}</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              { this.state.items.map(day => (
                <Fragment key={day.key}>
                  { day.items.map(({ saleCheck, items }, idx) => (
                    <Fragment key={saleCheck.id}>
                      { items.map(item => (
                        <Table.Row key={item.id}>
                          <Table.Cell                   >{item.productTitle.substring(0, 50)}</Table.Cell>
                          <Table.Cell                   >{saleCheck.soldAtDate}</Table.Cell>
                          <Table.Cell                   >{saleCheck.soldAtTime}</Table.Cell>
                          <Table.Cell textAlign="right" >{item.quantity}</Table.Cell>
                          <Table.Cell                   >{item.unitNotation}</Table.Cell>
                          <Table.Cell textAlign="right" >{item.price}</Table.Cell>
                          <Table.Cell textAlign="right" >{item.cost}</Table.Cell>
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

export default (withTranslation("salecheck_journal.form")(SaleJournal))

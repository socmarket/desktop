import React, { Fragment } from "react"
import { connect } from "react-redux"
import moment from "moment"
import { SingleDatePicker } from "react-dates"
import { withTranslation } from "react-i18next"
import {
  Container, Grid, Form, Input, Table,
  Button, Segment, Image, Label, Menu,
  Popup, Icon, Dimmer,
} from "semantic-ui-react"

import {
  mround,
  spacedNum,
} from "Util"
import ItemList      from "./itemList"
import SaleCheckList from "./saleCheckList"

import BaseSaleCheckEditor      from "View/base/salecheck/editor"
import AutoPartsSaleCheckEditor from "View/auto/parts/salecheck/editor"

class SaleCheckEditor extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    switch (this.props.opt.appMode) {
      case "base"      : return (<BaseSaleCheckEditor     
        api={this.props.api}
        theme={this.props.opt.theme}
        opt={this.props.opt}
        saleCheckId={this.props.saleCheckId}
        onCancel={this.props.onCancel}
        onSave={this.props.onSave}
      />)
      case "auto/parts": return (<AutoPartsSaleCheckEditor
        api={this.props.api}
        theme={this.props.opt.theme}
        opt={this.props.opt}
        saleCheckId={this.props.saleCheckId}
        onCancel={this.props.onCancel}
        onSave={this.props.onSave}
      />)
    }
  }
}

class SaleJournal extends React.Component {

  constructor(props) {
    super(props)
    this.saleCheckApi = props.api.saleCheck
    this.printPreviewApi = props.api.printPreview
    this.state = {
      itemCount  : 0,
      totalCount : 0,
      totalCost  : 0,
      discount   : 0,
      day        : moment(),
      all        : false,
      list       : [],
      items      : [],
      selectedSaleCheck: false,
      containerHeight: 500,
      showSaleCheckEditor: false,
    }
    this.t = this.props.t
  }

  componentDidMount() {
    const height = document.getElementById("salecheck-container").clientHeight;
    this.setState({
      containerHeight: height,
    }, () => this.reloadJournal())
  }

  reloadJournal() {
    this.setState({
      showSaleCheckEditor: false,
    }, () => {
      this.saleCheckApi
        .selectSaleJournal(this.state.day.utc().format("YYYY-MM-DD"), this.state.all, this.state.selectedSaleCheck)
        .then(({ list, items }) => {
          const itemCount = items.map(i => i.items.length).reduce((a, b) => a + b, 0)
          const totalCount = items
            .map(i => i.items.map(ii => ii.quantity - ii.retQuantity).reduce((a, b) => a + b, 0))
            .reduce((a, b) => a + b, 0)
          const totalCost = items.map(i => i.saleCheck.cost - i.saleCheck.discount).reduce((a, b) => a + b, 0)
          const discount = items.map(i => i.saleCheck.discount).reduce((a, b) => a + b, 0)
          this.setState({
            list       : list,
            items      : items,
            itemCount  : itemCount,
            totalCount : totalCount,
            totalCost  : totalCost,
            discount   : discount,
          })
        })
    })
  }

  onSaleCheckSelected(saleCheck, items) {
    this.setState({
      selectedSaleCheck: { saleCheck: saleCheck, items: items },
    }, () => this.reloadJournal())
  }

  onNoSaleCheckSelected() {
    this.setState({
      selectedSaleCheck: null,
      showSaleCheckEditor: false,
    }, () => this.reloadJournal())
  }

  changeDay(day) {
    this.setState({
      day: day,
      all: false,
      selectedSaleCheck: null,
      showSaleCheckEditor: false,
    }, () => {
      this.reloadJournal()
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
      selectedSaleCheck: null,
      showSaleCheckEditor: false,
    }, () => {
      this.reloadJournal()
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

  openSaleCheck() {
    this.saleCheckApi
      .openSaleCheck(this.state.selectedSaleCheck.saleCheck.id)
      .then(_ => {
        this.setState({
          showSaleCheckEditor: true,
        })
      })
  }

  hideSaleCheckEditor() {
    this.setState({
      showSaleCheckEditor: false,
    }, () => {
      this.reloadJournal()
    })
  }

  renderWithList() {
    return (
      <Grid style={{ height: "100%" }}>
        <Grid.Column width={3}>
          <div style={{ height: this.state.containerHeight - 25, overflowY: "auto" }}>
            <SaleCheckList
              api={this.props.api}
              theme={this.props.theme}
              items={this.state.list}
              height={this.state.containerHeight}
              selected={this.state.selectedSaleCheck}
              onSaleCheckSelected={(saleCheck, items) => this.onSaleCheckSelected(saleCheck, items)}
              onNoSaleCheckSelected={() => this.onNoSaleCheckSelected()}
            />
          </div>
        </Grid.Column>
        <Grid.Column width={13}>
          <div style={{ height: this.state.containerHeight - 25, overflowY: "auto" }}>
            <ItemList
              api={this.props.api}
              theme={this.props.theme}
              items={this.state.items}
              height={this.state.containerHeight}
              onReturnItem={() => this.reloadJournal()}
            />
          </div>
        </Grid.Column>
      </Grid>
    )
  }

  onPrintPreview() {
    this.printPreviewApi.preview({
      view: "SaleCheckJournal",
      data: {
        report: {
          items     : this.state.items,
          totalCost : this.state.totalCost,
          printedAt : moment().format("DD-MM-YYYY HH:mm"),
        },
        logo : [
          this.props.opt.logoLine1,
          this.props.opt.logoLine2,
          this.props.opt.logoLine3,
        ],
      },
    })
  }

  render() {
    const today     = moment()
    const yesterday = moment().subtract(1, "day")
    return (
      <Fragment>
        <Menu icon style={{ marginRight: 15, marginLeft: 15, marginTop: 0, marginBottom: 5 }}>
          <Menu.Item header color={this.props.opt.theme.mainColor}>
            <Icon name="book" />
            {this.t("saleJournal")}
          </Menu.Item>
          <Menu.Menu position="left">
            <Menu.Item onClick={() => this.showAll()}            active={this.state.all}>{this.t("all")}</Menu.Item>
            <Menu.Item onClick={() => this.changeDay(today)}     active={today.isSame(this.state.day, "day") && !this.state.all}>{this.t("today")}</Menu.Item>
            <Menu.Item onClick={() => this.changeDay(yesterday)} active={yesterday.isSame(this.state.day, "day") && !this.state.all}>{this.t("yesterday")}</Menu.Item>
          </Menu.Menu>
          <Menu.Menu position="right">
            <Menu.Item>{this.t("itemCount")}</Menu.Item>
            <Menu.Item><Button>{spacedNum(this.state.itemCount)}</Button></Menu.Item>
            <Menu.Item>{this.t("totalCount")}</Menu.Item>
            <Menu.Item><Button>{spacedNum(this.state.totalCount)}</Button></Menu.Item>
            <Menu.Item>{this.t("totalCost")}</Menu.Item>
            <Menu.Item><Button color={this.props.opt.theme.mainColor}>{spacedNum(this.state.totalCost)}</Button></Menu.Item>
            <Menu.Item onClick={() => this.onPrintPreview()}><Icon name="print" /></Menu.Item>
            <Menu.Item>{this.t("discount")}</Menu.Item>
            <Menu.Item><Button>{spacedNum(this.state.discount)}</Button></Menu.Item>
            { this.state.selectedSaleCheck && 
              <Menu.Item onClick={() => this.openSaleCheck()} icon="edit"></Menu.Item>
            }
            <Popup content={this.t("prevDay")} trigger= { <Menu.Item onClick={() => this.prevDay()}><Icon name="angle left"  /></Menu.Item> } />
            <Menu.Item fitted="vertically">{this.dayPicker()}</Menu.Item>
            <Popup content={this.t("nextDay")} trigger= { <Menu.Item onClick={() => this.nextDay()}><Icon name="angle right" /></Menu.Item> } />
          </Menu.Menu>
        </Menu>
        <div style={{ flex: "1 1 auto", margin: 15, marginTop: 0 }} id="salecheck-container">
          { this.state.showSaleCheckEditor &&
            <SaleCheckEditor
              api={this.props.api}
              theme={this.props.opt.theme}
              opt={this.props.opt}
              saleCheckId={this.state.selectedSaleCheck.saleCheck.id}
              onCancel={() => this.hideSaleCheckEditor()}
              onSave={() => this.hideSaleCheckEditor()}
            />
          }
          { this.state.showSaleCheckEditor || this.renderWithList() }
        </div>
      </Fragment>
    )
  }

}

export default (withTranslation("saleCheckJournal")(SaleJournal))

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
import ConsignmentList from "./consignmentList"

import BaseConsignmentEditor      from "View/base/consignment/editor"
import AutoPartsConsignmentEditor from "View/auto/parts/consignment/editor"

class ConsignmentEditor extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    switch (this.props.opt.appMode) {
      case "base"      : return (<BaseConsignmentEditor     
        api={this.props.api}
        theme={this.props.opt.theme}
        opt={this.props.opt}
        consignmentId={this.props.consignmentId}
        onCancel={this.props.onCancel}
        onSave={this.props.onSave}
      />)
      case "auto/parts": return (<AutoPartsConsignmentEditor
        api={this.props.api}
        theme={this.props.opt.theme}
        opt={this.props.opt}
        consignmentId={this.props.consignmentId}
        onCancel={this.props.onCancel}
        onSave={this.props.onSave}
      />)
    }
  }
}

class ConsignmentJournal extends React.Component {

  constructor(props) {
    super(props)
    this.consignmentApi = props.api.consignment
    this.state = {
      itemCount  : 0,
      totalCount : 0,
      totalCost  : 0,
      day        : moment(),
      all        : false,
      list       : [],
      items      : [],
      selectedConsignment: false,
      containerHeight: 500,
      showConsignmentEditor: false,
    }
    this.t = this.props.t
  }

  componentDidMount() {
    const height = document.getElementById("consignment-container").clientHeight;
    this.setState({
      containerHeight: height,
    }, () => this.reloadJournal())
  }

  reloadJournal() {
    this.setState({
      showConsignmentEditor: false,
    }, () => {
      this.consignmentApi
        .selectConsignmentJournal(this.state.day.utc().format("YYYY-MM-DD"), this.state.all, this.state.selectedConsignment)
        .then(({ list, items }) => {
          const itemCount = items.map(i => i.items.length).reduce((a, b) => a + b, 0)
          const totalCount = items
            .map(i => i.items.map(ii => ii.quantity - ii.retQuantity).reduce((a, b) => a + b, 0))
            .reduce((a, b) => a + b, 0)
          const totalCost = items.map(i => i.consignment.cost).reduce((a, b) => a + b, 0)
          this.setState({
            list       : list,
            items      : items,
            itemCount  : itemCount,
            totalCount : totalCount,
            totalCost  : totalCost,
          })
        })
    })
  }

  onConsignmentSelected(consignment, items) {
    this.setState({
      selectedConsignment: { consignment: consignment, items: items },
    }, () => this.reloadJournal())
  }

  onNoConsignmentSelected() {
    this.setState({
      selectedConsignment: null,
      showConsignmentEditor: false,
    }, () => this.reloadJournal())
  }

  changeDay(day) {
    this.setState({
      day: day,
      all: false,
      selectedConsignment: null,
      showConsignmentEditor: false,
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
      selectedConsignment: null,
      showConsignmentEditor: false,
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

  openConsignment() {
    this.consignmentApi
      .openConsignment(this.state.selectedConsignment.consignment.id)
      .then(_ => {
        this.setState({
          showConsignmentEditor: true,
        })
      })
  }

  hideConsignmentEditor() {
    this.setState({
      showConsignmentEditor: false,
    }, () => {
      this.reloadJournal()
    })
  }

  renderWithList() {
    return (
      <Grid style={{ height: "100%" }}>
        <Grid.Column width={3}>
          <div style={{ height: this.state.containerHeight - 25, overflowY: "auto" }}>
            <ConsignmentList
              api={this.props.api}
              theme={this.props.theme}
              items={this.state.list}
              height={this.state.containerHeight}
              selected={this.state.selectedConsignment}
              onConsignmentSelected={(consignment, items) => this.onConsignmentSelected(consignment, items)}
              onNoConsignmentSelected={() => this.onNoConsignmentSelected()}
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

  render() {
    const today     = moment()
    const yesterday = moment().subtract(1, "day")
    return (
      <Fragment>
        <Menu icon style={{ marginRight: 15, marginLeft: 15, marginTop: 0, marginBottom: 5 }}>
          <Menu.Item header color={this.props.opt.theme.mainColor}>
            <Icon name="book" />
            {this.t("consignmentJournal")}
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
            { this.state.selectedConsignment && 
              <Menu.Item onClick={() => this.openConsignment()} icon="edit"></Menu.Item>
            }
            <Popup content={this.t("prevDay")} trigger= { <Menu.Item onClick={() => this.prevDay()}><Icon name="angle left"  /></Menu.Item> } />
            <Menu.Item fitted="vertically">{this.dayPicker()}</Menu.Item>
            <Popup content={this.t("nextDay")} trigger= { <Menu.Item onClick={() => this.nextDay()}><Icon name="angle right" /></Menu.Item> } />
          </Menu.Menu>
        </Menu>
        <div style={{ flex: "1 1 auto", margin: 15, marginTop: 0 }} id="consignment-container">
          { this.state.showConsignmentEditor &&
            <ConsignmentEditor
              api={this.props.api}
              theme={this.props.opt.theme}
              opt={this.props.opt}
              consignmentId={this.state.selectedConsignment.consignment.id}
              onCancel={() => this.hideConsignmentEditor()}
              onSave={() => this.hideConsignmentEditor()}
            />
          }
          { this.state.showConsignmentEditor || this.renderWithList() }
        </div>
      </Fragment>
    )
  }

}

export default (withTranslation("consignmentJournal")(ConsignmentJournal))

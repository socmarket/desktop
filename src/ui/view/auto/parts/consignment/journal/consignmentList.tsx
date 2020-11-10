import React, { Fragment } from "react"
import { connect } from "react-redux"
import moment from "moment"
import { ResponsivePie } from '@nivo/pie'
import { SingleDatePicker } from "react-dates"
import {
  Container, Grid, Form, Input, Table,
  Button, Segment, Image, Label, Menu,
  Popup, Icon, List, Header
} from "semantic-ui-react"

import {
  mround,
  spacedNum,
  maxText,
} from "Util"

const minib = {
  padding: "0.5em 0.5em",
}
import { withTranslation } from 'react-i18next';

class ConsignmentList extends React.Component {

  constructor(props) {
    super(props)
    this.t = this.props.t
  }

  renderConsignment(consignment, idx) {
    return (
      <Menu.Item
        key={idx}
        color={this.props.theme.mainColor}
        style={{ paddingTop: 10, paddingBottom: 10 }}
        active={this.props.selected && this.props.selected.consignment.id === consignment.id}
        onClick={() => this.props.onConsignmentSelected(consignment)}
      >
        <Header as="h4" style={{ marginBottom: 0 }}>{consignment.acceptedAtDate} {consignment.acceptedAtTime}</Header>
        {maxText(consignment.supplierName, 15)}
        <strong style={{ float: "right" }}>{spacedNum(consignment.cost)}</strong>
      </Menu.Item>
    )
  }

  render() {
    return (
      <Menu vertical fluid>
        <Menu.Item
          active={!this.props.selected}
          color={this.props.theme.mainColor}
          onClick={this.props.onNoConsignmentSelected}
        >
          {this.t("allItems")}
        </Menu.Item>
        {this.props.items.map((consignment, idx) => this.renderConsignment(consignment, idx))}
      </Menu>
    )
  }

}

export default (withTranslation("consignment_journal")(ConsignmentList))

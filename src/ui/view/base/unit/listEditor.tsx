import UnitInfoEditor         from "./infoEditor"
import {
  inputWithRef
}                    from "Util"

import React, { Fragment } from "react"
import moment from "moment"
import { Translation } from 'react-i18next'
import {
  Header, Grid, Table, Form, Input, Select,
  TextArea, Button, Segment, Image, Icon,
  Label, Container, Menu, Message, Divider,
  Rail, Dropdown
} from "semantic-ui-react"
import { withTranslation } from 'react-i18next';

class UnitListEditor extends React.Component {

  emptyUnit = {
    id       : -1,
    title    : "",
    notation : "",
  }

  constructor(props) {
    super(props)

    this.onCreate        = this.onCreate.bind(this)
    this.onUpdate        = this.onUpdate.bind(this)
    this.onKeyDown       = this.onKeyDown.bind(this)
    this.onGlobalKeyDown = this.onGlobalKeyDown.bind(this)
    this.onPatternChange = this.onPatternChange.bind(this)

    this.closeInfoEditor = this.closeInfoEditor.bind(this)

    this.tableRef        = React.createRef()
    this.patternInputRef = React.createRef()
    this.patternInput    = inputWithRef(this.patternInputRef)

    this.unitApi = props.api.unit
    this.state = {
      unit            : this.emptyUnit,
      items             : [],
      pattern           : "",
      infoEditorVisible : false,
      idx               : -1,
    }
    this.t = this.props.t
  }

  reloadUnitList() {
    const idx = this.state.idx
    return this.unitApi
      .find(this.state.pattern)
      .then(items => this.setState({
        items: items,
        idx  : idx >= items.length ? items.length - 1: idx
      }))
  }

  componentDidMount() {
    this.reloadUnitList()
  }

  openUnit(unit, idx) {
    this.setState({
      unit            : unit,
      infoEditorVisible : true,
    })
  }

  closeInfoEditor() {
    this.setState({
      infoEditorVisible : false,
    }, () => {
      this.patternInputRef.current.focus()
    })
  }

  openExhangeRatesFor(unit, idx) {
    this.setState({
      idx    : idx,
      unit : unit,
    })
  }

  onCreate() {
    this.closeInfoEditor()
    this.reloadUnitList()
  }

  onUpdate() {
    this.closeInfoEditor()
    this.reloadUnitList()
  }

  onKeyDown(ev) {
    const count = this.state.items.length
    switch (ev.key) {
      case "ArrowUp": {
        const cidx = this.state.idx <= 0 ? count : this.state.idx
        const unit = this.state.items[cidx - 1]
        this.setState({
          idx: cidx - 1,
          unit: unit ? unit : this.emptyUnit,
        })
        break
      }
      case "ArrowDown": {
        const cidx = this.state.idx === (count - 1) ? -1 : this.state.idx
        const unit = this.state.items[cidx + 1]
        this.setState({
          idx: cidx + 1,
          unit: unit ? unit : this.emptyUnit,
        })
        break
      }
      case "Enter": {
        if (ev.shiftKey) {
          this.onActivate()
        } else {
          const unit = this.state.items[this.state.idx]
          this.openUnit(unit ? unit : emptyUnit, this.state.idx)
        }
        break
      }
    }
  }

  onGlobalKeyDown(ev) {
    switch (ev.key) {
      case "Escape": {
        this.patternInputRef.current.focus()
      }
    }
  }

  onPatternChange(ev) {
    this.setState({
      pattern: ev.target.value,
    }, () => this.reloadUnitList())
  }

  infoEditor() {
    return (
      <UnitInfoEditor
        open
        api={this.props.api}
        theme={this.props.theme}
        unit={this.state.unit}
        onCreate={this.onCreate}
        onUpdate={this.onUpdate}
        onClose={this.closeInfoEditor}
      />
    )
  }

  list() {
    return (
      <Segment raised color={this.props.theme.mainColor} onKeyDown={this.onKeyDown} tabIndex={-1}>
        <Header as="h2" dividing color={this.props.theme.mainColor} textAlign="center">
          <Icon name="law" />
          {this.t("units")}
        </Header>
        <Form width={16}>
          <Form.Group>
            <Form.Input
              floated="left"
              icon="search"
              placeholder={this.t("unitSearch")}
              value={this.state.pattern}
              control={this.patternInput}
              onChange={this.onPatternChange}
            />
            <Button floated="right" icon="plus" onClick={() => this.openUnit(this.emptyUnit, -1)} />
          </Form.Group>
        </Form>
        <Menu vertical fluid>
          {this.state.items.map((unit, idx) => (
            <Menu.Item
              key={unit.id}
              active={this.state.unit.id === unit.id}
              color={this.props.theme.mainColor}
              onClick={() => this.openUnit(unit, idx)}
            >
              {unit.title}
              <Label size="large" color={unit.balance < 0 ? "red" : "green"}>
                {unit.balance}
              </Label>
            </Menu.Item>
          ))}
        </Menu>
      </Segment>
    )
  }

  render() {
    return (
      <Fragment>
        {this.list()}
        {this.state.infoEditorVisible && this.infoEditor()}
      </Fragment>
    )
  }
}

export default withTranslation("base_unit_listEditor.form")(UnitListEditor)

import SupplierInfoEditor from "./infoEditor"
import SupplierJournal    from "./journal"
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

class SupplierEditor extends React.Component {

  emptySupplier = {
    id       : -1,
    name     : "",
    contacts : "",
    notes    : "",
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

    this.supplierApi = props.api.supplier
    this.state = {
      supplier            : this.emptySupplier,
      items             : [],
      journal           : [],
      pattern           : "",
      infoEditorVisible : false,
      idx               : -1,
    }
  }

  reloadSupplierList() {
    const idx = this.state.idx
    return this.supplierApi
      .find(this.state.pattern)
      .then(items => this.setState({
        items: items,
        idx  : idx >= items.length ? items.length - 1: idx
      }))
  }

  componentDidMount() {
    this.reloadSupplierList()
  }

  openSupplier(supplier, idx) {
    this.setState({
      supplier            : supplier,
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

  openJournalFor(supplier, idx) {
    this.setState({
      idx    : idx,
      supplier : supplier,
    })
  }

  onCreate() {
    this.closeInfoEditor()
    this.reloadSupplierList()
  }

  onUpdate() {
    this.closeInfoEditor()
    this.reloadSupplierList()
  }

  onKeyDown(ev) {
    const count = this.state.items.length
    switch (ev.key) {
      case "ArrowUp": {
        const cidx = this.state.idx <= 0 ? count : this.state.idx
        const supplier = this.state.items[cidx - 1]
        this.setState({
          idx: cidx - 1,
          supplier: supplier ? supplier : this.emptySupplier,
        })
        break
      }
      case "ArrowDown": {
        const cidx = this.state.idx === (count - 1) ? -1 : this.state.idx
        const supplier = this.state.items[cidx + 1]
        this.setState({
          idx: cidx + 1,
          supplier: supplier ? supplier : this.emptySupplier,
        })
        break
      }
      case "Enter": {
        if (ev.shiftKey) {
          this.onActivate()
        } else {
          const supplier = this.state.items[this.state.idx]
          this.openSupplier(supplier ? supplier : emptySupplier, this.state.idx)
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
    }, () => this.reloadSupplierList())
  }

  infoEditor() {
    return (
      <SupplierInfoEditor
        open
        api={this.props.api}
        theme={this.props.theme}
        supplier={this.state.supplier}
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
          <Icon name="users" />
          Поставщики
        </Header>
        <Form width={16}>
          <Form.Group>
            <Form.Input
              floated="left"
              icon="search"
              placeholder="Поиск поставщика"
              value={this.state.pattern}
              control={this.patternInput}
              onChange={this.onPatternChange}
            />
            <Button floated="right" icon="plus" onClick={() => this.openSupplier(this.emptySupplier, -1)} />
          </Form.Group>
        </Form>
        <Menu vertical fluid>
          {this.state.items.map((supplier, idx) => (
            <Menu.Item
              key={supplier.id}
              active={this.state.supplier.id === supplier.id}
              color={this.props.theme.mainColor}
              onClick={() => this.openJournalFor(supplier, idx)}
              onDoubleClick={() => this.openSupplier(supplier, idx)}
            >
              {supplier.name}
              <Label size="large" color={supplier.balance < 0 ? "red" : "green"}>
                {supplier.balance}
              </Label>
            </Menu.Item>
          ))}
        </Menu>
      </Segment>
    )
  }

  journal() {
    return (
      <SupplierJournal
        ref={this.tableRef}
        api={this.props.api}
        supplier={this.state.supplier}
        opt={this.props.opt}
        theme={this.props.theme}
        onUpdate={() => this.reloadSupplierList()}
      />
    )
  }

  render() {
    return (
      <Fragment>
        <Grid padded tabIndex={-1} onKeyDown={this.onGlobalKeyDown} className="light-focus">
          <Grid.Column width={4}>
            {this.list()}
          </Grid.Column>
          <Grid.Column width={6}>
            {this.state.supplier.id > 0 && this.journal()}
          </Grid.Column>
        </Grid>
        {this.state.infoEditorVisible && this.infoEditor()}
      </Fragment>
    )
  }
}

export default SupplierEditor

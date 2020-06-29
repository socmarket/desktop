import ClientInfoEditor from "./infoEditor"
import ClientJournal    from "./journal"
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

class ClientEditor extends React.Component {

  emptyClient = {
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

    this.clientApi = props.api.client
    this.state = {
      client            : this.emptyClient,
      items             : [],
      journal           : [],
      pattern           : "",
      infoEditorVisible : false,
      idx               : -1,
    }
  }

  reloadClientList() {
    const idx = this.state.idx
    return this.clientApi
      .find(this.state.pattern)
      .then(items => this.setState({
        items: items,
        idx  : idx >= items.length ? items.length - 1: idx
      }))
  }

  componentDidMount() {
    this.reloadClientList()
  }

  openClient(client, idx) {
    this.setState({
      client            : client,
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

  openJournalFor(client, idx) {
    this.setState({
      idx    : idx,
      client : client,
    })
  }

  onCreate() {
    this.closeInfoEditor()
    this.reloadClientList()
  }

  onUpdate() {
    this.closeInfoEditor()
    this.reloadClientList()
  }

  onKeyDown(ev) {
    const count = this.state.items.length
    switch (ev.key) {
      case "ArrowUp": {
        const cidx = this.state.idx <= 0 ? count : this.state.idx
        const client = this.state.items[cidx - 1]
        this.setState({
          idx: cidx - 1,
          client: client ? client : this.emptyClient,
        })
        break
      }
      case "ArrowDown": {
        const cidx = this.state.idx === (count - 1) ? -1 : this.state.idx
        const client = this.state.items[cidx + 1]
        this.setState({
          idx: cidx + 1,
          client: client ? client : this.emptyClient,
        })
        break
      }
      case "Enter": {
        if (ev.shiftKey) {
          this.onActivate()
        } else {
          const client = this.state.items[this.state.idx]
          this.openClient(client ? client : emptyClient, this.state.idx)
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
    }, () => this.reloadClientList())
  }

  infoEditor() {
    return (
      <ClientInfoEditor
        open
        api={this.props.api}
        theme={this.props.theme}
        client={this.state.client}
        onCreate={this.onCreate}
        onUpdate={this.onUpdate}
        onClose={this.closeInfoEditor}
      />
    )
  }

  list() {
    return (
      <Segment raised
        color={this.props.theme.mainColor}
        onKeyDown={this.onKeyDown}
        tabIndex={-1}
      >
        <Header as="h2" dividing color={this.props.theme.mainColor} textAlign="center">
          <Icon name="users" />
          Клиенты
        </Header>
        <Form width={16}>
          <Form.Group>
            <Form.Input
              floated="left"
              icon="search"
              placeholder="Поиск клиента"
              value={this.state.pattern}
              control={this.patternInput}
              onChange={this.onPatternChange}
            />
            <Button floated="right" icon="plus" onClick={() => this.openClient(this.emptyClient, -1)} />
          </Form.Group>
        </Form>
        <Menu vertical fluid>
          {this.state.items.map((client, idx) => (
            <Menu.Item
              key={client.id}
              active={this.state.client.id === client.id}
              color={this.props.theme.mainColor}
              onClick={() => this.openJournalFor(client, idx)}
              onDoubleClick={() => this.openClient(client, idx)}
            >
              {client.name}
              <Label size="large" color={client.balance < 0 ? "red" : "green"}>
                {client.balance}
              </Label>
            </Menu.Item>
          ))}
        </Menu>
      </Segment>
    )
  }

  journal() {
    return (
      <ClientJournal
        ref={this.tableRef}
        api={this.props.api}
        client={this.state.client}
        opt={this.props.opt}
        theme={this.props.theme}
        onUpdate={() => this.reloadClientList()}
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
            {this.state.client.id > 0 && this.journal()}
          </Grid.Column>
        </Grid>
        {this.state.infoEditorVisible && this.infoEditor()}
      </Fragment>
    )
  }
}

export default ClientEditor

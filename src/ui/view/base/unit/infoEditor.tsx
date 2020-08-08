import {
  inputWithRef,
}                     from "Util"

import React, { Fragment } from "react"
import { connect } from "react-redux"
import {
  Grid, Form, Input, Button,
  Segment, Message, Modal,
  Container, Header, Divider
} from "semantic-ui-react"
import { withTranslation } from 'react-i18next';

class UnitInfoEditor extends React.Component {

  constructor(props) {
    super(props)

    this.onTitleChange    = this.onTitleChange.bind(this)
    this.onNotationChange = this.onNotationChange.bind(this)
    this.onCreate         = this.onCreate.bind(this)
    this.onUpdate         = this.onUpdate.bind(this)
    this.onKeyDown        = this.onKeyDown.bind(this)

    this.titleInputRef = React.createRef()
    this.titleInput    = inputWithRef(this.titleInputRef)

    this.unitApi = props.api.unit
    this.state = {
      ...props.unit,
      errorMsg: "",
    }
    this.t = this.props.t
  }

  componentDidMount() {
    this.titleInputRef.current.focus()
    this.titleInputRef.current.select()
  }

  validated() {
    return this.state.title.length > 0
  }

  onTitleChange(ev) {
    this.setState({
      title: ev.target.value
    })
  }

  onNotationChange(ev) {
    this.setState({
      notation: ev.target.value
    })
  }

  onCreate() {
    console.log(this.state)
    this.unitApi.insert(this.state)
      .then(_ => this.props.onCreate(this.state))
  }

  onUpdate() {
    console.log(this.props)
    this.unitApi.update(this.state)
      .then(_ => this.props.onUpdate(this.state))
  }

  onKeyDown(ev) {
    if (ev.key === "Enter" && ev.shiftKey && this.validated()) {
      if (this.props.unit.id < 0) {
        this.onCreate()
      } else {
        this.onUpdate()
      }
    }
  }

  form() {
    return (
      <Form>
        <Form.Field>
          <Form.Input
            label={this.t("name")}
            value={this.state.title || ""}
            control={this.titleInput}
            onChange={this.onTitleChange}
          />
        </Form.Field>
        <Form.Field>
          <Form.Input
            label={this.t("reduction")}
            value={this.state.notation || ""}
            onChange={this.onNotationChange}
          />
        </Form.Field>
        {this.props.unit.id < 0 &&
          <Button color={this.props.theme.mainColor}
            type="button"
            disabled={!this.validated()}
            onClick={this.onCreate}>{this.t("create")} (Shift + Enter)
        </Button>}
        {this.props.unit.id > 0 &&
          <Button color={this.props.theme.mainColor}
            type="button"
            disabled={!this.validated()}
            onClick={this.onUpdate}>{this.t("update")} (Shift + Enter)
        </Button>}
      </Form>
    )
  }

  content() {
    return (
      <Segment onKeyDown={this.onKeyDown}>
        {this.form()}
      </Segment>
    )
  }

  unitDesc() {
    return `#${this.props.unit.id}: ${this.props.unit.title}`
  }

  render() {
    const header =
      this.state.id ?
        (this.state.id > 0 ? this.unitDesc() : this.t("new_unit_registration")) :
        this.t("opening_error")
    return (
      <Modal
        open={this.props.open}
        size="small"
        centered={false}
        onClose={this.props.onClose}
      >
        <Modal.Header>
          {this.t("unit")}: {header}
        </Modal.Header>
        <Modal.Content>
          {this.content()}
        </Modal.Content>
      </Modal>
    )
  }
}

export default withTranslation("base_unit_infoEditor.form")(UnitInfoEditor)

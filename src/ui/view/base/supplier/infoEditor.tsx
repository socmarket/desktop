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

class SupplierInfoEditor extends React.Component {

  constructor(props) {
    super(props)

    this.onNameChange     = this.onNameChange.bind(this)
    this.onContactsChange = this.onContactsChange.bind(this)
    this.onNotesChange    = this.onNotesChange.bind(this)
    this.onCreate         = this.onCreate.bind(this)
    this.onUpdate         = this.onUpdate.bind(this)
    this.onKeyDown        = this.onKeyDown.bind(this)

    this.nameInputRef = React.createRef()
    this.nameInput    = inputWithRef(this.nameInputRef)

    this.supplierApi = props.api.supplier
    this.state = {
      ...props.supplier,
      errorMsg: "",
    }
    this.t = this.props.t
  }

  componentDidMount() {
    this.nameInputRef.current.focus()
    this.nameInputRef.current.select()
  }

  validated() {
    return this.state.name.length > 0
  }

  onNameChange(ev) {
    this.setState({
      name: ev.target.value
    })
  }

  onContactsChange(ev) {
    this.setState({
      contacts: ev.target.value
    })
  }

  onNotesChange(ev) {
    this.setState({
      notes: ev.target.value
    })
  }

  onCreate() {
    this.supplierApi.insert(this.state)
      .then(_ => this.props.onCreate(this.state))
  }

  onUpdate() {
    this.supplierApi.update(this.state)
      .then(_ => this.props.onUpdate(this.state))
  }

  onKeyDown(ev) {
    if (ev.key === "Enter" && ev.shiftKey && this.validated()) {
      if (this.props.supplier.id < 0) {
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
            label={this.t("fullName")}
            value={this.state.name || ""}
            control={this.nameInput}
            onChange={this.onNameChange}
          />
        </Form.Field>
        <Form.Field>
          <Form.TextArea
            label={this.t("contacts")}
            value={this.state.contacts || ""}
            onChange={this.onContactsChange}
          />
        </Form.Field>
        <Form.Field>
          <Form.TextArea
            label={this.t("notes")}
            value={this.state.notes || ""}
            onChange={this.onNotesChange}
          />
        </Form.Field>
        {this.props.supplier.id < 0 &&
          <Button color={this.props.theme.mainColor}
            type="button"
            disabled={!this.validated()}
            onClick={this.onCreate}>this.t("create") (Shift + Enter)
        </Button>}
        {this.props.supplier.id > 0 &&
          <Button color={this.props.theme.mainColor}
            type="button"
            disabled={!this.validated()}
            onClick={this.onUpdate}>this.t("update") (Shift + Enter)
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

  supplierDesc() {
    return `#${this.props.supplier.id}: ${this.props.supplier.name}`
  }

  render() {
    const header =
      this.state.id ?
          (this.state.id > 0 ? this.supplierDesc() : this.t("supplierRegistration")) :
        this.t("openingError")
    return (
      <Modal
        open={this.props.open}
        size="small"
        centered={false}
        onClose={this.props.onClose}
      >
        <Modal.Header>
          {this.t("supplier")}: {header}
        </Modal.Header>
        <Modal.Content>
          {this.content()}
        </Modal.Content>
      </Modal>
    )
  }
}

export default withTranslation("base_supplier_infoEditor.form")(SupplierInfoEditor)

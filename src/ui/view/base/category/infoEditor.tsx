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

class CategoryInfoEditor extends React.Component {

  constructor(props) {
    super(props)

    this.onTitleChange = this.onTitleChange.bind(this)
    this.onNotesChange = this.onNotesChange.bind(this)
    this.onCreate      = this.onCreate.bind(this)
    this.onUpdate      = this.onUpdate.bind(this)
    this.onKeyDown     = this.onKeyDown.bind(this)

    this.titleInputRef = React.createRef()
    this.titleInput    = inputWithRef(this.titleInputRef)

    this.categoryApi = props.api.category
    this.state = {
      ...props.category,
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

  onNotesChange(ev) {
    this.setState({
      notes: ev.target.value
    })
  }

  onCreate() {
    this.categoryApi.insert(this.state)
      .then(_ => this.props.onCreate(this.state))
  }

  onUpdate() {
    this.categoryApi.update(this.state)
      .then(_ => this.props.onUpdate(this.state))
  }

  onKeyDown(ev) {
    if (ev.key === "Enter" && ev.shiftKey && this.validated()) {
      if (this.props.category.id < 0) {
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
          <Form.TextArea
            label={this.t("notation")}
            value={this.state.notes || ""}
            onChange={this.onNotesChange}
          />
        </Form.Field>
        {this.props.category.id < 0 &&
          <Button color={this.props.theme.mainColor}
            type="button"
            disabled={!this.validated()}
            onClick={this.onCreate}>{this.t("create")} (Shift + Enter)
        </Button>}
        {this.props.category.id > 0 &&
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

  categoryDesc() {
    return `#${this.props.category.id}: ${this.props.category.title}`
  }

  render() {
    const header =
      this.state.id ?
        (this.state.id > 0 ? this.categoryDesc() : this.t("groupRegistration")) :
        this.t("openingError")
    return (
      <Modal
        open={this.props.open}
        size="small"
        centered={false}
        onClose={this.props.onClose}
      >
        <Modal.Header>
          {this.t("productGroup")}: {header}
        </Modal.Header>
        <Modal.Content>
          {this.content()}
        </Modal.Content>
      </Modal>
    )
  }
}

export default (withTranslation("categoryForm")(CategoryInfoEditor))

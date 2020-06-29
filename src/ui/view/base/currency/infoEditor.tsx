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

class CurrencyInfoEditor extends React.Component {

  constructor(props) {
    super(props)

    this.onTitleChange    = this.onTitleChange.bind(this)
    this.onNotationChange = this.onNotationChange.bind(this)
    this.onNotesChange    = this.onNotesChange.bind(this)
    this.onCreate         = this.onCreate.bind(this)
    this.onUpdate         = this.onUpdate.bind(this)
    this.onKeyDown        = this.onKeyDown.bind(this)

    this.titleInputRef = React.createRef()
    this.titleInput    = inputWithRef(this.titleInputRef)

    this.currencyApi = props.api.currency
    this.state = {
      ...props.currency,
      errorMsg: "",
    }
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

  onNotesChange(ev) {
    this.setState({
      notes: ev.target.value
    })
  }

  onCreate() {
    this.currencyApi.insert(this.state)
      .then(_ => this.props.onCreate(this.state))
  }

  onUpdate() {
    this.currencyApi.update(this.state)
      .then(_ => this.props.onUpdate(this.state))
  }

  onKeyDown(ev) {
    if (ev.key === "Enter" && ev.shiftKey && this.validated()) {
      if (this.props.currency.id < 0) {
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
            label="Наименование"
            value={this.state.title || ""}
            control={this.titleInput}
            onChange={this.onTitleChange}
          />
        </Form.Field>
        <Form.Field>
          <Form.Input
            label="Сокращение"
            value={this.state.notation || ""}
            onChange={this.onNotationChange}
          />
        </Form.Field>
        {this.props.currency.id < 0 &&
          <Button color={this.props.theme.mainColor}
            type="button"
            disabled={!this.validated()}
            onClick={this.onCreate}>Создать (Shift + Enter)
        </Button>}
        {this.props.currency.id > 0 &&
          <Button color={this.props.theme.mainColor}
            type="button"
            disabled={!this.validated()}
            onClick={this.onUpdate}>Изменить (Shift + Enter)
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

  currencyDesc() {
    return `#${this.props.currency.id}: ${this.props.currency.title}` 
  }

  render() {
    const header =
      this.state.id ?
        (this.state.id > 0 ? this.currencyDesc() : "Регистрация новой валюты") :
        "Ошибка открытия"
    return (
      <Modal
        open={this.props.open}
        size="small"
        centered={false}
        onClose={this.props.onClose}
      >
        <Modal.Header>
          Валюта: {header}
        </Modal.Header>
        <Modal.Content>
          {this.content()}
        </Modal.Content>
      </Modal>
    )
  }
}

export default CurrencyInfoEditor

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

  unitDesc() {
    return `#${this.props.unit.id}: ${this.props.unit.title}`
  }

  render() {
    const header =
      this.state.id ?
        (this.state.id > 0 ? this.unitDesc() : "Регистрация новой единицы измерения") :
        "Ошибка открытия"
    return (
      <Modal
        open={this.props.open}
        size="small"
        centered={false}
        onClose={this.props.onClose}
      >
        <Modal.Header>
          Единица измерения: {header}
        </Modal.Header>
        <Modal.Content>
          {this.content()}
        </Modal.Content>
      </Modal>
    )
  }
}

export default UnitInfoEditor

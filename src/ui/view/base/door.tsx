import { AppActions }      from "Store/base/app"
import { SettingsActions } from "Store/base/settings"

import React, { Fragment } from "react"
import { connect } from "react-redux"
import { Button, Form, Grid, Header, Image, Message, Segment, Label } from "semantic-ui-react"

const users = [
  { key: "cashier", value: "cashier", text: "Кассир"   },
  { key: "manager", value: "manager", text: "Менеджер" },
  { key: "admin"  , value: "admin"  , text: "Владелец" },
]

class Door extends React.Component {

  constructor(props) {
    super(props)
    this.settingsApi  = props.api.settings
    this.onPinChange  = this.onPinChange.bind(this)
    this.onPin2Change = this.onPin2Change.bind(this)
    this.state = {
      pin: "",
      pin2: "",
    }
  }

  needR() {
    const user = this.props.app.user
    const opt = this.props.opt
    return !(opt[user+"PinHash"] && opt[user+"PinHash"].length > 0)
  }

  regOrSignIn() {
    if (this.needR()) {
      if (this.state.pin.length > 0 && this.state.pin === this.state.pin2) {
        this.settingsApi
          .setUserPin(this.props.app.user, this.state.pin)
          .then(_ => this.props.reloadSettings())
          .then(_ => this.props.auth(this.state.pin))
      }
    } else {
      this.props.auth(this.state.pin)
    }
  }

  onPinChange(ev) {
    if (ev.target.value.length < 5) {
      this.setState({
        pin: ev.target.value
      }, () => this.regOrSignIn())
    }
  }

  onPin2Change(ev) {
    if (ev.target.value.length < 5) {
      this.setState({
        pin2: ev.target.value
      }, () => this.regOrSignIn())
    }
  }

  render() {
    const needReg = this.needR()
    const theme = this.props.opt.theme
    return (
      <Fragment>
        <Grid textAlign="center" style={{ height: "100vh" }} verticalAlign="middle">
          <Grid.Column style={{ maxWidth: 350 }}>
            <Label color={theme.mainColor}  size="big" style={{ padding: 5, margin: 0 }}>SOC</Label>
            <Label color="green" size="big" style={{ padding: 5, margin: 0 }}>Market</Label>
            <Label color={theme.mainColor}  size="big" style={{ padding: 5, margin: 0 }}>2C</Label>
            <Header as="h2" color="teal" textAlign="center">
              { !needReg && "Войдите чтобы продолжить работу" }
              { needReg && "Установите пароль чтобы продолжить работу" }
            </Header>
            <Form size="large" error={this.props.app.lastError.length > 0}>
              <Form.Select
                autoFocus
                fluid
                value={this.props.app.user}
                options={users}
                onChange={(ev, { value }) => this.props.changeUser(value)}
              />
              <Form.Input
                fluid
                icon="lock"
                iconPosition="left"
                placeholder="Пин"
                type="password"
                value={this.state.pin}
                onChange={this.onPinChange}
              />
              {needReg && <Form.Input
                fluid
                icon="lock"
                iconPosition="left"
                placeholder="Повторите пароль"
                type="password"
                value={this.state.pin2}
                onChange={this.onPin2Change}
              />}
              <Message error>{}</Message>
            </Form>
          </Grid.Column>
        </Grid>
      </Fragment>
    );
  }
}

const stateMap = (state) => {
  return {
    app: state.app,
    opt: state.settings,
  }
}

export default connect(stateMap, { ...AppActions, ...SettingsActions })(Door);

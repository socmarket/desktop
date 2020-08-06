import { AppActions }      from "Store/base/app"
import { SettingsActions } from "Store/base/settings"

import React, { Fragment } from "react"
import { connect } from "react-redux"
import { Button, Form, Grid, Header, Image, Message, Segment, Label } from "semantic-ui-react"


class Auth extends React.Component {

  constructor(props) {
    super(props)
    this.onMsisdnChange = this.onMsisdnChange.bind(this)
    this.onSendCode     = this.onSendCode.bind(this)
    this.serverApi   = props.api.server
    this.settingsApi = props.api.settings
    this.state = {
      msisdn: "",
    }
  }

  onMsisdnChange(ev) {
    this.setState({
      msisdn: ev.target.value,
    })
  }

  onSendCode() {
    this.serverApi.auth
      .sendCode(this.state.msisdn, "")
  }

  render() {
    const theme = this.props.opt.theme
    const online = this.props.app.online
    return (
      <Fragment>
        <Grid textAlign="center" style={{ height: "100vh" }} verticalAlign="middle">
          <Grid.Column style={{ maxWidth: 350 }}>
            <Label color={theme.mainColor}  size="big" style={{ padding: 5, margin: 0 }}>SOC</Label>
            <Label color="green" size="big" style={{ padding: 5, margin: 0 }}>Market</Label>
            <Label color={theme.mainColor}  size="big" style={{ padding: 5, margin: 0 }}>2C</Label>
            <Header as="h2" color="teal" textAlign="center">
              Зарегистрируйтесь чтобы продолжить работу
            </Header>
            <Form size="large" error={this.props.app.lastError.length > 0}>
              <Form.Input
                fluid
                icon="phone"
                iconPosition="left"
                placeholder="Телефон"
                type="input"
                value={this.state.msisdn}
                onChange={this.onMsisdnChange}
              />
              { online && <Button disabled={this.state.msisdn === ""} onClick={this.onSendCode} >Отправить код</Button> }
              { !online && <Button disabled>Ожидание сети...</Button> }
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

export default connect(stateMap, { ...AppActions, ...SettingsActions })(Auth);

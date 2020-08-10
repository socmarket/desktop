import { AppActions }      from "Store/base/app"
import { SettingsActions } from "Store/base/settings"

import React, { Fragment } from "react"
import { connect } from "react-redux"
import { Button, Form, Grid, Header, Image, Message, Segment, Label, Table } from "semantic-ui-react"


class Auth extends React.Component {

  constructor(props) {
    super(props)
    this.onMsisdnChange = this.onMsisdnChange.bind(this)
    this.onCodeChange   = this.onCodeChange.bind(this)
    this.onSendCode     = this.onSendCode.bind(this)
    this.onVerify       = this.onVerify.bind(this)
    this.onTick         = this.onTick.bind(this)
    this.serverApi   = props.api.server
    this.settingsApi = props.api.settings
    this.state = {
      msisdn: "",
      code: "",
      codeSent: false,
      waiting: false,
      error: false,
      accounts: [],
    }
  }

  componentDidMount() {
    this.serverApi
      .auth
      .accounts()
      .then(accounts => {
        this.setState({
          accounts: accounts
        })
      })
  }

  onTick() {
    if (this.state.timeout > 0) {
      this.setState({
        timeout: this.state.timeout - 1
      }, () => setTimeout(this.onTick, 1000))
    } else {
      this.setState({
        waiting: false,
        error: false,
      })
    }
  }

  onMsisdnChange(ev) {
    this.setState({
      msisdn: ev.target.value,
    })
  }

  onCodeChange(ev) {
    this.setState({
      code: ev.target.value,
    })
  }

  onSendCode() {
    this.serverApi.auth
      .sendCode(this.state.msisdn, "", "")
      .then(_ => this.setState({
        codeSent: true,
        waiting: true,
        timeout: 60,
      }, () => setTimeout(this.onTick, 0)))
      .catch(e => {
        this.setState({
          error: true,
          waiting: true,
          timeout: 60,
        }, () => setTimeout(this.onTick, 0))
      })
  }

  onVerify() {
    this.serverApi
      .auth
      .verify(this.state.msisdn, this.state.code)
      .then(res => {
        console.log(res)
      })
      .catch(e => {
        console.log(e)
      })
  }

  authPage() {
    const theme = this.props.opt.theme
    const online = this.props.app.online
    return (
      <Grid textAlign="center" style={{ height: "90vh" }} verticalAlign="middle">
        <Grid.Column style={{ maxWidth: 350 }}>
          <Label color={theme.mainColor}  size="big" style={{ padding: 5, margin: 0 }}>SOC</Label>
          <Label color="green" size="big" style={{ padding: 5, margin: 0 }}>Market</Label>
          <Label color={theme.mainColor}  size="big" style={{ padding: 5, margin: 0 }}>2C</Label>
          <Header as="h2" color="teal" textAlign="center">
            Зарегистрируйтесь чтобы продолжить работу
          </Header>
          <Form size="large" error={this.state.error}>
            { !this.state.codeSent &&
              <Fragment>
                <Form.Input
                  fluid
                  icon="phone"
                  iconPosition="left"
                  placeholder="Телефон"
                  type="input"
                  value={this.state.msisdn}
                  onChange={this.onMsisdnChange}
                />
                { online &&
                  <Button disabled={this.state.msisdn === "" || this.state.waiting} onClick={this.onSendCode}>
                    Отправить код
                  </Button>
                }
                { !online && <Button disabled>Ожидание сети...</Button> }
              </Fragment>
            }
            { this.state.codeSent &&
              <Fragment>
                <Form.Input
                  fluid
                  icon="code"
                  iconPosition="left"
                  placeholder="Код из СМС"
                  type="input"
                  value={this.state.code}
                  onChange={this.onCodeChange}
                />
                { online && <Button disabled={this.state.code === ""} onClick={this.onVerify} >Далее</Button> }
                { online &&
                  <Button
                    disabled={this.state.msisdn === "" || this.state.waiting}
                    onClick={this.onSendCode} >Отправить код еще раз
                  </Button>
                }
                { !online && <Button disabled>Ожидание сети...</Button> }
              </Fragment>
            }
            { this.state.waiting && <Message>Запросить код повторно можно через {this.state.timeout} секунд.</Message> }
            { this.state.error && <Message error>Ошибка запроса кода</Message> }
          </Form>
        </Grid.Column>
      </Grid>
    )
  }

  accountsTable() {
    return (
      <Table>
        <Table.Header>
          <Table.HeaderCell>Номер</Table.HeaderCell>
        </Table.Header>
        <Table.Body>
          { this.state.accounts.map(acc => (
            <Table.Row>
              <Table.HeaderCell>{acc.msisdn}</Table.HeaderCell>
            </Table.Row>
          )) }
        </Table.Body>
      </Table>
    )
  }

  accountsPage() { 
    return (
      <Grid>
        <Grid.Column width={8}>
          {this.accountsTable()}
        </Grid.Column>
        <Grid.Column width={8}>
          <Segment>
            Info
          </Segment>
        </Grid.Column>
      </Grid>
    )
  }

  render() {
    if (this.state.accounts.length > 0) {
      return this.accountsPage()
    } else {
      return this.authPage()
    }
  }
}

const stateMap = (state) => {
  return {
    app: state.app,
    opt: state.settings,
  }
}

export default connect(stateMap, { ...AppActions, ...SettingsActions })(Auth)

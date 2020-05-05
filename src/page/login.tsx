import React, { Fragment } from "react";
import { connect } from "react-redux";
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react'
import { AppActions } from "../serv/app"
import { AclActions } from "../serv/acl"

class LoginPage extends React.Component {
  render() {
    const user = this.props.acl.currentUser;
    const isAuth = this.props.acl.authenticated;
    const userFound = user.id > 0;
    const isReg = !this.props.acl.currentUser.passwordNotSet;
    const active = this.props.acl.login.length > 0 &&
      this.props.acl.password.length > 0 &&
      this.props.acl.password.length > 0;
    return (
      <Fragment>
        <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
          <Grid.Column style={{ maxWidth: 350 }}>
            <Header as='h2' color='teal' textAlign='center'>
              { isReg && "Войдите чтобы продолжить работу" }
              { !isReg && "Установите пароль чтобы продолжить работу" }
            </Header>
            <Form size='large' error={this.props.acl.lastError.length > 0}>
              <Form.Input
                autoFocus
                fluid
                icon='user'
                iconPosition='left'
                placeholder='Логин'
                value={this.props.acl.login}
                onChange={this.props.onLoginChange}
                onBlur={this.props.findUser}
              />
              <Form.Input
                fluid
                icon='lock'
                iconPosition='left'
                placeholder='Пароль'
                type='password'
                value={this.props.acl.password}
                onChange={this.props.onPasswordChange}
              />
              {!isReg && <Form.Input
                fluid
                icon='lock'
                iconPosition='left'
                placeholder='Повторите пароль'
                type='password'
                value={this.props.acl.password2}
                onChange={this.props.onPassword2Change}
              />}
              <Message error>{this.props.acl.lastError}</Message>
              <Button
                fluid
                color='teal'
                size='large'
                disabled={!active}
                onClick={this.props.authOrReg}
              >
                {isReg && "Войти"}
                {!isReg && "Установить пароль"}
              </Button>
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
    acl: state.acl,
  };
}

export default connect(stateMap, { ...AppActions, ...AclActions })(LoginPage);


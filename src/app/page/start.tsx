import React, { Fragment } from "react";
import { connect } from "react-redux";
import { AppActions } from "serv/app";
import { AclActions } from "serv/acl";

import HomePage from "./home"
import LoginPage from "./login"

class StartPage extends React.Component {
  render() {
    const authenticated = this.props.acl.authenticated;
    return (
      <Fragment>
        { authenticated && <HomePage /> }
        { !authenticated && <LoginPage /> }
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

export default connect(stateMap, { ...AppActions, ...AclActions })(StartPage);

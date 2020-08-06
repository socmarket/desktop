import React from "react"
import { connect } from "react-redux"

import Home from "Ui/view/base/home"
import Door from "Ui/view/base/door"
import Auth from "Ui/view/base/auth"

const ViewSelector = {
  true  : (api) => <Home api={api} />,
  false : (api) => <Door api={api} />,
}

class StartPage extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    if (this.props.app.authenticated) {
      return ViewSelector[this.props.app.unlocked](api)
    } else {
      return <Auth api={api} />
    }
  }
}

const stateMap = (store) => {
  return {
    app: store.app,
  }
}

export default connect(stateMap, {})(StartPage)

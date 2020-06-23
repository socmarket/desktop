import React from "react"
import { connect } from "react-redux"

import Home from "Ui/view/base/home"
import Door from "Ui/view/base/door"

const ViewSelector = {
  true  : (api) => <Home api={api} />,
  false : (api) => <Door api={api} />,
}

class StartPage extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    return ViewSelector[true](api)
  }
}

const stateMap = (store) => {
  return {
    acl: store.acl,
  }
}

export default connect(stateMap, {})(StartPage)

import MainMenu from "./menu"
import AutoPartsProductEditor from "View/auto/parts/product/editor"

import React, { Fragment } from "react"
import { connect } from "react-redux"

const ViewMap = {
  "autoPartsProductEditor": (api) => <AutoPartsProductEditor api={api} />
}

const view = (page, api) => (typeof ViewMap[page] === "function") ? ViewMap[page](api) : ""

class Home extends React.Component {
  render() {
    return (
      <Fragment>
        <MainMenu />
        {view(this.props.app.activePage, this.props.api)}
      </Fragment>
    )
  }
}

const stateMap = (state) => {
  return {
    app: state.app,
  }
}

export default connect(stateMap, {})(Home)

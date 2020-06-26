import MainMenu from "./menu"
import AutoPartsProductEditor   from "View/auto/parts/product/editor"
import AutoPartsSaleCheckEditor from "View/auto/parts/salecheck/editor"

import React, { Fragment } from "react"
import { connect } from "react-redux"

const ViewMap = {
  "autoPartsProductEditor"   : (props) => <AutoPartsProductEditor   api={props.api} />,
  "autoPartsSaleCheckEditor" : (props) => <AutoPartsSaleCheckEditor api={props.api} defaultClientId={props.opt.defaultClientId} />,
}

const view = (page, props) => (typeof ViewMap[page] === "function") ? ViewMap[page](props) : ""

class Home extends React.Component {
  render() {
    return (
      <Fragment>
        <MainMenu />
        {view(this.props.app.activePage, this.props)}
      </Fragment>
    )
  }
}

const stateMap = (state) => {
  return {
    app: state.app,
    opt: state.settings,
  }
}

export default connect(stateMap, {})(Home)

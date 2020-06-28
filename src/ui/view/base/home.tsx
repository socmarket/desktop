import MainMenu from "./menu"
import AutoPartsProductEditor      from "View/auto/parts/product/editor"
import AutoPartsSaleCheckEditor    from "View/auto/parts/salecheck/editor"
import AutoPartsSaleJournal        from "View/auto/parts/salecheck/journal"
import AutoPartsConsignmentEditor  from "View/auto/parts/consignment/editor"
import AutoPartsConsignmentJournal from "View/auto/parts/consignment/journal"

import React, { Fragment } from "react"
import { connect } from "react-redux"

const ViewMap = {
  "autoPartsProductEditor"      : (props) => <AutoPartsProductEditor      api={props.api} theme={props.opt.theme} />,
  "autoPartsSaleCheckEditor"    : (props) => <AutoPartsSaleCheckEditor    api={props.api} theme={props.opt.theme} defaultClientId={props.opt.defaultClientId} />,
  "autoPartsSaleJournal"        : (props) => <AutoPartsSaleJournal        api={props.api} theme={props.opt.theme} />,
  "autoPartsConsignmentEditor"  : (props) => <AutoPartsConsignmentEditor  api={props.api} theme={props.opt.theme} defaultSupplierId={props.opt.defaultSupplierId} />,
  "autoPartsConsignmentJournal" : (props) => <AutoPartsConsignmentJournal api={props.api} theme={props.opt.theme} />,
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

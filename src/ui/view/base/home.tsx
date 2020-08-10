import MainMenu from "./menu"

import AutoPartsProductEditor      from "View/auto/parts/product/editor"
import AutoPartsProductImporter    from "View/auto/parts/product/importer"
import AutoPartsSaleCheckEditor    from "View/auto/parts/salecheck/editor"
import AutoPartsSaleJournal        from "View/auto/parts/salecheck/journal"
import AutoPartsConsignmentEditor  from "View/auto/parts/consignment/editor"
import AutoPartsConsignmentJournal from "View/auto/parts/consignment/journal"

import BaseClientEditor   from "View/base/client/editor"
import BaseSupplierEditor from "View/base/supplier/editor"
import BaseCurrencyEditor from "View/base/currency/editor"
import BaseUnitEditor     from "View/base/unit/editor"
import BaseCategoryEditor from "View/base/category/editor"
import BasePriceEditor    from "View/base/price/editor"
import BaseDashboard      from "View/base/dashboard"
import BaseTurnover       from "View/base/turnover"
import BaseSettingsEditor from "View/base/settings/editor"
import BaseAuthSettings   from "View/base/settings/auth"
import BaseAdminService   from "View/base/settings/service"

import React, { Fragment } from "react"
import { connect } from "react-redux"

const ViewMap = {
  "autoPartsProductEditor"      : (props) => <AutoPartsProductEditor      api={props.api} theme={props.opt.theme} opt={props.opt} />,
  "autoPartsProductImporter"    : (props) => <AutoPartsProductImporter    api={props.api} theme={props.opt.theme} opt={props.opt} />,
  "autoPartsSaleCheckEditor"    : (props) => <AutoPartsSaleCheckEditor    api={props.api} theme={props.opt.theme} opt={props.opt} />,
  "autoPartsSaleJournal"        : (props) => <AutoPartsSaleJournal        api={props.api} theme={props.opt.theme} opt={props.opt} />,
  "autoPartsConsignmentEditor"  : (props) => <AutoPartsConsignmentEditor  api={props.api} theme={props.opt.theme} opt={props.opt} />,
  "autoPartsConsignmentJournal" : (props) => <AutoPartsConsignmentJournal api={props.api} theme={props.opt.theme} opt={props.opt} />,

  "baseClientEditor"   : (props) => <BaseClientEditor   api={props.api} theme={props.opt.theme} opt={props.opt} />,
  "baseSupplierEditor" : (props) => <BaseSupplierEditor api={props.api} theme={props.opt.theme} opt={props.opt} />,
  "baseCurrencyEditor" : (props) => <BaseCurrencyEditor api={props.api} theme={props.opt.theme} opt={props.opt} />,
  "baseUnitEditor"     : (props) => <BaseUnitEditor     api={props.api} theme={props.opt.theme} opt={props.opt} />,
  "baseCategoryEditor" : (props) => <BaseCategoryEditor api={props.api} theme={props.opt.theme} opt={props.opt} />,
  "basePriceEditor"    : (props) => <BasePriceEditor    api={props.api} theme={props.opt.theme} opt={props.opt} />,
  "baseDashboard"      : (props) => <BaseDashboard      api={props.api} theme={props.opt.theme} opt={props.opt} />,
  "baseTurnover"       : (props) => <BaseTurnover       api={props.api} theme={props.opt.theme} opt={props.opt} />,
  "baseSettingsEditor" : (props) => <BaseSettingsEditor api={props.api} theme={props.opt.theme} opt={props.opt} />,
  "baseAuthSettings"   : (props) => <BaseAuthSettings   api={props.api} theme={props.opt.theme} opt={props.opt} />,
  "baseAdminService"   : (props) => <BaseAdminService   api={props.api} theme={props.opt.theme} opt={props.opt} />,
}

const view = (page, props) => (typeof ViewMap[page] === "function") ? ViewMap[page](props) : ""

class Home extends React.Component {
  render() {
    return (
      <Fragment>
        <MainMenu api={this.props.api} theme={this.props.opt.theme} opt={this.props.opt} />
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

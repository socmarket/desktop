import React, { Fragment } from "react";
import { connect } from "react-redux";
import { AppActions } from "serv/app"

import MainMenu from "./menu";

import UnitDialog from "comp/unit/unit";
import PriceDialog from "comp/price/dialog";
import ProductDialog from "comp/product/dialog";

import Dashboard from "comp/dashboard";
import SaleCheck from "comp/salecheck/salecheck.tsx";
import Consignment from "comp/consignment/consignment.tsx";

class HomePage extends React.Component {
  render() {
    return (
      <Fragment>
        <MainMenu />
        { this.props.app.showDashboard && <Dashboard /> }
        { this.props.app.showUnitsDialog && <UnitDialog /> }
        { this.props.app.showPricesDialog && <PriceDialog /> }
        { this.props.app.showProductsDialog && <ProductDialog /> }
        { this.props.app.showSaleCheck && <SaleCheck /> }
        { this.props.app.showConsignment && <Consignment /> }
      </Fragment>
    );
  }
}

const stateMap = (state) => {
  return { app: state.app };
}

export default connect(stateMap, AppActions)(HomePage);

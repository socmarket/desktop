import React, { Fragment } from "react";
import { connect } from "react-redux";

import { AppActions } from "../serv/app"

import MainMenu from "./menu";

import UnitDialog from "../comp/unit/unit";
import PriceDialog from "../comp/price/dialog";
import ProductDialog from "../comp/product/dialog";
import CategoryDialog from "../comp/category";
import SupplierDialog from "../comp/supplier";
import ClientDialog from "../comp/client";
import SettingsDialog from "../comp/settings";
import LabellerDialog from "../comp/labeller";

import AboutDialog from "./about";

import Dashboard from "../comp/dashboard";
import SaleCheck from "../comp/salecheck/salecheck.tsx";
import Consignment from "../comp/consignment/consignment.tsx";
import Test from "../comp/test";

class HomePage extends React.Component {
  render() {
    return (
      <Fragment>
        <MainMenu />

        { (this.props.app.activePage == "dashboard"  ) && <Dashboard /> }
        { (this.props.app.activePage == "saleCheck"  ) && <SaleCheck /> }
        { (this.props.app.activePage == "consignment") && <Consignment /> }
        { (this.props.app.activePage == "test") && <Test /> }

        { this.props.app.showUnitsDialog && <UnitDialog /> }
        { this.props.app.showPricesDialog && <PriceDialog /> }
        { this.props.app.showProductsDialog && <ProductDialog /> }
        { this.props.app.showCategoriesDialog && <CategoryDialog /> }
        { this.props.app.showSuppliersDialog && <SupplierDialog /> }
        { this.props.app.showClientsDialog && <ClientDialog /> }
        { this.props.app.showSettingsDialog && <SettingsDialog /> }
        { this.props.app.showLabellerDialog && <LabellerDialog /> }
        { this.props.app.showAboutDialog && <AboutDialog /> }
      </Fragment>
    );
  }
}

const stateMap = (state) => {
  return { app: state.app };
}

export default connect(stateMap, AppActions)(HomePage);

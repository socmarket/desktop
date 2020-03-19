import React, { Fragment } from "react";
import { connect } from "react-redux";
import { AppActions } from "serv/app"
import MainMenu from "./menu";
import ProductDialog from "comp/product/dialog";
import SaleCheck from "comp/salecheck/salecheck.tsx";

class HomePage extends React.Component {
  render() {
    return (
      <Fragment>
        <MainMenu />
        { this.props.app.showProductsDialog && <ProductDialog /> }
        <SaleCheck />
      </Fragment>
    );
  }
}

const stateMap = (state) => {
  return { app: state.app };
}

export default connect(stateMap, AppActions)(HomePage);

import React from "react";
import { connect } from "react-redux";
import { Menu, Modal, Button, Input, Grid } from "semantic-ui-react"
import { AppActions } from "../../serv/app"
import ProductCard from "./card"
import ProductList from "./list"

class ProductDialog extends React.Component {
  render() {
    return (
      <Modal open size="large" centered={false} closeIcon onClose={() => this.props.closeProducts()}>
        <Modal.Content>
          <ProductList />
        </Modal.Content>
      </Modal>
    );
  }
}

const stateMap = (state) => {
  return { app: state.app };
}

export default connect(stateMap, AppActions)(ProductDialog);

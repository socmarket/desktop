import React from "react";
import { connect } from "react-redux";
import { Modal, Button } from "semantic-ui-react"
import { AppActions } from "serv/app"
import ProductCard from "./card"
import ProductList from "./list"

class ProductDialog extends React.Component {
  render() {
    return (
      <Modal open size="small" closeIcon onClose={() => this.props.closeProducts()}>
        <Modal.Header>Список товаров</Modal.Header>
        <Modal.Content>
          <ProductList />
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => this.props.closeProducts()}>
            Закрыть
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

const stateMap = (state) => {
  return { app: state.app };
}

export default connect(stateMap, AppActions)(ProductDialog);

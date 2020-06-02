import React from "react";
import { connect } from "react-redux";
import moment from "moment";
import { Modal, Grid, Form, Input, Table, Button, Segment, Image, Label, Divider } from "semantic-ui-react"
import { AppActions } from "../../serv/app"
import { PriceActions } from "../../serv/price"
import ProductSelector from "../productselector"

class PriceDialog extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      barcode: "",
      price: "",
    };
    this.handleBarcodeActivate = this.handleBarcodeActivate.bind(this);
    this.handlePriceChange = this.handlePriceChange.bind(this);
    this.handleBarcodeKey = this.handleBarcodeKey.bind(this);

    this.createBarcodeInput = this.createBarcodeInput.bind(this);
    this.createPriceInput = this.createPriceInput.bind(this);

    this.inputSelector = React.createRef();
    this.inputPrice = React.createRef();

    this.onProductSelected = this.onProductSelected.bind(this);

    this.findNextProductWithoutPrice = this.findNextProductWithoutPrice.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  private createBarcodeInput(props) {
    return (<Input ref={this.inputSelector} style={{ textAlign: "right" }} {...props} />);
  }

  private createPriceInput(props) {
    return (
      <div className="ui input">
        <input ref={this.inputPrice} style={{ textAlign: "right" }} {...props} />
      </div>
    );
  }

  handleKeyDown(event) {
    if (event.key && event.ctrlKey && (event.key === "l" || event.key === "L")) {
      this.inputSelector.current.focus();
    }
  }

  handleBarcodeActivate() {
    const self = this;
    const currentProduct = this.props.priceList.currentProduct;
    if (this.state.barcode.length > 0) {
      this.inputPrice.current.focus();
      this.inputPrice.current.select();
      if (currentProduct.barcode !== this.state.barcode) {
        this.props.findProduct(this.state.barcode);
      } else if (this.state.price > 0) {
        this.props.setPrice(this.state.price);
        setTimeout(() => {
          this.setState({
            barcode: "",
            price: 0,
          }, () => {
            this.inputSelector.current.focus();
          });
        }, 100);
      }
    }
  }

  findNextProductWithoutPrice() {
    const self = this;
    const currentProduct = this.props.priceList.currentProduct;
    this.props.findNextProductWithoutPrice(currentProduct.id);
    setTimeout(() => {
      self.setState({
        barcode: self.props.priceList.currentProduct.barcode,
      }, () => {
        self.handleBarcodeActivate({});
      });
    }, 100);
  }

  handleBarcodeKey(event) {
    if (event.key === "Enter") {
      this.handleBarcodeActivate();
    }
  }

  handlePriceChange(event) {
    if (!isNaN(Number(event.target.value))) {
      this.setState({
        price: event.target.value,
      });
    }
  }

  onProductSelected (product) {
    this.setState({
      barcode: product.barcode,
    }, () => {
      this.handleBarcodeActivate({});
    });
  }

  prices() {
    const currentProduct = this.props.priceList.currentProduct;
    return (
      <Table compact celled selectable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Дата</Table.HeaderCell>
            <Table.HeaderCell>Цена продажи</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          { this.props.priceList.currentProductPriceList.map(item => (
            <Table.Row key={item.id}>
              <Table.Cell>{moment.utc(item.setAt).local().format("DD-MM-YYYY HH:mm")}</Table.Cell>
              <Table.Cell>{item.price}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    );
  }

  consignmentSummary() {
    const summ = this.props.consignmentSummary;
    return (
      <Table compact celled selectable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell colSpan={3}>
              Общее кол-во: {summ.totalQuantity}<br />
              Общая стоимость: {summ.totalCost}<br />
              Средняя цена: {summ.averagePrice}<br />
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Дата</Table.HeaderCell>
            <Table.HeaderCell>Закупка по</Table.HeaderCell>
            <Table.HeaderCell>Кол-во</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          { summ.items.map((item, idx) => (
            <Table.Row key={idx}>
              <Table.Cell>{moment.utc(item.acceptedAt).local().format("DD-MM-YYYY HH:mm")}</Table.Cell>
              <Table.Cell>{item.price}</Table.Cell>
              <Table.Cell>{item.quantity}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    );
  }

  form() {
    return (
      <Form>
        <Form.Group>
          <Form.Input
            onKeyPress={this.handleBarcodeKey}
            onChange={this.handlePriceChange}
            control={this.createPriceInput}
            value={this.state.price}
          />
          <Button primary fluid onClick={this.handleBarcodeKey}>Установить цену</Button>
          <Button fluid onClick={this.findNextProductWithoutPrice}>Следующий товар без цены</Button>
        </Form.Group>
      </Form>
    );
  }

  content() {
    const product = this.props.priceList.currentProduct;
    const label = product.categoryTitle + " : " + product.title + " : " + product.barcode;
    const selectAttrs = product.id > 0 ? { value: { value: product.id, label: label } } : {};
    return (
      <Grid columns={2}>
        <Grid.Row>
          <Grid.Column width={16}>
            <ProductSelector
              autoFocus
              {...selectAttrs}
              forwardRef={this.inputSelector}
              onProductSelected={this.onProductSelected}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={16}>
            {this.form()}
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={8}>
            {this.prices()}
          </Grid.Column>
          <Grid.Column width={8}>
            {this.consignmentSummary()}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }

  render() {
    return (
      <Modal open size="large" centered={false} closeIcon onClose={() => this.props.closePrices()}>
        <Modal.Content onKeyDown={this.handleKeyDown}>
          {this.content()}
        </Modal.Content>
      </Modal>
    );
  }
}

const stateMap = (state) => {
  return {
    app: state.app,
    priceList: state.priceList,
    consignmentSummary: state.priceList.consignmentSummary
  };
}

export default connect(stateMap, { ...AppActions, ...PriceActions })(PriceDialog);

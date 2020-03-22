import React from "react";
import { connect } from "react-redux";
import moment from "moment";
import { Modal, Grid, Form, Input, Table, Button, Segment, Image, Label } from "semantic-ui-react"
import { AppActions } from "serv/app"
import { PriceActions } from "serv/price"

class PriceDialog extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      barcode: "",
      price: "",
    };
    this.handleBarcodeActivate = this.handleBarcodeActivate.bind(this);
    this.handleBarcodeChange = this.handleBarcodeChange.bind(this);
    this.handlePriceChange = this.handlePriceChange.bind(this);
    this.handleBarcodeKey = this.handleBarcodeKey.bind(this);

    this.createBarcodeInput = this.createBarcodeInput.bind(this);
    this.createPriceInput = this.createPriceInput.bind(this);

    this.inputBarcode = React.createRef();
    this.inputPrice = React.createRef();
  }

  private createBarcodeInput(props) {
    return (<Input ref={this.inputBarcode} style={{ textAlign: "right" }} {...props} />);
  }

  private createPriceInput(props) {
    return (
      <div className="ui input">
        <input ref={this.inputPrice} style={{ textAlign: "right" }} {...props} />
      </div>
    );
  }

  componentDidUpdate() {
    const currentProduct = this.props.priceList.currentProduct;
    if (currentProduct.barcode === this.state.barcode && this.state.barcode.length > 0) {
      this.inputPrice.current.focus();
    }
  }

  handleBarcodeActivate() {
    const currentProduct = this.props.priceList.currentProduct;
    if (this.state.barcode > 0) {
      if (currentProduct.barcode !== this.state.barcode) {
        this.props.findProduct(this.state.barcode);
      } else if (this.state.price > 0) {
        this.props.setPrice(this.state.price);
        setTimeout(() => {
          this.setState({
            barcode: "",
            price: 0,
          }, () => {
            this.inputBarcode.current.focus();
          });
        }, 100);
      }
    }
  }

  handleBarcodeKey(event) {
    if (event.key === "Enter") {
      this.handleBarcodeActivate();
    }
  }

  handleBarcodeBlur() {
  }

  handleBarcodeChange(event) {
    this.setState({ barcode: event.target.value });
  }

  handlePriceChange(event) {
    if (!isNaN(Number(event.target.value))) {
      this.setState({
        price: event.target.value,
      });
    }
  }

  table() {
    const currentProduct = this.props.priceList.currentProduct;
    return (
      <Table compact celled selectable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell colSpan={2}>
              {currentProduct.title}
            </Table.HeaderCell>
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

  form() {
    return (
      <Grid columns={2}>
        <Grid.Row>
          <Grid.Column width={6}>
            <Image fluid bordered rounded src="https://picsum.photos/200/250" />
          </Grid.Column>
          <Grid.Column width={10}>
            <Form>
              <Form.Group>
                <Form.Input width={10}
                  autoFocus
                  label="Штрихкод"
                  onKeyPress={this.handleBarcodeKey}
                  onBlur={this.handleBarcodeActivate}
                  onChange={this.handleBarcodeChange}
                  control={this.createBarcodeInput}
                  value={this.state.barcode}
                />
                <Form.Input width={6}
                  label="Цена"
                  onKeyPress={this.handleBarcodeKey}
                  onChange={this.handlePriceChange}
                  control={this.createPriceInput}
                  value={this.state.price}
                />
              </Form.Group>
              <Button primary fluid>Установить цену</Button>
              {this.table()}
            </Form>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }

  render() {
    return (
      <Modal open size="small" centered={false} closeIcon onClose={() => this.props.closePrices()}>
        <Modal.Content>
          {this.form()}
        </Modal.Content>
      </Modal>
    );
  }
}

const stateMap = (state) => {
  return {
    app: state.app,
    priceList: state.priceList,
  };
}

export default connect(stateMap, { ...AppActions, ...PriceActions })(PriceDialog);

import React from "react";
import { connect } from "react-redux";
import moment from "moment";
import { ConsignmentActions } from "../../serv/consignment"
import {
  Header, Grid, Table, Form, Input, Select,
  TextArea, Button, Segment, Image,
  Label, Container, Menu, Message, Divider
} from "semantic-ui-react"

class Consignment extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      barcode: "",
      quantity: "",
      price: "",
      supplierId: -1,
      searched: false,
      currentItemIdx: -1,
    }
    this.handleActivate = this.handleActivate.bind(this);
    this.handleNavigation = this.handleNavigation.bind(this);
    this.handleBarcodeFocus = this.handleBarcodeFocus.bind(this);
    this.handleIncQuantity = this.handleIncQuantity.bind(this);
    this.handleDecQuantity = this.handleDecQuantity.bind(this);
    this.handleConsignmentClose = this.handleConsignmentClose.bind(this);

    this.handleBarcodeChange = this.handleBarcodeChange.bind(this);
    this.handleQuantityChange = this.handleQuantityChange.bind(this);
    this.handlePriceChange = this.handlePriceChange.bind(this);
    this.handleSupplierChange = this.handleSupplierChange.bind(this);

    this.createBarcodeInput = this.createBarcodeInput.bind(this);
    this.createQuantityInput = this.createQuantityInput.bind(this);
    this.createPriceInput = this.createPriceInput.bind(this);

    this.inputBarcode = React.createRef();
    this.inputQuantity = React.createRef();
    this.inputPrice = React.createRef();
  }

  private addConsignmentItem() {
    this.props.addConsignmentItem(this.state);
    setTimeout(() => {
      this.setState({
        barcode: "",
        quantity: 0,
        price: 0,
        supplierId: -1,
      }, () => {
        this.inputBarcode.current.focus();
      });
    }, 100);
  }

  private validate() {
    if (this.state.barcode.length === 0 || this.props.consignment.currentProduct.id <= 0) {
      this.inputBarcode.current.focus();
      return false;
    }
    if (this.state.quantity <= 0) {
      this.inputQuantity.current.focus();
      this.inputQuantity.current.select();
      return false;
    }
    if (this.state.price <= 0) {
      this.inputPrice.current.focus();
      this.inputPrice.current.select();
      return false;
    }
    return true;
  }

  handleNavigation(event) {
    const count = this.props.consignment.items.length;
    if (event.key && count > 0) {
      if (event.key === "ArrowUp") {
        const cidx = this.state.currentItemIdx <= 0 ? count : this.state.currentItemIdx;
        this.setState({ currentItemIdx: cidx - 1 });
      } else if (event.key === "ArrowDown") {
        const cidx = this.state.currentItemIdx === (count - 1) ? -1 : this.state.currentItemIdx;
        this.setState({ currentItemIdx: cidx + 1 });
      } else if (event.key === "ArrowLeft") {
        this.handleDecQuantity();
      } else if (event.key === "ArrowRight") {
        this.handleIncQuantity();
      }
    }
  }

  handleActivate(event) {
    const act = () => {
      if (this.state.barcode.length > 0) {
        if (this.state.barcode !== this.props.consignment.currentProduct.barcode) {
          this.props.findProduct(this.state.barcode);
        }
        setTimeout(() => {
          if (this.validate()) {
            this.addConsignmentItem();
          }
        }, 100);
      } else {
        this.inputBarcode.current.focus();
      }
    }
    if (event.key) {
      if (event.key === "Enter") {
        act();
      }
    } else {
      act();
    }
  }

  handleBarcodeChange(event) {
    this.setState({ barcode: event.target.value, searched: false });
  }

  handleQuantityChange(event) {
    this.setState({ quantity: event.target.value });
  }

  handlePriceChange(event) {
    this.setState({ price: event.target.value });
  }

  handleSupplierChange(event, data) {
    this.setState({
      supplierId: data.value
    });
  }

  handleBarcodeFocus() {
    this.setState({
      focus: "barcode"
    });
  }

  handleDecQuantity() {
    const idx = this.state.currentItemIdx;
    const items = this.props.consignment.items;
    if (idx >= 0 && idx < items.length) {
      this.props.decConsignmentItemQuantity(items[idx].barcode);
    }
  }

  handleIncQuantity() {
    const idx = this.state.currentItemIdx;
    const items = this.props.consignment.items;
    if (idx >= 0 && idx < items.length) {
      this.props.incConsignmentItemQuantity(items[idx].barcode);
    }
  }

  handleConsignmentClose() {
    if (this.props.consignment.itemsCost > 0) {
      this.props.closeConsignment(this.state.supplierId);
      setTimeout(() => {
        this.setState({
          supplierId: -1
        }, () => {
          this.inputBarcode.current.focus();
        });
      }, 100);
    }
  }

  componentDidMount() {
    this.props.updateConsignmentList();
  }

  private list() {
    const list = this.props.consignment.list;
    return (
      <Table compact celled selectable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Дата</Table.HeaderCell>
            <Table.HeaderCell>Поставщик</Table.HeaderCell>
            <Table.HeaderCell>Сумма</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          { list.map( (item, idx) => (
            <Table.Row key={idx}>
              <Table.Cell>{moment.utc(item.acceptedAt).local().format("DD-MM-YYYY HH:mm")}</Table.Cell>
              <Table.Cell>{item.supplierName}</Table.Cell>
              <Table.Cell>{item.total}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    );
  }

  private table() {
    const items = this.props.consignment.items;
    const currentIdx = this.state.currentItemIdx;
    return (
      <Table compact celled selectable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Название</Table.HeaderCell>
            <Table.HeaderCell>Цена</Table.HeaderCell>
            <Table.HeaderCell>Кол-во</Table.HeaderCell>
            <Table.HeaderCell>Ед. изм.</Table.HeaderCell>
            <Table.HeaderCell>Сумма</Table.HeaderCell>
            <Table.HeaderCell>Штрихкод</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          { items.map( (item, idx) => (
            <Table.Row key={idx} active={idx === currentIdx}>
              <Table.Cell>{item.title}</Table.Cell>
              <Table.Cell>{item.price}</Table.Cell>
              <Table.Cell>{item.quantity}</Table.Cell>
              <Table.Cell>{item.unitTitle}</Table.Cell>
              <Table.Cell>{Math.round((item.price * item.quantity + Number.EPSILON) * 100) / 100}</Table.Cell>
              <Table.Cell>{item.barcode}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    );
  }

  private createBarcodeInput(props) {
    return (
      <div className="ui input">
        <input ref={this.inputBarcode} {...props} />
      </div>
    );
  }

  private createQuantityInput(props) {
    return (
      <div className="ui input">
        <input ref={this.inputQuantity} style={{ textAlign: "right" }} {...props} style={{ textAlign: "right" }} />
      </div>
    );
  }

  private createPriceInput(props) {
    return (
      <div className="ui input action">
        <input ref={this.inputPrice} style={{ textAlign: "right" }} {...props} style={{ textAlign: "right" }} />
        <Button primary onClick={this.handleActivate}>Добавить</Button>
      </div>
    );
  }

  private form() {
    const currentProduct = this.props.consignment.currentProduct;
    const productNotFound: boolean = !this.searched && this.state.barcode.length > 0 && currentProduct.id < 0;
    const currentItem = this.props.consignment.currentConsignmentItem;
    const productId = currentItem.productId
    const barcode = this.state.barcode;
    const searched = this.state.searched;
    const itemsCost = this.props.consignment.itemsCost;
    const foundProductUnit = (currentProduct.unitTitle.length > 0) ? ", изм: " + currentProduct.unitTitle : ""
    const foundProductTitle = productNotFound ? "| Товар не найден" : "| " + currentProduct.title + foundProductUnit
    return (
      <Segment onKeyPress={this.handleActivate}>
        <Form error={productNotFound} success={!productNotFound}>
          <Form.Group>
            <Form.Input width={16}
              autoFocus
              label="Штрихкод"
              error={productNotFound}
              value={this.state.barcode}
              onFocus={this.handleBarcodeFocus}
              onChange={this.handleBarcodeChange}
              control={this.createBarcodeInput}
            />
          </Form.Group>
          <Message
            error={productNotFound}
            success={!productNotFound}
            content={foundProductTitle}
          />
          <Form.Group>
            <Form.Input
              width={6}
              label="Кол-во"
              value={this.state.quantity}
              onChange={this.handleQuantityChange}
              control={this.createQuantityInput}
            />
            <Form.Input
              width={10}
              label="Цена за ед."
              value={this.state.price}
              onChange={this.handlePriceChange}
              control={this.createPriceInput}
            />
          </Form.Group>
        </Form>
        <Divider />
        <Grid>
          <Grid.Row>
            <Grid.Column width={6}><Header as="h1">Сумма: </Header></Grid.Column>
            <Grid.Column width={10}><Header as="h1" textAlign="right">{this.props.consignment.itemsCost}</Header></Grid.Column>
          </Grid.Row>
        </Grid>
        <Divider />
        <Form error={productNotFound}>
          <Form.Group>
            <Form.Select
              width={16}
              label="Поставщик"
              value={this.state.supplierId}
              options={this.props.supplierOptions}
              onChange={this.handleSupplierChange}
            />
          </Form.Group>
        </Form>
        <Button positive fluid onClick={this.handleConsignmentClose}>Принять партию</Button>
      </Segment>
    );
  }

  editor() {
    const idx = this.state.currentItemIdx
    const items = this.props.consignment.items;
    const item = (idx >= 0 && idx < items.length) ? items[idx] : {
      title: "",
      quantity: 0,
    };
    return (
      <Menu>
        <Menu.Item>
          <div className="ui input">
            <input value={item.quantity} style={{ textAlign: "right" }} readOnly />
          </div>
        </Menu.Item>
        <Menu.Item>
          <Button icon="minus" onClick={this.handleDecQuantity} />
        </Menu.Item>
        <Menu.Item>
          <Button icon="plus" onClick={this.handleIncQuantity} />
        </Menu.Item>
        <Menu.Item><Header>{item.title}</Header></Menu.Item>
      </Menu>
    );
  }

  render() {
    return (
      <Grid columns={2} padded onKeyDown={this.handleNavigation}>
        <Grid.Column width={5}>
          {this.form()}
          {this.list()}
        </Grid.Column>
        <Grid.Column width={11}>
          <Container>
            {this.editor()}
            {this.table()}
          </Container>
        </Grid.Column>
      </Grid>
    );
  }
}

const stateMap = (state) => {
  return {
    consignment: state.consignment,
    supplierOptions: state.registry.supplierOptions,
  };
}

export default connect(stateMap, ConsignmentActions)(Consignment);

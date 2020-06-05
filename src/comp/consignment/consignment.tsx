import React, { Fragment } from "react";
import { connect } from "react-redux";
import moment from "moment";
import Journal from "./journal.tsx"
import SummaryByProduct from "./summaryByProduct.tsx"
import SummaryByCategory from "./summaryByCategory.tsx"
import { ProductPicker } from "../../aui/comp/product"
import { ConsignmentActions } from "../../serv/consignment"
import {
  Header, Grid, Table, Form, Input, Select,
  TextArea, Button, Segment, Image,
  Label, Container, Menu, Message, Divider
} from "semantic-ui-react"

const emptyState = {
  barcode: "",
  quantity: "",
  price: "",
  supplierId: -1,
  searched: false,
  currentItemIdx: -1,
};

class Consignment extends React.Component {

  constructor(props) {
    super(props);

    this.state = emptyState;

    this.handleActivate = this.handleActivate.bind(this);
    this.handleNavigation = this.handleNavigation.bind(this);
    this.handleBarcodeFocus = this.handleBarcodeFocus.bind(this);
    this.handleIncQuantity = this.handleIncQuantity.bind(this);
    this.handleDecQuantity = this.handleDecQuantity.bind(this);
    this.handleConsignmentClose = this.handleConsignmentClose.bind(this);

    this.onProductSelected = this.onProductSelected.bind(this);
    this.handleQuantityChange = this.handleQuantityChange.bind(this);
    this.handlePriceChange = this.handlePriceChange.bind(this);
    this.handleSupplierChange = this.handleSupplierChange.bind(this);

    this.createQuantityInput = this.createQuantityInput.bind(this);
    this.createPriceInput = this.createPriceInput.bind(this);

    this.productPickerRef = React.createRef();
    this.inputQuantity = React.createRef();
    this.inputPrice = React.createRef();
  }

  private focusSelector() {
    this.productPickerRef.current.focus();
  }

  private addConsignmentItem() {
    const self = this;
    self.props.addConsignmentItem(self.state);
    setTimeout(() => self.setState(emptyState, () => {
      self.focusSelector();
      console.log(self.productPickerRef.current);
    }), 100);
  }

  private validate() {
    if (this.state.barcode.length === 0 || this.props.consignment.currentProduct.id <= 0) {
      this.focusSelector();
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
    const self = this;
    const act = () => {
      if (self.state.barcode.length > 0) {
        if (self.state.barcode !== self.props.consignment.currentProduct.barcode) {
          self.props.findProduct(self.state.barcode);
        }
        setTimeout(() => {
          if (self.validate()) {
            self.addConsignmentItem();
          }
        }, 100);
      } else {
        self.focusSelector();
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
    const self = this;
    if (self.props.consignment.itemsCost > 0) {
      self.props.closeConsignment(self.state.supplierId);
      setTimeout(() => {
        self.setState({
          supplierId: -1
        }, () => {
          switch (this.props.consignment.currentReport) {
            case "journal": 
              self.props.reloadConsignmentJournal();
              break;
            case "summaryByCategory":
              self.props.reloadConsignmentJournal();
              break;
          }
          self.focusSelector();
        });
      }, 100);
    }
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

  private createQuantityInput(props) {
    return (
      <div className="ui input">
        <input ref={this.inputQuantity} style={{ textAlign: "right" }} {...props} style={{ textAlign: "right" }} />
      </div>
    );
  }

  private createPriceInput(props) {
    return (
      <div className="ui input">
        <input ref={this.inputPrice} style={{ textAlign: "right" }} {...props} style={{ textAlign: "right" }} />
        {/* <Button primary onClick={this.handleActivate}>Добавить</Button> */}
      </div>
    );
  }

  onProductSelected (product) {
    this.setState({
      barcode: product.barcode,
      searched: false
    }, () => {
      this.handleActivate({});
    });
  }

  private form() {
    const currentProduct = this.props.consignment.currentProduct;
    const productNotFound: boolean = !this.searched && this.state.barcode.length > 0 && currentProduct.id < 0;
    const currentItem = this.props.consignment.currentConsignmentItem;
    const productId = currentItem.productId;
    const barcode = this.state.barcode;
    const searched = this.state.searched;
    const itemsCost = this.props.consignment.itemsCost;
    const foundProductUnit = (currentProduct.unitTitle.length > 0) ? ", изм: " + currentProduct.unitTitle : ""
    const foundProductCategory = (currentProduct.categoryTitle.length > 0) ? ": " + currentProduct.categoryTitle : ""
    const foundProductTitle = productNotFound ? "| Товар не найден" : "| " + currentProduct.title + foundProductCategory + foundProductUnit
    return (
      <Segment onKeyPress={this.handleActivate}>
        <Form error={productNotFound} success={!productNotFound}>
          <ProductPicker
            autoFocus
            api={window.api}
            forwardRef={this.productPickerRef}
            onPick={this.onProductSelected}
            value={productId}
          />
          <Divider />
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

  menu() {
    const idx = this.state.currentItemIdx
    const items = this.props.consignment.items;
    const item = (idx >= 0 && idx < items.length) ? items[idx] : {
      title: "",
      quantity: 0,
    };
    const current = this.props.consignment.currentReport;
    return (
      <Menu>
        <Menu.Item active={current==="journal"} onClick={() => this.props.openReport("journal")}>
          Журнал
        </Menu.Item>
        <Menu.Item active={current==="summaryByCategory"} onClick={() => this.props.openReport("summaryByCategory")}>
          Сводка по категориям
        </Menu.Item>
      </Menu>
    );
  }

  render() {
    return (
      <Grid columns={2} padded onKeyDown={this.handleNavigation}>
        <Grid.Column width={5}>
          {this.form()}
          { (this.props.consignment.currentProduct.id > 0) && <SummaryByProduct /> }
        </Grid.Column>
        <Grid.Column width={11}>
          <Container>
            {this.table()}
            {this.menu()}
          </Container>
          { (this.props.consignment.currentReport === "journal") &&
            <Fragment>
              <Divider horizontal>Журнал приёмки</Divider>
              <Journal />
            </Fragment>
          }
          { (this.props.consignment.currentReport === "summaryByCategory") &&
            <Fragment>
              <Divider horizontal>Сводка по категориям</Divider>
              <SummaryByCategory />
            </Fragment>
          }
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

import React, { Fragment } from "react";
import { connect } from "react-redux";
import moment from "moment";
import {
  Header, Grid, Table, Form, Input, Select,
  TextArea, Button, Segment, Image,
  Label, Container, Menu, Message, Divider
} from "semantic-ui-react"

import ProductSelector from "../productselector"
import { ClientPicker } from "../../aui/comp/client";
import { SaleCheckActions } from "../../serv/salecheck"

import Journal from "./journal.tsx";

class SaleCheck extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      barcode: "",
      cashAmount: 0.00,
      clientId: -1,
      searched: false,
      currentItemIdx: -1,
      lastTitle: "",
      lastBarcode: "",
    }
    this.handleBarcodeActivate = this.handleBarcodeActivate.bind(this);
    this.handleBarcodeChange = this.handleBarcodeChange.bind(this);
    this.handleCashAmountChange = this.handleCashAmountChange.bind(this);
    this.handleClientChange = this.handleClientChange.bind(this);
    this.handleNavigation = this.handleNavigation.bind(this);
    this.handleIncQuantity = this.handleIncQuantity.bind(this);
    this.handleDecQuantity = this.handleDecQuantity.bind(this);
    this.handleSaleCheckClose = this.handleSaleCheckClose.bind(this);
    this.createCashInput = this.createCashInput.bind(this);
    this.onProductSelected = this.onProductSelected.bind(this);

    this.inputCash = React.createRef();
    this.inputSelector = React.createRef();
    this.clientPickerRef = React.createRef();
  }

  private addSaleCheckItem() {
    this.props.addSaleCheckItem(this.state.barcode);
    setTimeout(() => {
      const id = this.props.saleCheck.currentSaleCheckItem.productId;
      if (id < 0) {
        this.setState({ searched: true });
      }
    }, 100);
  }

  handleNavigation(event) {
    const count = this.props.saleCheck.items.length;
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

  handleBarcodeActivate(event) {
    if (event.key && event.key === "Enter") {
      if (this.state.barcode.length > 0) {
        this.addSaleCheckItem();
      } else {
        this.handleSaleCheckClose();
      }
    }
  }

  handleBarcodeChange(event) {
    this.setState({ barcode: event.target.value, searched: false });
  }

  handleCashAmountChange(event) {
    this.setState({ cashAmount: event.target.value });
  }

  handleClientChange(client) {
    console.log(client)
    this.setState({ clientId: client.id });
  }

  handleDecQuantity() {
    const idx = this.state.currentItemIdx;
    const items = this.props.saleCheck.items;
    if (idx >= 0 && idx < items.length) {
      this.props.decSaleCheckItemQuantity(items[idx].barcode);
    }
  }

  handleIncQuantity() {
    const idx = this.state.currentItemIdx;
    const items = this.props.saleCheck.items;
    if (idx >= 0 && idx < items.length) {
      this.props.incSaleCheckItemQuantity(items[idx].barcode);
    }
  }

  handleSaleCheckClose() {
    const self = this;
    if (this.props.saleCheck.items.length > 0) {
      if (this.state.cashAmount >= this.props.saleCheck.itemsCost || this.state.clientId > 0) {
        this.props.closeSaleCheck(this.state.cashAmount, this.state.cashAmount - this.props.itemsCost, this.state.clientId);
        this.setState({
          cashAmount: 0.00,
          clientId: -1,
        }, () => {
          setTimeout(() => {
            switch (this.props.saleCheck.currentReport) {
              case "journal": 
                self.props.reloadSaleJournal();
                self.inputSelector.current.focus();
                break;
            }
          }, 100);
        });
      } else {
        this.clientPickerRef.current.focus();
      }
    } else {
      this.inputSelector.current.focus();
    }
  }

  componentDidMount() {
    this.props.updateSaleCheckList();
  }

  componentDidUpdate() {
    const id = this.props.saleCheck.currentSaleCheckItem.productId;
    if (id > 0 && this.state.barcode.length > 0) {
      this.setState({ barcode: "" }, () => {
        this.addSaleCheckItem();
      });
    }
    if (this.state.currentItemIdx >= this.props.saleCheck.items.length) {
      this.setState({
        currentItemIdx: -1
      });
    }
  }

  onProductSelected (product) {
    const self = this;
    this.setState({
      barcode: product.barcode,
      searched: false
    }, () => {
      self.handleBarcodeActivate({ key: "Enter" });
    });
  }

  private list() {
    const list = this.props.saleCheck.list;
    return (
      <Table compact celled selectable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Дата</Table.HeaderCell>
            <Table.HeaderCell>Клиент</Table.HeaderCell>
            <Table.HeaderCell>Сумма</Table.HeaderCell>
            <Table.HeaderCell>Оплата</Table.HeaderCell>
            <Table.HeaderCell>Сдача</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          { list.map( (item, idx) => (
            <Table.Row key={idx}>
              <Table.Cell>{moment.utc(item.soldAt).local().format("DD-MM-YYYY HH:mm")}</Table.Cell>
              <Table.Cell>{item.clientName}</Table.Cell>
              <Table.Cell>{item.total}</Table.Cell>
              <Table.Cell>{item.cash}</Table.Cell>
              <Table.Cell>{item.change}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    );
  }

  private table() {
    const items = this.props.saleCheck.items;
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

  private createCashInput(props) {
    return (
      <div className="ui input action">
        <input ref={this.inputCash} style={{ textAlign: "right" }} {...props} />
        <Button positive onClick={this.handleSaleCheckClose}>Оплатить</Button>
      </div>
    );
  }

  private form() {
    const productId = this.props.saleCheck.currentSaleCheckItem.productId
    const barcode = this.state.barcode;
    const searched = this.state.searched;
    const productNotFound: boolean = productId < 0 && barcode.length > 0 && searched;
    const cashAmount = this.state.cashAmount;
    const itemsCost = this.props.saleCheck.itemsCost;
    return (
      <Segment onKeyPress={this.handleBarcodeActivate}>
        <Form error={productNotFound} onKeyDown={this.handleNavigation}>
          <ProductSelector
            autoFocus
            forwardRef={this.inputSelector}
            onProductSelected={this.onProductSelected}
          />
          <Divider />
          <Message error header='Товар не найден' content="Проверьте штрихкод или вбейте его вручную." />
        </Form>
        <br />
        <Grid>
          <Grid.Row>
            <Grid.Column width={6}><Header as="h2" >Сумма: </Header></Grid.Column>
            <Grid.Column width={10}><Header as="h2" dividing textAlign="right">{itemsCost}</Header></Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={6}><Header as="h2" >Скидка: </Header></Grid.Column>
            <Grid.Column width={10}><Header as="h2" dividing textAlign="right">0.00</Header></Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={6}><Header as="h1">Итог: </Header></Grid.Column>
            <Grid.Column width={10}>
              <Header dividing as="h1" textAlign="right">{this.props.saleCheck.itemsCost}</Header>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={6}><Header as="h2">Сдача: </Header></Grid.Column>
            <Grid.Column width={10}>
              <Header dividing as="h2" textAlign="right">
                {cashAmount > itemsCost ? Math.round((cashAmount - itemsCost + Number.EPSILON) * 100) / 100 : "0.00" }
              </Header>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <br />
        <Form error={productNotFound}>
          <Form.Field>
            <label>Клиент</label>
            <ClientPicker
              label="Клиент"
              value={this.state.clientId}
              onPick={this.handleClientChange}
              forwardRef={this.clientPickerRef}
            />
          </Form.Field>
          <Form.Group onKeyDown={this.handleNavigation}>
            <Form.Input width={16}
              label="Наличными"
              value={cashAmount}
              onFocus={this.handleBarcodeFocus}
              onChange={this.handleCashAmountChange}
              control={this.createCashInput}
            />
          </Form.Group>
        </Form>
      </Segment>
    );
  }

  editor() {
    const idx = this.state.currentItemIdx
    const items = this.props.saleCheck.items;
    const item = (idx >= 0 && idx < items.length) ? items[idx] : {
      title: "",
      quantity: 0,
    };
    const current = this.props.saleCheck.currentReport;
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
    const lastTitle = this.props.saleCheck.lastItemTitle;
    const lastBarcode = this.props.saleCheck.lastItemBarcode;
    const lastProduct = "[ " + lastBarcode + " ] : " + lastTitle;
    const priceNotSet = this.props.saleCheck.priceNotSet;
    const priceNotSetMsg = "Цена на товар " + lastProduct + " не установлена. Товар не добавлен. Установите цену."
    return (
      <Grid columns={2} padded>
        <Grid.Column width={5}>
          {this.form()}
          {this.list()}
        </Grid.Column>
        <Grid.Column width={11}>
          <Container>
            {this.editor()}
            { priceNotSet && (<Message error header="Ошибка" content={priceNotSetMsg} />) }
            {this.table()}
          </Container>

          { (this.props.saleCheck.currentReport === "journal") &&
            <Fragment>
              <Divider horizontal>Журнал продаж</Divider>
              <Journal />
            </Fragment>
          }
        </Grid.Column>
      </Grid>
    );
  }
}

const stateMap = (state) => {
  return {
    saleCheck: state.saleCheck,
    clientOptions: state.registry.clientOptions,
  };
}

export default connect(stateMap, SaleCheckActions)(SaleCheck);

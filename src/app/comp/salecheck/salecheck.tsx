import React from "react";
import { connect } from "react-redux";
import moment from "moment";
import { SaleCheckActions } from "serv/salecheck"
import {
  Header, Grid, Table, Form, Input, Select,
  TextArea, Button, Segment, Image,
  Label, Container, Menu, Message, Divider
} from "semantic-ui-react"

class SaleCheck extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      barcode: "",
      cashAmount: 0.00,
      searched: false,
      currentItemIdx: -1,
    }
    this.handleBarcodeActivate = this.handleBarcodeActivate.bind(this);
    this.handleBarcodeChange = this.handleBarcodeChange.bind(this);
    this.handleCashAmountChange = this.handleCashAmountChange.bind(this);
    this.handleNavigation = this.handleNavigation.bind(this);
    this.handleBarcodeFocus = this.handleBarcodeFocus.bind(this);
    this.handleCashAmountFocus = this.handleCashAmountFocus.bind(this);
    this.handleIncQuantity = this.handleIncQuantity.bind(this);
    this.handleDecQuantity = this.handleDecQuantity.bind(this);
    this.handleSaleCheckClose = this.handleSaleCheckClose.bind(this);
    this.createCashInput = this.createCashInput.bind(this);
    this.createBarcodeInput = this.createBarcodeInput.bind(this);

    this.inputCash = React.createRef();
    this.inputBarcode = React.createRef();
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

  handleBarcodeFocus() {
    this.setState({
      focus: "barcode"
    });
  }

  handleCashAmountFocus() {
    this.setState({
      focus: "cashAmount"
    });
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
    if (this.state.cashAmount > this.props.saleCheck.itemsCost) {
      this.props.closeSaleCheck(this.state.cashAmount, this.state.cashAmount - this.props.itemsCost);
      this.setState({
        cashAmount: 0.00
      });
      this.inputBarcode.current.focus();
    } else if (this.props.saleCheck.itemsCost > 0) {
      this.inputCash.current.focus();
      this.inputCash.current.select();
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

  private list() {
    const list = this.props.saleCheck.list;
    return (
      <Table compact celled selectable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Дата</Table.HeaderCell>
            <Table.HeaderCell>Сумма</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          { list.map( (item, idx) => (
            <Table.Row key={idx}>
              <Table.Cell>{moment.utc(item.soldAt).local().format("DD-MM-YYYY HH:mm")}</Table.Cell>
              <Table.Cell>{item.total}</Table.Cell>
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
      <div className="ui input">
        <input ref={this.inputCash} style={{ textAlign: "right" }} {...props} style={{ textAlign: "right" }} />
      </div>
    );
  }

  private createBarcodeInput(props) {
    return (<Input ref={this.inputBarcode} style={{ textAlign: "right" }} {...props} />);
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
        <Grid>
          <Grid.Column width={16}>
            <Form error={productNotFound}>
              <Form.Group>
                <Form.Input width={16}
                  autoFocus
                  label="Штрихкод"
                  value={this.state.barcode}
                  onFocus={this.handleBarcodeFocus}
                  onChange={this.handleBarcodeChange}
                  control={this.createBarcodeInput}
                />
              </Form.Group>
              <Message error header='Товар не найден' content="Проверьте штрихкод или вбейте его вручную." />
              <Button primary fluid onClick={this.handleBarcodeActivate}>В чек</Button>
            </Form>
          </Grid.Column>
        </Grid>
        <Grid>
          <Grid.Row>
            <Grid.Column width={6}><Header as="h2" dividing>Сумма: </Header></Grid.Column>
            <Grid.Column width={10}><Header as="h2" dividing textAlign="right">{itemsCost}</Header></Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={6}><Header as="h2" dividing>Скидка: </Header></Grid.Column>
            <Grid.Column width={10}><Header as="h2" dividing textAlign="right">0.00</Header></Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={6}><Header as="h1">Итог: </Header></Grid.Column>
            <Grid.Column width={10}><Header as="h1" textAlign="right">{this.props.saleCheck.itemsCost}</Header></Grid.Column>
          </Grid.Row>
        </Grid>
        <Divider />
        <Form error={productNotFound}>
          <Form.Group>
            <Form.Input width={16}
              label="Наличными"
              value={cashAmount}
              onFocus={this.handleBarcodeFocus}
              onChange={this.handleCashAmountChange}
              control={this.createCashInput}
            />
          </Form.Group>
          <Form.Group>
            <Form.Select width={16} label="Клиент" options={[]} />
          </Form.Group>
          <Grid>
            <Grid.Column width={6}><Header as="h2">Сдача: </Header></Grid.Column>
            <Grid.Column width={10}>
              <Header as="h2" textAlign="right">
                {cashAmount > itemsCost ? Math.round((cashAmount - itemsCost + Number.EPSILON) * 100) / 100 : "0.00" }
              </Header>
            </Grid.Column>
          </Grid>
          <Divider />
        </Form>
        <Button positive fluid onClick={this.handleSaleCheckClose}>Оплатить</Button>
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
  return { saleCheck: state.saleCheck };
}

export default connect(stateMap, SaleCheckActions)(SaleCheck);

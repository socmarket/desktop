import React from "react";
import { connect } from "react-redux";
import { SaleCheckActions } from "serv/salecheck"
import {
  Header, Grid, Table, Form, Input, Select,
  TextArea, Button, Segment, Image,
  Label, Container, Menu, Message
} from "semantic-ui-react"

class SaleCheck extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      barcode: "",
      cashAmount: 0.00,
      searched: false
    }
    this.handleBarcodeActivate = this.handleBarcodeActivate.bind(this);
    this.handleBarcodeChange = this.handleBarcodeChange.bind(this);
    this.handleCashAmountChange = this.handleCashAmountChange.bind(this);
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

  handleBarcodeActivate(event) {
    if (event.key) {
      if (event.key === "Enter") {
        this.addSaleCheckItem();
      }
    } else {
        this.addSaleCheckItem();
    }
  }

  handleBarcodeChange(event) {
    this.setState({ barcode: event.target.value, searched: false });
  }

  handleCashAmountChange(event) {
    this.setState({ cashAmount: event.target.value });
  }

  componentDidUpdate() {
    const id = this.props.saleCheck.currentSaleCheckItem.productId;
    if (id > 0 && this.state.barcode.length > 0) {
      this.setState({ barcode: "" }, () => {
        this.addSaleCheckItem();
      });
    }
  }

  private table() {
    const items = this.props.saleCheck.items;
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
            <Table.Row key={idx}>
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

  private form() {
    const productId = this.props.saleCheck.currentSaleCheckItem.productId
    const barcode = this.state.barcode;
    const searched = this.state.searched;
    const productNotFound: boolean = productId < 0 && barcode.length > 0 && searched;
    return (
      <Segment>
        <Grid onKeyPress={this.handleBarcodeActivate}>
          <Grid.Column width={16}>
            <Form error={productNotFound}>
              <Form.Group>
                <Form.Input width={16}
                  autoFocus
                  label="Штрихкод"
                  value={this.state.barcode}
                  onBlur={this.handleBarcodeActivate}
                  onChange={this.handleBarcodeChange}
                />
              </Form.Group>
              <Message error header='Товар не найден' content="Проверьте штрихкод или вбейте его вручную" />
              <Button primary fluid>Добавить товар</Button>
            </Form>
          </Grid.Column>
        </Grid>
        <Segment>
          <Grid>
            <Grid.Row>
              <Grid.Column width={6}><Header as="h2" dividing>Сумма: </Header></Grid.Column>
              <Grid.Column width={10}><Header as="h2" dividing textAlign="right">{this.props.saleCheck.itemsCost}</Header></Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column width={6}><Header as="h2" dividing>Скидка: </Header></Grid.Column>
              <Grid.Column width={10}><Header as="h2" dividing textAlign="right">0.00</Header></Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column width={6}><Header as="h2" dividing>Итог: </Header></Grid.Column>
              <Grid.Column width={10}><Header as="h1" dividing textAlign="right">{this.props.saleCheck.itemsCost}</Header></Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
        <Form error={productNotFound}>
          <Form.Group>
            <Form.Input width={16}
              label="Наличными"
              value={this.state.cashAmount}
              onChange={this.handleCashAmountChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Select width={16} label="Клиент" options={[]} />
          </Form.Group>
        </Form>
        <Button positive fluid>Оплатить</Button>
      </Segment>
    );
  }

  render() {
    return (
      <Grid columns={2} padded>
        <Grid.Column width={5}>
          {this.form()}
        </Grid.Column>
        <Grid.Column width={11}>
          {this.table()}
        </Grid.Column>
      </Grid>
    );
  }
}

const stateMap = (state) => {
  return { saleCheck: state.saleCheck };
}

export default connect(stateMap, SaleCheckActions)(SaleCheck);


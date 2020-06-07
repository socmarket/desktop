import { ClientPicker } from "../client";
import { ProductPicker } from "../product";

import React from "react";
import { Translation } from 'react-i18next';
import {
  Segment, Grid, Form, Button, Divider,
  Message, Header, Container
} from "semantic-ui-react";

const defaultState = {
  cash: "",
  change: 0.00,
  client: { id: -1 },
  product: { id: -1 },
};

export class SaleCheckForm extends React.Component {

  static defaultProps = {
    errorMsg: "",
    cost: 0.00,
    items: [],
  };

  constructor(props) {
    super(props);

    this.api = props.api;

    this.state = {
      isError: this.props.errorMsg.length > 0,
      ...defaultState
    };

    this.onProductPick = this.onProductPick.bind(this);
    this.onClientPick = this.onClientPick.bind(this);
    this.onCashChange = this.onCashChange.bind(this);
    this.onActivate = this.onActivate.bind(this);

    this.createCashInput = this.createCashInput.bind(this);

    this.productPickerRef = React.createRef();
    this.clientPickerRef = React.createRef();
    this.cashInputRef = React.createRef();
  }

  focusProductPicker() {
    this.productPickerRef.current.focus();
  }

  focusClientPicker() {
    this.clientPickerRef.current.focus();
  }

  focusCashInput() {
    this.cashInputRef.current.focus();
    this.cashInputRef.current.select();
  }

  clear() {
    this.setState(
      defaultState,
      () => this.focusProductPicker()
    );
  }

  validate() {
    if (this.props.items.length <= 0) {
      this.focusProductPicker();
      return false;
    }
    if (this.state.client.id <= 0) {
      this.focusClientPicker();
      return false;
    }
    if (this.state.cash === "") {
      this.focusCashInput();
      return false;
    }
    return true;
  }

  activate() {
    if (this.validate()) {
      if (this.props.onActivate instanceof Function) {
        const res = this.props.onActivate(this.state.client, this.state.cash, this.state.change);
        if (res instanceof Promise) {
          res.then(_ => this.clear());
        } else {
          this.clear();
        }
      } else {
        this.clear();
      }
    }
  }

  onActivate(event) {
    if (event.key && event.key === "Enter" && event.shiftKey) {
      this.activate();
    }
  }

  onProductPick(product) {
    this.setState({
      product: product
    }, () => {
      if (this.props.onProductPick instanceof Function) {
        this.props.onProductPick(product);
      }
    });
  }

  onClientPick(client) {
    this.setState({
      client: client,
    }, () => {
      if (this.props.onClientPick instanceof Function) {
        this.props.onClientPick(client);
      }
    });
  }

  onCashChange(event) {
    try {
      const value = +event.target.value;
      if (event.target.value === "") {
        this.setState({
          cash: "",
          change: 0,
        });
      } else if (!isNaN(value) && isFinite(value)) {
        this.setState({
          cash: value,
          change: value - this.props.cost,
        });
      }
    } catch (e) {
    }
  }

  createCashInput(props) {
    return (
      <div className="ui input">
        <input ref={this.cashInputRef} style={{ textAlign: "right" }} {...props} />
      </div>
    );
  }

  render() {
    const me = this;
    return (
      <Translation ns={"salecheck.form"}>
      { (t, { i18n }) =>
      <Segment textAlign="left" onKeyDown={this.onActivate}>
        <Form error={me.state.isError}>
          <ProductPicker
            autoFocus
            api={me.api}
            value={this.state.product.id}
            forwardRef={this.productPickerRef}
            onPick={this.onProductPick}
          />
          <Divider />
          <Message error header='Товар не найден' content="Проверьте штрихкод или вбейте его вручную." />
        </Form>
        <br />
        <Grid>
          <Grid.Row>
            <Grid.Column width={6}><Header as="h2">{t("cost")}</Header></Grid.Column>
            <Grid.Column width={10}><Header as="h2" dividing textAlign="right">{me.props.cost}</Header></Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={6}><Header as="h2" >{t("discount")}</Header></Grid.Column>
            <Grid.Column width={10}><Header as="h2" dividing textAlign="right">0</Header></Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={6}><Header as="h1">{t("total")}</Header></Grid.Column>
            <Grid.Column width={10}>
              <Header dividing as="h1" textAlign="right">{me.props.cost}</Header>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={6}><Header as="h2">{t("change")}</Header></Grid.Column>
            <Grid.Column width={10}>
              <Header dividing as="h2" textAlign="right">{me.state.change}</Header>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <br />
        <Form>
          <Form.Field>
            <label>Клиент</label>
            <ClientPicker
              value={this.state.client.id}
              onPick={this.onClientPick}
              forwardRef={this.clientPickerRef}
            />
          </Form.Field>
          <Form.Group>
            <Form.Input
              width={16}
              label={t("cash")}
              value={this.state.cash}
              onChange={this.onCashChange}
              control={this.createCashInput}
            />
          </Form.Group>
        </Form>
        <Container align="right">
          <Button
            onClick={() => this.onActivate({ key: "Enter", shiftKey: true })}
          >
            {t("closeReceipt")} (Shift + Enter)
          </Button>
        </Container>
      </Segment>
      }
      </Translation>
    );
  }
}

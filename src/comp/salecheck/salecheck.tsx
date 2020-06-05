import React, { Fragment } from "react";
import { connect } from "react-redux";
import moment from "moment";
import {
  Header, Grid, Table, Form, Input, Select,
  TextArea, Button, Segment, Image,
  Label, Container, Menu, Message, Divider
} from "semantic-ui-react"

import { ClientPicker } from "../../aui/comp/client";
import { SaleCheckForm } from "../../aui/comp/salecheck";
import { SaleCheckActions } from "../../serv/salecheck"

import Journal from "./journal.tsx";

class SaleCheck extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      currentItemIdx: -1,
    }
    this.handleNavigation = this.handleNavigation.bind(this);
    this.handleIncQuantity = this.handleIncQuantity.bind(this);
    this.handleDecQuantity = this.handleDecQuantity.bind(this);
    this.handleSaleCheckClose = this.handleSaleCheckClose.bind(this);
    this.onProductSelected = this.onProductSelected.bind(this);
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

  handleSaleCheckClose(client, cash, change) {
    this.props.closeSaleCheck(cash, change, client.id);
    setTimeout(() => {
      switch (this.props.saleCheck.currentReport) {
        case "journal": 
          this.props.reloadSaleJournal();
          break;
      }
    }, 100);
  }

  componentDidMount() {
    this.props.updateSaleCheckList();
  }

  componentDidUpdate() {
    if (this.state.currentItemIdx >= this.props.saleCheck.items.length) {
      this.setState({
        currentItemIdx: -1
      });
    }
  }

  onProductSelected (product) {
    this.props.addSaleCheckItem(product.barcode);
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
            <input value={item.quantity} style={{ textAlign: "right" }} onKeyDown={this.handleNavigation} readOnly />
          </div>
        </Menu.Item>
        <Menu.Item><Button icon="minus" onClick={this.handleDecQuantity} /></Menu.Item>
        <Menu.Item><Button icon="plus" onClick={this.handleIncQuantity} /></Menu.Item>

        <Menu.Item><Button icon="arrow left" onClick={() => this.handleNavigation({ key: "ArrowUp" })} /></Menu.Item>
        <Menu.Item><Button icon="arrow right" onClick={() => this.handleNavigation({ key: "ArrowDown" })} /></Menu.Item>

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
          <SaleCheckForm
            api={window.api}
            cost={this.props.saleCheck.itemsCost}
            items={this.props.saleCheck.items}
            onProductPick={this.onProductSelected}
            onActivate={this.handleSaleCheckClose}
          />
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

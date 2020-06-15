import React from "react";
import { connect } from "react-redux";
import moment from "moment";
import { Header, Modal, Select, Grid, Form, Input, Table, Button, Segment, Image, Label, Container, Menu } from "semantic-ui-react"
import { AppActions } from "../../serv/app"
import { ClientActions } from "../../serv/client"

class ClientDialog extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      id: -1,
      name: "",
      contacts: "",
      notes: "",
      balanceItemAmount: 0,
    };
    this.activate = this.activate.bind(this);
    this.resetForm = this.resetForm.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleContactsChange = this.handleContactsChange.bind(this);
    this.handleNotesChange = this.handleNotesChange.bind(this);
    this.selectClient = this.selectClient.bind(this);

    this.onBalanceItemAmountChange = this.onBalanceItemAmountChange.bind(this);

    this.addDebit = this.addDebit.bind(this);
    this.addCredit = this.addCredit.bind(this);
  }

  componentDidMount() {
    this.props.setClientListFilter("");
  }

  handleFilterChange(event) {
    this.props.setClientListFilter(event.target.value);
  }

  onBalanceItemAmountChange(event) {
    try {
      const value = +event.target.value;
      if (!isNaN(value) && isFinite(value)) {
        this.setState({
          balanceItemAmount: value,
        });
      }
    } catch (e) {
    }
  }

  handleNameChange(event) {
    this.setState({
      name: event.target.value
    });
  }

  handleContactsChange(event) {
    this.setState({
      contacts: event.target.value
    });
  }

  handleNotesChange(event) {
    this.setState({
      notes: event.target.value
    });
  }

  resetForm() {
    this.setState({
      id: -1,
      name: "",
      contacts: "",
      notes: "",
      balanceItemAmount: 0,
    });
  }

  activate() {
    const act = () => {
      if (this.state.id < 0) {
        this.createClient();
      } else {
        this.updateClient();
      }
    }
    act();
  }

  createClient() {
    if (this.state.id < 0 && this.state.name.length > 0) {
      this.props.createClient(this.state);
      setTimeout(() => {
        this.setState({
          id: -1,
          name: "",
          contacts: "",
          notes: "",
        });
      }, 100);
    }
  }

  updateClient() {
    if (this.state.id > 0 && this.state.name.length > 0) {
      this.props.updateClient(this.state);
      setTimeout(() => {
        this.setState({
          id: -1,
          name: "",
          contacts: "",
          notes: "",
        });
      }, 100);
    }
  }

  selectClient(idx) {
    const items = this.props.client.items;
    if (idx >= 0 && idx < items.length) {
      const client = items[idx];
      this.setState({
        id: client.id,
        name: client.name,
        contacts: client.contacts,
        notes: client.notes,
        balanceItemAmount: 0,
      }, () => {
        this.props.reloadBalance(client.id);
      });
    }
  }

  addDebit() {
    if (this.state.id > 0 && this.state.balanceItemAmount > 0) {
      this.props.addBalanceItem(this.state.id, this.state.balanceItemAmount)
        .then(_ => {
          this.setState({
            balanceItemAmount: 0
          });
        })
      ;
    }
  }

  addCredit() {
    if (this.state.id > 0 && this.state.balanceItemAmount > 0) {
      this.props.addBalanceItem(this.state.id, -this.state.balanceItemAmount)
        .then(_ => {
          this.setState({
            balanceItemAmount: 0
          });
        })
      ;
    }
  }

  balance() {
    return (
      <Table compact celled selectable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell colSpan={2}>
              {this.state.name}
            </Table.HeaderCell>
            <Table.HeaderCell textAlign="right">
              {this.props.client.balance.total}
            </Table.HeaderCell>
          </Table.Row>
          <Table.Row>
            <Table.HeaderCell colSpan={3}>
              <Input width={5} value={this.state.balanceItemAmount} onChange={this.onBalanceItemAmountChange} />
              <Button color="green" icon="plus" floated="right" onClick={this.addDebit} />
              <Button color="red" icon="minus" floated="right" onClick={this.addCredit} />
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Дата</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">+</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">-</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          { this.props.client.balance.items.map( (item, idx) => (
            <Table.Row key={idx}>
              <Table.Cell>{item.day}</Table.Cell>
              <Table.Cell textAlign="right">{item.debit}</Table.Cell>
              <Table.Cell textAlign="right">{item.credit}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    );
  }

  table() {
    return (
      <Table compact celled selectable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>ФИО</Table.HeaderCell>
            <Table.HeaderCell>Контакты</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          { this.props.client.items.map( (client, idx) => (
            <Table.Row key={client.id} onClick={() => this.selectClient(idx)}>
              <Table.Cell>{client.name}</Table.Cell>
              <Table.Cell>{client.contacts}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    );
  }

  menu() {
    return (
      <Menu borderless>
        <Menu.Item>
          <h4>Клиенты</h4>
        </Menu.Item>
        <Menu.Item style={{ flexGrow: 1 }}>
          <Input
            className="icon"
            icon="search"
            value={this.props.client.filterPattern}
            onChange={this.handleFilterChange}
          />
        </Menu.Item>
      </Menu>
    );
  }

  card() {
    const isCreate = this.state.id < 0 && this.state.name.length > 0;
    const isUpdate = this.state.id > 0 && this.state.name.length > 0;
    return (
      <Segment>
        <Form>
          <Form.Group>
            <Form.Input
              width={16}
              label="Наименование\ФИО"
              autoFocus
              value={this.state.name}
              onChange={this.handleNameChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.TextArea
              width={16}
              label="Контакты"
              value={this.state.contacts}
              onChange={this.handleContactsChange}
            />
          </Form.Group>
          { !isUpdate && <Button primary fluid disabled={!isCreate} onClick={this.activate}>Добавить</Button> }
          { isUpdate && <Button primary fluid onClick={this.activate}>Изменить</Button> }
        </Form>
      </Segment>
    );
  }

  content() {
    return (
      <Container>
        {this.menu()}
        <Grid>
          <Grid.Row>
            <Grid.Column width={6}>
              {this.card()}
            </Grid.Column>
            <Grid.Column width={5} style={{ maxHeight: 400, overflowY: "auto" }}>
              {this.table()}
            </Grid.Column>
            <Grid.Column width={5}>
              {this.state.id > 0 && this.balance()}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }

  render() {
    return (
      <Modal open size="large" centered={false} closeIcon onClose={() => this.props.closeClients()}>
        <Modal.Content>
          {this.content()}
        </Modal.Content>
      </Modal>
    );
  }
}

const stateMap = (state) => {
  return {
    app: state.app,
    client: state.client,
  };
}

export default connect(stateMap, { ...AppActions, ...ClientActions })(ClientDialog);

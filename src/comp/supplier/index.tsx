import React from "react";
import { connect } from "react-redux";
import moment from "moment";
import { Header, Modal, Select, Grid, Form, Input, Table, Button, Segment, Image, Label, Container, Menu } from "semantic-ui-react"
import { AppActions } from "../../serv/app"
import { SupplierActions } from "../../serv/supplier"

class SupplierDialog extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      id: -1,
      name: "",
      contacts: "",
      notes: "",
    };
    this.activate = this.activate.bind(this);
    this.resetForm = this.resetForm.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleContactsChange = this.handleContactsChange.bind(this);
    this.handleNotesChange = this.handleNotesChange.bind(this);
    this.selectSupplier = this.selectSupplier.bind(this);
  }

  componentDidMount() {
    this.props.setSupplierListFilter("");
  }

  handleFilterChange(event) {
    this.props.setSupplierListFilter(event.target.value);
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
    });
  }

  activate(event) {
    const act = () => {
      if (this.state.id < 0) {
        this.createSupplier();
      } else {
        this.updateSupplier();
      }
    }
    if (event.key) {
      if (event.key === "Enter" && event.shiftKey) {
        act();
      }
    } else {
      act();
    }
  }

  createSupplier() {
    if (this.state.id < 0 && this.state.name.length > 0) {
      this.props.createSupplier(this.state);
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

  updateSupplier() {
    if (this.state.id > 0 && this.state.name.length > 0) {
      this.props.updateSupplier(this.state);
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

  selectSupplier(idx) {
    const items = this.props.supplier.items;
    if (idx >= 0 && idx < items.length) {
      const sup = items[idx];
      this.setState({
        id: sup.id,
        name: sup.name,
        contacts: sup.contacts,
        notes: sup.notes,
      });
    }
  }

  private table() {
    return (
      <Table compact celled selectable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>№</Table.HeaderCell>
            <Table.HeaderCell>ФИО</Table.HeaderCell>
            <Table.HeaderCell>Контакты</Table.HeaderCell>
            <Table.HeaderCell>Заметки</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          { this.props.supplier.items.map( (sup, idx) => (
            <Table.Row key={sup.id} onClick={() => this.selectSupplier(idx)}>
              <Table.Cell>{sup.id}</Table.Cell>
              <Table.Cell>{sup.name}</Table.Cell>
              <Table.Cell>{sup.contacts}</Table.Cell>
              <Table.Cell>{sup.notes}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    );
  }

  private menu() {
    return (
      <Menu borderless>
        <Menu.Item>
          <h4>Поставщики</h4>
        </Menu.Item>
        <Menu.Item style={{ flexGrow: 1 }}>
          <Input
            className="icon"
            icon="search"
            value={this.props.supplier.filterPattern}
            onChange={this.handleFilterChange}
          />
        </Menu.Item>
        <Menu.Item position="right">
          { !this.props.supplier.showForm && <Button icon="angle down" onClick={() => this.props.showSupplierForm()} /> }
          { this.props.supplier.showForm && <Button icon="angle up" onClick={() => this.props.hideSupplierForm()} /> }
        </Menu.Item>
      </Menu>
    );
  }

  card() {
    const isCreate = this.state.id < 0 && this.state.name.length > 0;
    const isUpdate = this.state.id > 0 && this.state.name.length > 0;
    return (
      <Grid columns={2} onKeyPress={this.activate}>
        <Grid.Row>
          <Grid.Column width={6}>
            <Image fluid bordered rounded src="https://picsum.photos/200/250" />
          </Grid.Column>
          <Grid.Column width={10}>
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
              <Form.Group>
                <Form.TextArea
                  width={16}
                  label="Заметки"
                  value={this.state.notes}
                  onChange={this.handleNotesChange}
                />
              </Form.Group>
              { !isUpdate && <Button primary fluid disabled={!isCreate} >Добавить</Button> }
              { isUpdate && <Button primary fluid>Изменить</Button> }
            </Form>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }

  private content() {
    const formVisible = this.props.supplier.showForm;
    const minHeight = 200;
    const maxHeight = formVisible ? 200 : 200 + this.state.formHeight;
    return (
      <Container>
        {this.menu()}
        { this.props.supplier.showForm &&
          <div className="ui segment">
            {this.card()}
          </div>
        }
        <Container style={{ minHeight: minHeight, maxHeight: maxHeight, overflowY: "scroll"}}>
          {this.table()}
        </Container>
      </Container>
    );
  }

  render() {
    return (
      <Modal open size="small" centered={false} closeIcon onClose={() => this.props.closeSuppliers()}>
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
    supplier: state.supplier,
  };
}

export default connect(stateMap, { ...AppActions, ...SupplierActions })(SupplierDialog);
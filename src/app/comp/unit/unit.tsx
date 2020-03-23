import React from "react";
import { connect } from "react-redux";
import moment from "moment";
import { Header, Modal, Grid, Form, Input, Table, Button, Segment, Image, Label, Container, Menu } from "semantic-ui-react"
import { AppActions } from "serv/app"
import { UnitActions } from "serv/unit"

class UnitDialog extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      title: "",
      notation: "",
      currentItemIdx: -1,
    };

    this.onActivate = this.onActivate.bind(this);
    this.onTitleChanged = this.onTitleChanged.bind(this);
    this.onNotationChanged = this.onNotationChanged.bind(this);
    this.handleNavigation = this.handleNavigation.bind(this);

    this.createTitleInput = this.createTitleInput.bind(this);
    this.createNotationInput = this.createNotationInput.bind(this);

    this.inputTile = React.createRef();
    this.inputNotation = React.createRef();
  }

  handleNavigation(event) {
    const items = this.props.unitList.items;
    const count = this.props.unitList.items.length;
    if (event.key && count > 0) {
      if (event.key === "ArrowUp") {
        const cidx = (this.state.currentItemIdx <= 0 ? count : this.state.currentItemIdx) - 1;
        const citem = (cidx >= 0 && cidx < count) ? items[cidx] : { title: "", notation: "" };
        this.setState({
          currentItemIdx: cidx,
          title: citem.title,
          notation: citem.notation,
        });
      } else if (event.key === "ArrowDown") {
        const cidx = (this.state.currentItemIdx === (count - 1) ? -1 : this.state.currentItemIdx) + 1;
        const citem = (cidx >= 0 && cidx < count) ? items[cidx] : { title: "", notation: "" };
        this.setState({
          currentItemIdx: cidx,
          title: citem.title,
          notation: citem.notation,
        });
      }
    }
  }

  onActivate(event) {
    if (event.key === "Enter") {
      const items = this.props.unitList.items;
      const count = this.props.unitList.items.length;
      const cidx = this.state.currentItemIdx;
      if (cidx >= 0 && cidx < count) {
        this.props.updateUnit({
          id: items[cidx].id,
          title: this.state.title,
          notation: this.state.notation,
        });
      }
    }
  }

  onTitleChanged(event) {
    this.setState({
      title: event.target.value,
    });
  }

  onNotationChanged(event) {
    this.setState({
      notation: event.target.value,
    });
  }

  private createTitleInput() {
    return (
      <div className="ui input">
        <input autoFocus size="tiny" ref={this.inputTitle} value={this.state.title} onChange={this.onTitleChanged} onKeyPress={this.onActivate} />
      </div>
    );
  }

  private createNotationInput() {
    return (
      <div className="ui input">
        <input size="tiny" ref={this.inputNotation} value={this.state.notation} onChange={this.onNotationChanged} onKeyPress={this.onActivate} />
      </div>
    );
  }

  private table() {
    const items = this.props.unitList.items;
    const currentIdx = this.state.currentItemIdx;
    return (
      <Table compact celled selectable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Название</Table.HeaderCell>
            <Table.HeaderCell>Обозначение</Table.HeaderCell>
            <Table.HeaderCell>№</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          { items.map((unit, idx) => (
            <Table.Row key={unit.id} active={idx === currentIdx}>
              <Table.Cell>
                { (idx === currentIdx) && this.createTitleInput() }
                { (idx !== currentIdx) && unit.title }
              </Table.Cell>
              <Table.Cell>
                { (idx === currentIdx) && this.createNotationInput() }
                { (idx !== currentIdx) && unit.notation }
              </Table.Cell>
              <Table.Cell>{unit.id}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    );
  }

  private menu() {
    return (
      <Container>
        <Header floated="left" content="Единицы измерения" block size="tiny" />
        <Button primary icon="plus" floated="right" onClick={this.props.addUnit} />
        <Input
          autoFocus
          className="icon"
          icon="search"
          floated="right"
          fluid
        />
      </Container>
    );
  }

  content() {
    return (
      <Container onKeyDown={this.handleNavigation}>
        {this.menu()}
        {this.table()}
      </Container>
    );
  }

  render() {
    return (
      <Modal open size="small" centered={false} closeIcon onClose={() => this.props.closeUnits()}>
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
    unitList: state.unitList,
  };
}

export default connect(stateMap, { ...AppActions, ...UnitActions })(UnitDialog);

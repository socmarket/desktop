import React from "react";
import { connect } from "react-redux";
import moment from "moment";
import { Header, Modal, Select, Grid, Form, Input, Table, Button, Segment, Image, Label, Container, Menu } from "semantic-ui-react"
import { AppActions } from "../../serv/app"
import { CategoryActions } from "../../serv/category"

class CategoryDialog extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      title: "",
      parentId: -1,
      currentItemIdx: -1,
    };

    this.onActivate = this.onActivate.bind(this);
    this.onTitleChanged = this.onTitleChanged.bind(this);
    this.onParentChanged = this.onParentChanged.bind(this);
    this.createTitleInput = this.createTitleInput.bind(this);
    this.handleNavigation = this.handleNavigation.bind(this);

    this.inputTile = React.createRef();
  }

  componentDidMount() {
    this.props.loadCategoryList();
  }

  handleNavigation(event) {
    const items = this.props.categoryList.items;
    const count = this.props.categoryList.items.length;
    if (event.key && count > 0) {
      if (event.key === "ArrowUp") {
        const cidx = (this.state.currentItemIdx <= 0 ? count : this.state.currentItemIdx) - 1;
        const citem = (cidx >= 0 && cidx < count) ? items[cidx] : { title: "" };
        this.setState({
          currentItemIdx: cidx,
          title: citem.title,
          parentId: citem.parentId,
        });
      } else if (event.key === "ArrowDown") {
        const cidx = (this.state.currentItemIdx === (count - 1) ? -1 : this.state.currentItemIdx) + 1;
        const citem = (cidx >= 0 && cidx < count) ? items[cidx] : { title: "" };
        this.setState({
          currentItemIdx: cidx,
          title: citem.title,
          parentId: citem.parentId,
        });
      }
    }
  }

  onActivate(event) {
    if (event.key === "Enter") {
      const items = this.props.categoryList.items;
      const count = this.props.categoryList.items.length;
      const cidx = this.state.currentItemIdx;
      if (cidx >= 0 && cidx < count) {
        this.props.updateCategory({
          id: items[cidx].id,
          title: this.state.title,
          parentId: this.state.parentId,
        });
      }
    }
  }

  onTitleChanged(event) {
    this.setState({
      title: event.target.value,
    });
  }

  onParentChanged(event, data) {
    this.setState({
      parentId: data.value
    });
  }

  private createTitleInput() {
    return (
      <div className="ui input">
        <input autoFocus size="tiny" ref={this.inputTitle} value={this.state.title} onChange={this.onTitleChanged} onKeyPress={this.onActivate} />
      </div>
    );
  }

  private createParentSelect() {
    return (
      <Select size="tiny" value={this.state.parentId} options={this.props.categoryOptions} onChange={this.onParentChanged} onKeyPress={this.onActivate} />
    );
  }

  private table() {
    const items = this.props.categoryList.items;
    const currentIdx = this.state.currentItemIdx;
    return (
      <Table compact celled selectable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Название</Table.HeaderCell>
            <Table.HeaderCell>Родитель</Table.HeaderCell>
            <Table.HeaderCell>№</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          { items.map((category, idx) => (
            <Table.Row key={category.id} active={idx === currentIdx}>
              <Table.Cell>
                { (idx === currentIdx) && this.createTitleInput() }
                { (idx !== currentIdx) && category.title }
              </Table.Cell>
              <Table.Cell>
                { (idx === currentIdx) && this.createParentSelect() }
                { (idx !== currentIdx) && category.parentTitle }
              </Table.Cell>
              <Table.Cell>{category.id}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    );
  }

  private menu() {
    return (
      <Container>
        <Header floated="left" content="Категории товаров" block size="tiny" />
        <Button primary icon="plus" floated="right" onClick={this.props.addCategory} />
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
        <Container style={{ maxHeight: 400, overflowY: "auto" }}>
        {this.table()}
        </Container>
      </Container>
    );
  }

  render() {
    return (
      <Modal open size="small" centered={false} closeIcon onClose={() => this.props.closeCategories()}>
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
    categoryList: state.categoryList,
    categoryOptions: state.registry.categoryOptions,
  };
}

export default connect(stateMap, { ...AppActions, ...CategoryActions })(CategoryDialog);

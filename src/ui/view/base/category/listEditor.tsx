import CategoryInfoEditor         from "./infoEditor"
import {
  inputWithRef
}                    from "Util"

import React, { Fragment } from "react"
import moment from "moment"
import { Translation } from 'react-i18next'
import {
  Header, Grid, Table, Form, Input, Select,
  TextArea, Button, Segment, Image, Icon,
  Label, Container, Menu, Message, Divider,
  Rail, Dropdown
} from "semantic-ui-react"

class CategoryListEditor extends React.Component {

  emptyCategory = {
    id    : -1,
    title : "",
    notes : "",
  }

  constructor(props) {
    super(props)

    this.onCreate        = this.onCreate.bind(this)
    this.onUpdate        = this.onUpdate.bind(this)
    this.onKeyDown       = this.onKeyDown.bind(this)
    this.onGlobalKeyDown = this.onGlobalKeyDown.bind(this)
    this.onPatternChange = this.onPatternChange.bind(this)

    this.closeInfoEditor = this.closeInfoEditor.bind(this)

    this.tableRef        = React.createRef()
    this.patternInputRef = React.createRef()
    this.patternInput    = inputWithRef(this.patternInputRef)

    this.categoryApi = props.api.category
    this.state = {
      category            : this.emptyCategory,
      items             : [],
      pattern           : "",
      infoEditorVisible : false,
      idx               : -1,
    }
  }

  reloadCategoryList() {
    const idx = this.state.idx
    return this.categoryApi
      .find(this.state.pattern)
      .then(items => this.setState({
        items: items,
        idx  : idx >= items.length ? items.length - 1: idx
      }))
  }

  componentDidMount() {
    this.reloadCategoryList()
  }

  openCategory(category, idx) {
    this.setState({
      category            : category,
      infoEditorVisible : true,
    })
  }

  closeInfoEditor() {
    this.setState({
      infoEditorVisible : false,
    }, () => {
      this.patternInputRef.current.focus()
    })
  }

  openExhangeRatesFor(category, idx) {
    this.setState({
      idx    : idx,
      category : category,
    })
  }

  onCreate() {
    this.closeInfoEditor()
    this.reloadCategoryList()
  }

  onUpdate() {
    this.closeInfoEditor()
    this.reloadCategoryList()
  }

  onKeyDown(ev) {
    const count = this.state.items.length
    switch (ev.key) {
      case "ArrowUp": {
        const cidx = this.state.idx <= 0 ? count : this.state.idx
        const category = this.state.items[cidx - 1]
        this.setState({
          idx: cidx - 1,
          category: category ? category : this.emptyCategory,
        })
        break
      }
      case "ArrowDown": {
        const cidx = this.state.idx === (count - 1) ? -1 : this.state.idx
        const category = this.state.items[cidx + 1]
        this.setState({
          idx: cidx + 1,
          category: category ? category : this.emptyCategory,
        })
        break
      }
      case "Enter": {
        if (ev.shiftKey) {
          this.onActivate()
        } else {
          const category = this.state.items[this.state.idx]
          this.openCategory(category ? category : emptyCategory, this.state.idx)
        }
        break
      }
    }
  }

  onGlobalKeyDown(ev) {
    switch (ev.key) {
      case "Escape": {
        this.patternInputRef.current.focus()
      }
    }
  }

  onPatternChange(ev) {
    this.setState({
      pattern: ev.target.value,
    }, () => this.reloadCategoryList())
  }

  infoEditor() {
    return (
      <CategoryInfoEditor
        open
        api={this.props.api}
        theme={this.props.theme}
        category={this.state.category}
        onCreate={this.onCreate}
        onUpdate={this.onUpdate}
        onClose={this.closeInfoEditor}
      />
    )
  }

  list() {
    return (
      <Segment raised color={this.props.theme.mainColor} onKeyDown={this.onKeyDown} tabIndex={-1}>
        <Header as="h2" dividing color={this.props.theme.mainColor} textAlign="center">
          <Icon name="law" />
          Группы товаров
        </Header>
        <Form width={16}>
          <Form.Group>
            <Form.Input
              floated="left"
              icon="search"
              placeholder="Поиск группы"
              value={this.state.pattern}
              control={this.patternInput}
              onChange={this.onPatternChange}
            />
            <Button floated="right" icon="plus" onClick={() => this.openCategory(this.emptyCategory, -1)} />
          </Form.Group>
        </Form>
        <Menu vertical fluid>
          {this.state.items.map((category, idx) => (
            <Menu.Item
              key={category.id}
              active={this.state.category.id === category.id}
              color={this.props.theme.mainColor}
              onClick={() => this.openCategory(category, idx)}
            >
              {category.title}
              <Label size="large" color={category.balance < 0 ? "red" : "green"}>
                {category.balance}
              </Label>
            </Menu.Item>
          ))}
        </Menu>
      </Segment>
    )
  }

  render() {
    return (
      <Fragment>
        {this.list()}
        {this.state.infoEditorVisible && this.infoEditor()}
      </Fragment>
    )
  }
}

export default CategoryListEditor

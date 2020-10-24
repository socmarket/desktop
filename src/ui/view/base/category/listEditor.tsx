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
import { withTranslation } from 'react-i18next';

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
    this.onPatternChange = this.onPatternChange.bind(this)

    this.closeInfoEditor = this.closeInfoEditor.bind(this)

    this.tableRef        = React.createRef()

    this.categoryApi = props.api.category
    this.state = {
      category            : this.emptyCategory,
      items             : [],
      pattern           : "",
      infoEditorVisible : false,
      idx               : -1,
    }
    this.t = this.props.t
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
      category : category,
    }, () => {
      if (this.props.onCategorySelected) {
        this.props.onCategorySelected(category)
      }
    })
  }

  editCategory(category, idx) {
    this.setState({
      category : category,
      infoEditorVisible : true,
    })
  }

  closeInfoEditor() {
    this.setState({
      infoEditorVisible : false,
    }, () => {
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
          this.editCategory(category ? category : emptyCategory, this.state.idx)
        }
        break
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
      <Menu vertical fluid onKeyDown={this.onKeyDown}>
        <Menu.Item header>
          <Icon name="sitemap" />
          {this.t("productGroups")}
        </Menu.Item>
        <Menu.Item>
          <Input
            icon="search"
            iconPosition="left"
            placeholder={this.t('groupsSearch')}
            value={this.state.pattern}
            control={this.patternInput}
            onChange={this.onPatternChange}
            size="mini"
            action={
              <Button icon="plus" onClick={() => this.editCategory(this.emptyCategory, -1)} />
            }
          />
        </Menu.Item>
        <Menu.Item
          active={this.state.category.id < 0}
          onClick={() => this.openCategory(this.emptyCategory, -1)}
        >
          {this.t("all")}
        </Menu.Item>
        <div style={{ height: "400px", overflowY: "auto" }}>
          {this.state.items.map((category, idx) => (
            <Menu.Item
              key={category.id}
              active={this.state.category.id === category.id}
              color={this.props.theme.mainColor}
              onClick={() => this.openCategory(category, idx)}
              onDoubleClick={() => this.editCategory(category, idx)}
            >
              {category.title}
              <Label color={this.props.opt.theme.mainColor}>
                {category.productCount}
              </Label>
            </Menu.Item>
          ))}
        </div>
      </Menu>
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

export default withTranslation("category_listEditor")(CategoryListEditor)

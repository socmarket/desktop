import CategoryInfoEditor         from "./infoEditor"
import CategoryListEditor         from "./listEditor"
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

class CategoryEditor extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Fragment>
        <Grid padded className="light-focus">
          <Grid.Column width={4}>
            <CategoryListEditor
              api={this.props.api}
              theme={this.props.theme}
              opt={this.props.opt}
            />
          </Grid.Column>
          <Grid.Column width={4}>
          </Grid.Column>
        </Grid>
      </Fragment>
    )
  }
}

export default CategoryEditor

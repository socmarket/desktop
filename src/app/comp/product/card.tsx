import React from "react";
import { connect } from "react-redux";
import { AppActions } from "serv/app"
import { Grid, Form, Input, Select, TextArea, Button, Segment, Image } from "semantic-ui-react"

const options = [
  { key: 'm', text: 'Male', value: 'male' },
  { key: 'f', text: 'Female', value: 'female' },
  { key: 'o', text: 'Other', value: 'other' },
]

class ProductCard extends React.Component {
  render() {
    return (
      <Grid columns={2}>
        <Grid.Column width={6}>
          <Image fluid bordered rounded src="https://picsum.photos/200/250" />
        </Grid.Column>
        <Grid.Column width={10}>
          <Form>
            <Form.Group>
              <Form.Input width={10} label="Штрихкод" />
              <Form.Select width={6} label="Ед. изм." options={options} fluid />
            </Form.Group>
            <Form.Group>
              <Form.Input width={16} label="Наименование" />
            </Form.Group>
            <Form.Group>
            </Form.Group>
            <Form.Group>
              <Form.TextArea width={16} label="Описание" />
            </Form.Group>
          </Form>
        </Grid.Column>
      </Grid>
    );
  }
}

const stateMap = (state) => {
  return {};
}

export default connect(stateMap, AppActions)(ProductCard);

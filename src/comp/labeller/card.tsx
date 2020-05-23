import React from "react";
import { connect } from "react-redux";
import { Container, Grid, Menu, Table, Form, Input, Select, TextArea, Button, Segment, Image, Label } from "semantic-ui-react"
import { Labeller, LabellerActions } from "../../serv/labeller"

class LabellerCard extends React.Component {

  constructor(props) {
    super(props);
  }

  private table() {
    return (
      <Table compact celled selectable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Штрихкод</Table.HeaderCell>
            <Table.HeaderCell>Название</Table.HeaderCell>
            <Table.HeaderCell>№</Table.HeaderCell>
            <Table.HeaderCell>Описание</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
        </Table.Body>
      </Table>
    );
  }

  private menu() {
    return (
      <Menu>
        <Menu.Item>
          <h4>Поиск</h4>
        </Menu.Item>
        <Menu.Item style={{ flexGrow: 1 }}>
          <Input
            className="icon"
            icon="search"
          />
        </Menu.Item>
        <Menu.Item position="right">
          <Button.Group>
            { <Button icon="angle down"  /> }
            { <Button icon="angle up" /> }
          </Button.Group>
        </Menu.Item>
      </Menu>
    );
  }

  private form() {
    return (
      <Grid columns={2}>
        <Grid.Row>
          <Grid.Column width={16}>
            <Form>
              <Form.Group>
                <Form.Input width={6}
                  label="Штрихкод"
                  autoFocus
                />
                <Form.Input width={10} label="Наименование"
                />
              </Form.Group>
            </Form>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }

  render() {
    return (
      <Container>
        {this.menu()}
        {this.form()}
        <Container style={{overflowY: "auto"}}>
          {this.table()}
        </Container>
      </Container>
    );
  }
}

const stateMap = (state) => {
  return {
  };
}

export default connect(stateMap, LabellerActions)(LabellerCard);

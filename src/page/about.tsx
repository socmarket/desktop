import { AppActions } from "../serv/app"

import { connect } from "react-redux";
import React, { Fragment } from "react";
import { Modal, Divider, Grid, Header, Message, Segment } from 'semantic-ui-react'

class AboutDialog extends React.Component {
  render() {
    return (
      <Modal open size="mini" centered={false} onClose={() => this.props.closeAbout()}>
        <Modal.Content>
          <Segment>
            <Grid columns={2}>
              <Grid.Column textAlign="right">
                <p>Версия</p>
                <p>Сборка</p>
                <p>Выпуск</p>
              </Grid.Column>
              <Grid.Column>
                <p>{VERSION.value}</p>
                <p>{VERSION.hash.substring(0, 8)}</p>
                <p>{VERSION.date.substring(0, 10)}</p>
              </Grid.Column>
            </Grid>
            <Divider vertical />
          </Segment>
        </Modal.Content>
      </Modal>
    );
  }
}

const stateMap = (state) => {
  return {
  };
}

export default connect(stateMap, { ...AppActions })(AboutDialog);

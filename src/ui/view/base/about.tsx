import { AppActions } from "../serv/app"

import { connect } from "react-redux";
import React, { Fragment } from "react";
import { Modal, Divider, Grid, Header, Message, Segment } from 'semantic-ui-react'
import { withTranslation } from 'react-i18next';

class AboutDialog extends React.Component {

  constructor(props){
    this.t = this.props.t
  }
  render() {
    return (
      <Modal open size="mini" centered={false} onClose={() => this.props.closeAbout()}>
        <Modal.Content>
          <Segment>
            <Grid columns={2}>
              <Grid.Column textAlign="right">
                <p>{this.t("version")}</p>
                <p>{this.t("build")}</p>
                <p>{this.t("buildDate")}</p>
                <p>Yay it works!</p>
                <p>Yay it worked again!</p>
              </Grid.Column>
              <Grid.Column>
                <p>{VERSION.value}</p>
                <p>{VERSION.hash.substring(0, 8)}</p>
                <p>{VERSION.date.substring(0, 10)}</p>
              </Grid.Column>
            </Grid>
            <Divider vertical>|</Divider>
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

export default connect(stateMap,
  { ...AppActions })(withTranslation("base_about.form")(AboutDialog));

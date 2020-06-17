import React from "react";
import { connect } from "react-redux";
import moment from "moment";
import { ResponsivePie } from '@nivo/pie'
import { Container, Modal, Grid, Form, Input, Table, Button, Segment, Image, Label } from "semantic-ui-react"
import Printer from "./printer"
import { AppActions } from "../../serv/app"
import { SettingsActions } from "../../serv/settings"

class SettingsDialog extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Modal open size="small" centered={false} closeIcon onClose={() => this.props.closeSettings()}>
        <Modal.Content>
          <Printer />
        </Modal.Content>
      </Modal>
    );
  }

}

const stateMap = (state) => {
  return {
    data: state.settings,
  };
}

export default connect(stateMap, { ...AppActions, ...SettingsActions })(SettingsDialog);

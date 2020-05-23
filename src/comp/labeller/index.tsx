import React from "react";
import { connect } from "react-redux";
import moment from "moment";
import { ResponsivePie } from '@nivo/pie'
import { Modal, Grid, Form, Input, Table, Button, Segment, Image, Label } from "semantic-ui-react"
import LabellerCard from "./card.tsx"
import { AppActions } from "../../serv/app"
import { LabellerActions } from "../../serv/labeller"

class LabellerDialog extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Modal open size="small" centered={false} closeIcon onClose={() => this.props.closeLabeller()}>
        <Modal.Content>
          <LabellerCard />
        </Modal.Content>
      </Modal>
    );
  }

}

const stateMap = (state) => {
  return {
    data: state.labeller,
  };
}

export default connect(stateMap, { ...AppActions, ...LabellerActions })(LabellerDialog);


import { SaleCheckForm } from "../../aui/comp/salecheck";

import React, { Fragment } from "react";
import { connect } from "react-redux";
import { Grid, Segment } from "semantic-ui-react";

export class SaleCheckPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    };
    this.onClientPick = this.onClientPick.bind(this);
    this.onProductPick = this.onProductPick.bind(this);
    this.onFormActivate = this.onFormActivate.bind(this);
  }

  onClientPick(client) {
  }

  onProductPick(product) {
  }

  onFormActivate(client, cash, change) {
  }

  render() {
    return (
      <Grid columns={2} padded>
        <Grid.Column width={5}>
          <SaleCheckForm
            api={this.props.api}
            items={this.state.items}
            onClientPick={this.onClientPick}
            onProductPick={this.onProductPick}
            onActivate={this.onFormActivate}
          />
        </Grid.Column>
        <Grid.Column width={11}>
        </Grid.Column>
      </Grid>
    );
  }
}

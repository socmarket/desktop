import React, { Fragment } from "react";
import { connect } from "react-redux";
import { Grid, Segment } from "semantic-ui-react";

import { SaleCheckPage } from "../../arx/salecheck";

export default class Test extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      items: []
    };
    this.onProductPick = this.onProductPick.bind(this);
    this.onFormActivate = this.onFormActivate.bind(this);
  }

  onClientPick(client) {
  }

  onProductPick(product) {
    this.setState({
      items: this.state.items.concat([product])
    });
  }

  onFormActivate(client, cash) {
    this.setState({
      items: []
    });
  }

  render() {
    return (
      <SaleCheckPage api={window.api} />
    );
  }
}

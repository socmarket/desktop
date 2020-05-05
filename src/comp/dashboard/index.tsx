import React from "react";
import { connect } from "react-redux";
import moment from "moment";
import { ResponsivePie } from '@nivo/pie'
import { Container, Grid, Form, Input, Table, Button, Segment, Image, Label } from "semantic-ui-react"
import { AppActions } from "../../serv/app"
import { DashboardActions } from "../../serv/dashboard"

class Dashboard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }

  componentDidMount() {
    this.props.reloadTotalSaleQuantityByProduct();
  }

  render() {
    const data = this.props.data.totalSaleQuantityByProduct.map(item => ({
      id: item.title,
      label: item.title,
      value: item.quantity,
    }));
    return (
      <div style={{ width: "100%", height: "95.5%", padding: 0 }}>
        <ResponsivePie
            data={data}
            margin={{ top: 100, right: 100, bottom: 150, left: 100 }}
            innerRadius={0.5}
            padAngle={0.7}
            cornerRadius={3}
            colors={{ scheme: 'nivo' }}
            borderWidth={1}
            borderColor={{ from: 'color', modifiers: [ [ 'darker', 0.2 ] ] }}
            radialLabelsSkipAngle={10}
            radialLabelsTextXOffset={6}
            radialLabelsTextColor="#333333"
            radialLabelsLinkOffset={0}
            radialLabelsLinkDiagonalLength={16}
            radialLabelsLinkHorizontalLength={24}
            radialLabelsLinkStrokeWidth={1}
            radialLabelsLinkColor={{ from: 'color' }}
            slicesLabelsSkipAngle={10}
            slicesLabelsTextColor="#333333"
            animate={true}
            motionStiffness={90}
            motionDamping={15}
        />
      </div>
    );
  }

}

const stateMap = (state) => {
  return {
    data: state.dashboard,
  };
}

export default connect(stateMap, { ...DashboardActions })(Dashboard);

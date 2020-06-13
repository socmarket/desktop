import React from "react";
import { connect } from "react-redux";
import moment from "moment";
import { ru, fr } from "date-fns/locale";
import { ResponsivePie } from "@nivo/pie"
import { ResponsiveBar } from "@nivo/bar"
import { Menu, Container, Grid, Form, Input, Table, Button, Segment, Image, Label } from "semantic-ui-react"
import { DateRangePicker, SingleDatePicker, DayPickerRangeController } from "react-dates";
import { AppActions } from "../../serv/app"
import { DashboardActions } from "../../serv/dashboard"

import "moment/locale/ru";

class Dashboard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      start: moment(),
      end: moment(),
    };
  }

  componentDidMount() {
    this.props.reloadProfitByDay(
      this.state.start,
      this.state.end,
    );
  }

  menu() {
    return (
      <Menu fluid secondary size="mini">
        <Menu.Item fitted="vertically">
          <DateRangePicker
            showClearDates
            startDatePlaceholderText="Начало"
            endDatePlaceholderText="Конец"
            phrases={{
              closeDatePicker: "Закрыть",
              clearDates: "Очистить"
            }}

            startDate={this.state.start}
            endDate={this.state.end}

            startDateId="your_unique_start_date_id"
            endDateId="your_unique_end_date_id"

            onDatesChange={({ startDate, endDate }) => this.setState({ start: startDate, end: endDate })}
            focusedInput={this.state.focusedInput}
            onFocusChange={focusedInput => this.setState({ focusedInput })}
          />
        </Menu.Item>
      </Menu>
    );
  }

  profitByDayBar() {
    const data = this.props.dashboard.profitByDay.items
    console.log(data);
    return (
      <ResponsiveBar
        data={data}
        indexBy="day"
        keys={[ "cost", "profit" ]}
        padding={0.3}
        colors={{ scheme: "nivo" }}
        margin={{ top: 10, right: 10, bottom: 25, left: 10 }}
        axisLeft={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
        }}
      />
    );
  }

  profitByDayTable() {
    const data = this.props.dashboard.profitByDay.items;
    return (
      <div style={{ maxHeight: "100%", overflowY: "auto" }}>
        <Table basic compact structured>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>День</Table.HeaderCell>
              <Table.HeaderCell>Всего</Table.HeaderCell>
              <Table.HeaderCell>Стоимость</Table.HeaderCell>
              <Table.HeaderCell>Прибыль</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            { data.map(item => (
              <Table.Row key={item.day}>
                <Table.Cell textAlign="right">{item.day}</Table.Cell>
                <Table.Cell textAlign="right">{item.total}</Table.Cell>
                <Table.Cell textAlign="right">{item.cost}</Table.Cell>
                <Table.Cell textAlign="right">{item.profit}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    );
  }

  render() {
    return (
      <Grid padded>
        <Grid.Row>
          {this.menu()}
        </Grid.Row>
        <Grid.Row style={{ height: 300, minHeight: 300, maxHeight: 300 }}>
          <Grid.Column width={6} style={{ height: "100%" }}>
            {this.profitByDayTable()}
          </Grid.Column>
          <Grid.Column width={10} style={{ height: "100%" }}>
            <Segment style={{ height: "100%" }}>
              {this.profitByDayBar()}
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }

}

const stateMap = (state) => {
  return {
    dashboard: state.dashboard,
  };
}

export default connect(stateMap, { ...DashboardActions })(Dashboard);

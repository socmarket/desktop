import React from "react";
import { connect } from "react-redux";
import moment from "moment";
import { ru, fr } from "date-fns/locale";
import { ResponsivePie } from "@nivo/pie"
import { ResponsiveBar } from "@nivo/bar"
import { Menu, Container, Grid, Form, Input, Table, Button, Segment, Image, Label, Statistic } from "semantic-ui-react"
import { DateRangePicker, SingleDatePicker, DayPickerRangeController } from "react-dates";
import { AppActions } from "../../serv/app"
import { DashboardActions } from "../../serv/dashboard"

import "moment/locale/ru";

class Dashboard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      start: moment().subtract(14, "days"),
      end: moment(),
    };

    this.reloadProfitByDay = this.reloadProfitByDay.bind(this);
  }

  componentDidMount() {
    this.props.reloadProfitByDay(
      this.state.start,
      this.state.end,
    );
  }

  reloadProfitByDay(start, end) {
    this.setState({
      start: start,
      end: end,
    }, () => {
      if (start && end) {
        this.props.reloadProfitByDay(
          this.state.start,
          this.state.end,
        );
      }
    });
  }

  profitByDayMenu() {
    const summary = this.props.dashboard.profitByDay.summary;
    return (
      <Menu fluid secondary size="mini">
        <Menu.Item fitted="vertically">
          <DateRangePicker
            showClearDates
            enableOutsideDays
            isOutsideRange={() => false}

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

            onDatesChange={({ startDate, endDate }) => this.reloadProfitByDay(startDate, endDate)}
            focusedInput={this.state.focusedInput}
            onFocusChange={focusedInput => this.setState({ focusedInput })}
          />
        </Menu.Item>
        <Menu.Item fitted="vertically">
          <Statistic size="tiny">
            <Statistic.Label>Выручка</Statistic.Label>
            <Statistic.Value>{summary.revenue}</Statistic.Value>
          </Statistic>
        </Menu.Item>
        <Menu.Item fitted="vertically">
          <Statistic size="tiny">
            <Statistic.Label>Себестоимость</Statistic.Label>
            <Statistic.Value>{summary.cost}</Statistic.Value>
          </Statistic>
        </Menu.Item>
        <Menu.Item fitted="vertically">
          <Statistic size="tiny" color="red">
            <Statistic.Label>В долг</Statistic.Label>
            <Statistic.Value>{summary.credit}</Statistic.Value>
          </Statistic>
        </Menu.Item>
        <Menu.Item fitted="vertically">
          <Statistic size="tiny" color="green">
            <Statistic.Label>Прибыль</Statistic.Label>
            <Statistic.Value>{summary.profit}</Statistic.Value>
          </Statistic>
        </Menu.Item>
      </Menu>
    );
  }

  profitByDayBar() {
    const data = this.props.dashboard.profitByDay.items.map(item => ({
      dayf: moment(item.day).format("D MMM"),
      ...item
    }))
    return (
      <ResponsiveBar
        data={data}
        indexBy="dayf"
        keys={[ "cost", "profit" ]}
        padding={0.3}
        colors={{ scheme: "paired" }}
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
        <Table compact celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>День</Table.HeaderCell>
              <Table.HeaderCell>Выручка</Table.HeaderCell>
              <Table.HeaderCell>Стоимость</Table.HeaderCell>
              <Table.HeaderCell>В долг</Table.HeaderCell>
              <Table.HeaderCell>Прибыль</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            { data.map(item => (
              <Table.Row key={item.day}>
                <Table.Cell>{item.day}</Table.Cell>
                <Table.Cell textAlign="right">{item.revenue}</Table.Cell>
                <Table.Cell textAlign="right">{item.cost}</Table.Cell>
                <Table.Cell textAlign="right">{item.credit}</Table.Cell>
                <Table.Cell textAlign="right">{item.profit}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    );
  }

  profitByDayCharts() {
    return (
      <Segment raised>
        {this.profitByDayMenu()}
        <Label color="blue" floating style={{ top: "5%", right: "2%", left: "unset" }}>Продажи по дням за период</Label>
        <Grid>
          <Grid.Row style={{ height: 300, minHeight: 300, maxHeight: 300 }}>
            <Grid.Column width={6} style={{ height: "100%" }}>
              {this.profitByDayTable()}
            </Grid.Column>
            <Grid.Column width={10} style={{ height: "100%" }}>
              {this.profitByDayBar()}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    );
  }

  profitByDay() {
    return (
      this.profitByDayCharts()
    );
  }

  render() {
    return (
      <Grid padded>
        <Grid.Row>
          <Grid.Column width={16}>
            {this.profitByDay()}
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

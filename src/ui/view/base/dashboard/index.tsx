import React from "react"
import { connect } from "react-redux"
import moment from "moment"
import { ru, fr } from "date-fns/locale"
import { ResponsivePie } from "@nivo/pie"
import { ResponsiveBar } from "@nivo/bar"
import { Menu, Container, Grid, Form, Input, Table, Button, Segment, Image, Label, Statistic } from "semantic-ui-react"
import { DateRangePicker, SingleDatePicker, DayPickerRangeController } from "react-dates"

const spaced = (x) => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")

class Dashboard extends React.Component {

  constructor(props) {
    super(props)
    this.reportApi = props.api.report
    this.state = {
      start : moment().subtract(14, "days"),
      end   : moment(),

      profitByDay: {
        items: [],
        summary: {
          revenue: 0,
          cost: 0,
          credit: 0,
          profit: 0,
        },
      },
      productPie: {
        items: [],
      },
      categoryPie: {
        items: [],
      },
      lowCountProducts: {
        items: [],
      },
    }
  }

  componentDidMount() {
    this.reload(this.state.start, this.state.end)
  }

  reload(startM, endM) {
    if (startM && endM) {
      const start = startM.utc().format("YYYY-MM-DD")
      const end   = endM.utc().format("YYYY-MM-DD")
      var state = {}
      Promise.resolve()
        .then(_ => this.reportApi.selectProfitByDay(start, end))
        .then(r => { state.profitByDay = r })

        .then(_ => this.reportApi.selectProductPie(start, end))
        .then(r => { state.productPie = r })

        .then(_ => this.reportApi.selectCategoryPie(start, end))
        .then(r => { state.categoryPie = r })

        .then(_ => this.reportApi.selectLowCountProducts(start, end))
        .then(r => { state.lowCountProducts = r })

        .then(_ => this.setState({
          ...state,
          start :  startM,
          end   : endM,
        }))
    } else {
      this.setState({
        start : startM,
        end   : endM,
      })
    }
  }

  profitByDayMenu() {
    const summary = this.state.profitByDay.summary
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

            onDatesChange={({ startDate, endDate }) => this.reload(startDate, endDate)}
            focusedInput={this.state.focusedInput}
            onFocusChange={focusedInput => this.setState({ focusedInput })}
          />
        </Menu.Item>
        <Menu.Item fitted="vertically">
          <Statistic size="tiny">
            <Statistic.Label>Выручка</Statistic.Label>
            <Statistic.Value>{spaced(summary.revenue)}</Statistic.Value>
          </Statistic>
        </Menu.Item>
        <Menu.Item fitted="vertically">
          <Statistic size="tiny">
            <Statistic.Label>Себестоимость</Statistic.Label>
            <Statistic.Value>{spaced(summary.cost)}</Statistic.Value>
          </Statistic>
        </Menu.Item>
        <Menu.Item fitted="vertically">
          <Statistic size="tiny" color="red">
            <Statistic.Label>В долг</Statistic.Label>
            <Statistic.Value>{spaced(summary.credit)}</Statistic.Value>
          </Statistic>
        </Menu.Item>
        <Menu.Item fitted="vertically">
          <Statistic size="tiny" color="green">
            <Statistic.Label>Прибыль</Statistic.Label>
            <Statistic.Value>{spaced(summary.profit)}</Statistic.Value>
          </Statistic>
        </Menu.Item>
      </Menu>
    )
  }

  profitByDayBar() {
    const data = this.state.profitByDay.items.map(item => ({
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
    )
  }

  profitByDayTable() {
    const data = this.state.profitByDay.items
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
    )
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
    )
  }

  profitByDay() {
    return (
      this.profitByDayCharts()
    )
  }

  productPie() {
    const data = this.state.productPie.items.map(item => ({
      id: item.title,
      label: item.title,
      value: item.quantity,
    }))
    return (
      <Segment raised style={{ height: 300 }}>
        <Label color="blue" floating style={{ top: "5%", right: "2%", left: "unset" }}>Товарный пирог</Label>
        <ResponsivePie
            data={data}
            margin={{ top: 20, right: 50, bottom: 20, left: 20 }}
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
      </Segment>
    )
  }

  categoryPie() {
    const data = this.state.categoryPie.items.map(item => ({
      id: item.title,
      label: item.title,
      value: item.productCount,
    }))
    return (
      <Segment raised style={{ height: 300 }}>
        <Label color="blue" floating style={{ top: "5%", right: "2%", left: "unset" }}>Ассортимент</Label>
        <ResponsivePie
            data={data}
            margin={{ top: 20, right: 50, bottom: 20, left: 20 }}
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
      </Segment>
    )
  }

  lowCountProducts() {
    const data = this.state.lowCountProducts.items
    return (
      <Segment raised style={{ height: 300, overflowY: "auto" }}>
        <Label color="blue" floating style={{ top: "5%", left: "5%", right: "unset" }}>Мало осталось</Label>
        <Table compact celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Кат</Table.HeaderCell>
              <Table.HeaderCell>Товар</Table.HeaderCell>
              <Table.HeaderCell>Продано</Table.HeaderCell>
              <Table.HeaderCell>Клиентов</Table.HeaderCell>
              <Table.HeaderCell>Осталось</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            { data.map(item => (
              <Table.Row key={item.productId}>
                <Table.Cell>{item.categoryTitle}</Table.Cell>
                <Table.Cell>{item.title}</Table.Cell>
                <Table.Cell textAlign="right">{item.outQuantity}</Table.Cell>
                <Table.Cell textAlign="right">{item.clientQuantity}</Table.Cell>
                <Table.Cell textAlign="right">{item.remainingQuantity}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Segment>
    )
  }

  render() {
    return (
      <Grid padded>
        <Grid.Row>
          <Grid.Column width={16}>
            {this.profitByDay()}
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={4}>
            {this.productPie()}
          </Grid.Column>
          <Grid.Column width={4}>
            {this.categoryPie()}
          </Grid.Column>
          <Grid.Column width={8}>
            {this.lowCountProducts()}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }

}

export default Dashboard

import React from "react";
import { connect } from "react-redux";
import moment from "moment";
import { ResponsivePie } from '@nivo/pie'
import { Container, Grid, Form, Input, Table, Button, Segment, Image, Label, TextArea } from "semantic-ui-react"
import { AppActions } from "../../serv/app"
import { PrinterActions } from "../../serv/printer"

class Printer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      code: "BEEP\n",
      vid: 0,
      pid: 0,
    };
    this.print = this.print.bind(this);
    this.onCodeChanged = this.onCodeChanged.bind(this);
    this.selectPrinter = this.selectPrinter.bind(this);
  }

  componentDidMount() {
    this.props.rescanPrinters();
  }

  print() {
    this.props.print(this.state.vid, this.state.pid, this.state.code);
  }

  onCodeChanged(event) {
    this.setState({
      code: event.target.value
    });
  }

  selectPrinter(vid, pid) {
    this.setState({
      vid: vid,
      pid: pid,
    });
  }

  table() {
    const errorMsg = this.props.printer.errorMsg.toString();
    const printerList = this.props.printer.list;
    const inProgress = this.props.printer.rescanInProgress;
    return (
      <Table compact celled selectable>
        <Table.Header>
          { inProgress && 
            <Table.Row>
              <Table.HeaderCell colSpan={2}>Сканирование...</Table.HeaderCell>
            </Table.Row>
          }
          { (errorMsg.length > 0) && 
            <Table.Row>
              <Table.HeaderCell colSpan={2}>Ошибка: {errorMsg}</Table.HeaderCell>
            </Table.Row>
          }
          <Table.Row>
            <Table.HeaderCell>Производитель</Table.HeaderCell>
            <Table.HeaderCell>Продукт</Table.HeaderCell>
            <Table.HeaderCell>ID</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          { printerList.map(printer => (
            <Table.Row key={printer.id} onClick={() => this.selectPrinter(printer.idVendor, printer.idProduct)}>
              <Table.Cell>{printer.iManufacturer}</Table.Cell>
              <Table.Cell>{printer.iProduct}</Table.Cell>
              <Table.Cell>{printer.id}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    );
  }

  coder() {
    return (
      <TextArea rows={16} onChange={this.onCodeChanged} value={this.state.code} />
    );
  }

  render() {
    return (
      <Grid>
        <Grid.Row>{this.table()}</Grid.Row>
        <Grid.Row>
          <Button onClick={() => this.print()}>Запуск</Button>
        </Grid.Row>
        <Grid.Row>{this.coder()}</Grid.Row>
      </Grid>
    );
  }

}

const stateMap = (state) => {
  return {
    printer: state.printer,
  };
}

export default connect(stateMap, { ...PrinterActions })(Printer);

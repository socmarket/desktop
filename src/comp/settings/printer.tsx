import React from "react";
import { connect } from "react-redux";
import moment from "moment";
import { ResponsivePie } from '@nivo/pie'
import { Container, Grid, Form, Input, Table, Button, Segment, Image, Label, TextArea } from "semantic-ui-react"
import { AppActions } from "../../serv/app"
import { PrinterActions } from "../../serv/printer"
import { LabellerActions } from "../../serv/labeller"

class Printer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      code: "BEEP\n",
    };
    this.print = this.print.bind(this);
    this.onCodeChanged = this.onCodeChanged.bind(this);
    this.selectPrinter = this.selectPrinter.bind(this);
    this.onBarcodePrefixChange = this.onBarcodePrefixChange.bind(this);
  }

  componentDidMount() {
    this.props.rescanPrinters();
  }

  print() {
    this.props.debugBarcodePrinter(this.state.code);
  }

  onCodeChanged(event) {
    this.setState({
      code: event.target.value
    });
  }

  selectPrinter(vid, pid) {
    this.props.selectPrinter(vid, pid);
  }

  onBarcodePrefixChange(ev) {
    this.props.setBarcodePrefix(ev.target.value);
  }

  labelSizes() {
    return (
      <Table compact celled selectable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Размер</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row
            active={this.props.labeller.labelSize==="30x20"}
            onClick={() => this.props.setLabelSize("30x20")}
          >
            <Table.Cell>30mm x 20mm</Table.Cell>
          </Table.Row>
          <Table.Row
            active={this.props.labeller.labelSize==="60x30"}
            onClick={() => this.props.setLabelSize("60x30")}
          >
            <Table.Cell>60mm x 30mm</Table.Cell>
          </Table.Row>
          <Table.Row
            active={this.props.labeller.labelSize==="60x40"}
            onClick={() => this.props.setLabelSize("60x40")}
          >
            <Table.Cell>60mm x 40mm</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    );
  }

  printers() {
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
            <Table.HeaderCell>Принтер</Table.HeaderCell>
            <Table.HeaderCell>Модель</Table.HeaderCell>
            <Table.HeaderCell>ID</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          { printerList.map(printer => (
            <Table.Row
              key={printer.id}
              active={
                this.props.labeller.barcodePrinterVid===printer.idVendor &&
                this.props.labeller.barcodePrinterPid===printer.idProduct
              }
              onClick={() => this.props.setBarcodePrinter(printer.idVendor, printer.idProduct)}
            >
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
      <Form>
        <TextArea rows={16} onChange={this.onCodeChanged} value={this.state.code} style={{minHeight: 400}}/>
      </Form>
    );
  }

  barcodePrefix() {
    return (
      <Form>
        <Form.Input
          label="Префикс штрих кода"
          value={this.props.labeller.barcodePrefix}
          onChange={this.onBarcodePrefixChange}
        />
      </Form>
    );
  }

  render() {
    return (
      <Grid>
        <Grid.Row>
          <Grid.Column width={10}>
            {this.barcodePrefix()}
            {this.printers()}
          </Grid.Column>
          <Grid.Column width={6}>
            {this.labelSizes()}
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={16}>
            <Button onClick={() => this.print()} fluid>Запуск</Button>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            {this.coder()}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }

}

const stateMap = (state) => {
  return {
    printer: state.printer,
    labeller: state.labeller,
  };
}

export default connect(stateMap, { ...PrinterActions, ...LabellerActions })(Printer);

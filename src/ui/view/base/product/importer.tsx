import UnitPicker     from "View/base/unit/picker"
import CategoryPicker from "View/base/category/picker"
import CurrencyPicker from "View/base/currency/picker"
import {
  asDate
}                     from "Util"

import React, { Fragment } from "react"
import { connect } from "react-redux"
import {
  Header, Grid, Table, Form, Input, Select,
  TextArea, Button, Segment, Image,
  Label, Container, Menu, Message, Divider,
  Dropdown, Dimmer, Loader, Icon
} from "semantic-ui-react"
import { withTranslation } from 'react-i18next';

const extensions = "xls|xlsx|xlsm|xlsb|xml|xlw|xlc|csv|txt|dif|sylk|slk|prn|ods|fods|uos|dbf|wks|123|wq1|qpw|htm|html".split("|")

class ProductImporter extends React.Component {

  constructor(props) {
    super(props)

    this.onChooseFile     = this.onChooseFile.bind(this)
    this.onBrandChange    = this.onBrandChange.bind(this)
    this.onUnitPick       = this.onUnitPick.bind(this)
    this.onCategoryPick   = this.onCategoryPick.bind(this)
    this.onCurrencyPick   = this.onCurrencyPick.bind(this)
    this.onImportProducts = this.onImportProducts.bind(this)
    this.onSwitchTab      = this.onSwitchTab.bind(this)

    this.counterRef = React.createRef()

    this.fileApi = props.api.file
    this.productApi = props.api.product

    this.state = {
      loading: false,
      success: false,
      failure: false,
      file   : { name: "", path: "", dir: "" },
      activeSheetName: "",
      wb: {
        SheetNames: [],
        Sheets: {
        },
      },
      target: [],
      excludedRows: [],
      importedRows: 0,
      brand: "",
      categoryId: 1,
      categoryTitle: "",
      unitId: 1,
      unitTitle: "",
      currencyId: 1,
      currencyTitle: "",
      history: [],
      activeTab: "history",
    }
    this.t = this.props.t
  }

  componentDidMount() {
    this.reloadHistory()
  }

  reloadHistory() {
    return this.productApi.selectImportHistory()
      .then(history => this.setState({
        history: history,
      }))
  }

  onSwitchTab() {
    if (this.state.activeTab === "sheet") {
      this.reloadHistory().then(_ => {
        this.setState({
          activeTab: "history"
        })
      })
    } else {
      this.setState({ activeTab: "sheet" })
    }
  }

  onBrandChange(ev) {
    this.setState({
      brand: ev.target.value,
    })
  }

  onUnitPick(unit) {
    this.setState({
      unitId: unit.id,
      unitTitle: unit.title,
    })
  }

  onCategoryPick(category) {
    this.setState({
      categoryId: category.id,
      categoryTitle: category.title,
    })
  }

  onCurrencyPick(currency) {
    this.setState({
      currencyId: currency.id,
      currencyTitle: currency.title,
    })
  }

  onImportProducts() {
    const sheet = this.state.wb.Sheets[this.state.activeSheetName]
    const rect = this.rect(sheet)
    this.setState({
      loading: true,
    }, () => {
      this.productApi.importProducts({
        barcodePrefix: this.props.opt.barcodePrefix,
        sheet: sheet,
        rect: rect,
        file: this.state.file,
        target: this.state.target,
        excludedRows: this.state.excludedRows,
        brand: this.state.brand,
        unitId: this.state.unitId,
        categoryId: this.state.categoryId,
        currencyId: this.state.currencyId,
        targetCurrencyId: this.props.opt.defaultCurrencyId,
        onRowDone: (r, row) => {
          const v = this.counterRef.current.innerText
          this.counterRef.current.innerText = Number(v) + 1
        },
      })
      .then(_ => {
        this.setState({
          loading: false,
          success: true,
          failure: false,
        })
      })
      .catch(err => {
        console.log(err)
        this.setState({
          loading: false,
          success: false,
          failure: true,
        })
      })
    })
  }

  onChooseFile() {
    this.setState({ loading: true })
    this.fileApi
      .chooseFile(this.state.file.dir, extensions)
      .then(res => {
        if (res) {
          this.openFile(res)
        } else {
          this.setState({
            loading: false,
          })
        }
      })
  }

  openFile(file) {
    this.setState({ loading: true })
    this.productApi.openFile(file.path)
      .then(wb => {
        if (wb.SheetNames.length > 0) {
          const sheet = wb.Sheets[wb.SheetNames[0]]
          const rect = this.rect(sheet)
          this.setState({
            wb: wb,
            loading: false,
            file: file,
            activeSheetName: wb.SheetNames[0],
            target: [],
            excludedRows: [],
            rect: rect,
            sheet: sheet,
            importedRows: 0,
            activeTab: "sheet",
          }, () => {
            this.counterRef.current.innerText = "0"
          })
        } else {
          this.setState({
            loading: false,
            success: false,
            file: file,
            target: [],
            excludedRows: [],
            importedRows: 0,
          }, () => {
            this.counterRef.current.innerText = "0"
          })
        }
      })
  }

  canStartImport() {
    return this.state.activeSheetName !== "" &&
      this.state.unitId > 0 &&
      this.state.target.filter(t => t.key === "barcode" || t.key === "oemNo").length > 0 &&
      this.state.target.filter(t => t.key === "price" || t.key === "title").length > 0
  }

  openSheet(name) {
    const sheet = this.state.wb.Sheets[name]
    const rect = this.rect(sheet)
    this.setState({
      rect: rect,
      sheet: sheet,
      activeSheetName: name,
      importedRows: 0,
    })
  }

  rect(sheet) {
    let minCol = -1, maxCol = -1
    let minRow = -1, maxRow = -1
    const cols = [], rows = []
    Object
      .keys(sheet)
      .filter(k => /[A-Z]+\d+/.test(k))
      .forEach(k => {
        const [ _, c, rr ] = k.split(/(\D+)/g)
        const r = parseInt(rr)
        if (minCol === -1 || c < minCol) {
          minCol = c
          if (maxCol !== -1) cols.unshift(c)
        }
        if (minRow === -1 || r < minRow) {
          minRow = r
          if (maxRow !== -1) rows.unshift(r)
        }
        if (maxCol === -1 || c > maxCol) {
          maxCol = c
          if (minCol !== -1) cols.push(c)
        }
        if (maxRow === -1 || r > maxRow) {
          maxRow = r
          if (minRow !== -1) rows.push(r)
        }
      })
    const offset = "A".charCodeAt(0)
    const maxC = maxCol.charCodeAt(0)
    return {
      minCol: "A",
      maxCol: maxCol,
      minRow: minRow,
      maxRow: maxRow,
      cols: [...Array(maxC - offset).keys()]
        .map(x => x + offset)
        .map(x => String.fromCharCode(x))
      ,
      rows: rows,
    }
  }

  setTarget(col, key, title) {
    const newTarget = this.state.target.filter(t => t.key !== key && t.col !== col)
    const off = this.state.target.filter(t => t.key === key && t.col === col).length > 0
    if (!off) {
      newTarget.push({ key: key, col: col, title: title })
    }
    this.setState({
      target: newTarget
    })
  }

  targetTag(col, key, title) {
    return (
      <Dropdown.Item
        active={this.state.target.filter(t => t.key === key && t.col === col).length > 0}
        onClick={() => this.setTarget(col, key, title)}
      >
        {title}
      </Dropdown.Item>
    )
  }

  excludeRow(r) {
    if (this.state.excludedRows.includes(r)) {
      this.setState({
        excludedRows: this.state.excludedRows.filter(rr => rr !== r)
      })
    } else {
      this.setState({
        excludedRows: [r].concat(this.state.excludedRows)
      })
    }
  }

  getColTarget(col) {
    const t = this.state.target.filter(t => t.col === col)
    return (t.length > 0) ? t[0].title : ""
  }

  data() {
    const name = this.state.activeSheetName
    if (name === "" || !this.state.wb.Sheets.hasOwnProperty(name)) {
      return (<Fragment></Fragment>)
    } else {
      const sheet = this.state.wb.Sheets[name]
      const rect = this.rect(sheet)
      return (
        <Table compact celled striped style={{ width: "100%" }}>
          <Table.Header>
            <Table.Row>
              {rect.cols.map(c => (
                <Table.HeaderCell key={c} textAlign="right">
                  <Dropdown icon="angle double down" text={this.getColTarget(c)}>
                    <Dropdown.Menu>
                      {this.targetTag(c, "title",   this.t("title"))}
                      {this.targetTag(c, "model",   this.t("model"))}
                      {this.targetTag(c, "engine",  this.t("engine"))}
                      {this.targetTag(c, "brand",   this.t("brand"))}
                      {this.targetTag(c, "oemNo",   this.t("oem"))}
                      {this.targetTag(c, "barcode", this.t("barcode"))}
                      {this.targetTag(c, "quantity",  this.t("quantity"))}
                      {this.targetTag(c, "price",   this.t("price"))}
                      {this.targetTag(c, "serial",  this.t("serial"))}
                      {this.targetTag(c, "coord",   this.t("coord"))}
                    </Dropdown.Menu>
                  </Dropdown>
                </Table.HeaderCell>
              ))}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {rect.rows.map((r, idx) => (
              <Table.Row key={r} onClick={() => this.excludeRow(r)} error={this.state.excludedRows.includes(r)}>
                {rect.cols.map(c => (
                  <Table.Cell key={c}>
                    {sheet[c + r] ? sheet[c + r].v : ""}
                  </Table.Cell>
                ))}
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )
    }
  }

  history() {
    return (
      <Grid columns={2}>
        <Grid.Column width={16}>
          <Table compact celled striped style={{ width: "100%" }}>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell textAlign="center" colSpan={9}>История загрузок</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell textAlign="right">{this.t("number")}</Table.HeaderCell>
                <Table.HeaderCell textAlign="center">{this.t("file")}</Table.HeaderCell>
                <Table.HeaderCell textAlign="center">{this.t("date")}</Table.HeaderCell>
                <Table.HeaderCell textAlign="center">{this.t("fields")}</Table.HeaderCell>
                <Table.HeaderCell textAlign="center">{this.t("rows")}</Table.HeaderCell>
                <Table.HeaderCell textAlign="center">{this.t("successfully")}</Table.HeaderCell>
                <Table.HeaderCell textAlign="center">{this.t("unit")}</Table.HeaderCell>
                <Table.HeaderCell textAlign="center">{this.t("kt")}</Table.HeaderCell>
                <Table.HeaderCell textAlign="center">{this.t("currency")}</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {this.state.history.map((item, idx) => (
                <Table.Row key={idx}>
                  <Table.Cell>{item.id}</Table.Cell>
                  <Table.Cell>
                    <a href="#" onClick={() => this.openFile({ dir: item.fileDir, name: item.fileName, path: item.filePath})}>
                      {item.fileName}
                    </a>
                  </Table.Cell>
                  <Table.Cell>{asDate(item.importedAt)}</Table.Cell>
                  <Table.Cell>{item.fields            }</Table.Cell>
                  <Table.Cell textAlign="right">{item.rowCount          }</Table.Cell>
                  <Table.Cell textAlign="right">{item.importedCount     }</Table.Cell>
                  <Table.Cell textAlign="right">{item.unitNotation      }</Table.Cell>
                  <Table.Cell textAlign="right">{item.categoryTitle     }</Table.Cell>
                  <Table.Cell textAlign="right">{item.currencyNotation  }</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Grid.Column>
      </Grid>
    )
  }

  menu() {
    const wb = this.state.wb
    return (
      <Menu>
        { this.state.file.name.length > 0 &&
          <Menu.Item onClick={this.onSwitchTab}>
            {this.state.file.name}
          </Menu.Item>
        }
        { this.state.activeSheetName !== "" && (
          <Fragment>
            <Menu.Item>
              Всего: {this.state.rect.rows.length - this.state.excludedRows.length}
            </Menu.Item>
            <Menu.Item>
              Готово: <p ref={this.counterRef}></p>
            </Menu.Item>
          </Fragment>
        )}
        { this.state.loading && <Menu.Item><Loader active={this.state.loading} size="small" /></Menu.Item> }
        { !this.state.loading && this.state.success && <Menu.Item><Icon name="check" color="green" /></Menu.Item> }
        { !this.state.loading && this.state.failure && <Menu.Item><Icon name="x"     color="red"   /></Menu.Item> }
        <Menu.Menu position="right">
          <Menu.Item>
            <Input style={{width: 100}} onChange={this.onBrandChange} placeholder="Бренд..." />
          </Menu.Item>
          <Menu.Item>Е</Menu.Item>
          <div style={{ width: 40, paddingTop: 8, marginRight: 10 }}>
            <UnitPicker
              api={this.props.api}
              value={this.state.unitId}
              onPick={this.onUnitPick}
            />
          </div>
          <Menu.Item>К</Menu.Item>
          <div style={{ width: 80, paddingTop: 8, marginRight: 10 }}>
            <CategoryPicker
              api={this.props.api}
              value={this.state.categoryId}
              onPick={this.onCategoryPick}
            />
          </div>
          <Menu.Item>$</Menu.Item>
          <div style={{ width: 80, paddingTop: 8, marginRight: 10 }}>
            <CurrencyPicker
              api={this.props.api}
              size="small"
              value={this.state.currencyId}
              onPick={this.onCurrencyPick}
            />
          </div>
          { this.state.activeSheetName !== "" && (
            <Fragment>
              <Dropdown item text={"Стр: " + this.state.activeSheetName}>
                <Dropdown.Menu>
                  {wb.SheetNames.map((name, idx) =>
                    (
                      <Dropdown.Item key={idx} onClick={() => this.openSheet(name)}>
                        {`Стр: ${name}`}
                      </Dropdown.Item>
                    )
                  )}
                </Dropdown.Menu>
              </Dropdown>
            </Fragment>
          )}
          { this.canStartImport() && <Menu.Item><Button icon="cloud download" onClick={this.onImportProducts} /></Menu.Item> }
          <Menu.Item>
            <Button icon="folder open" onClick={this.onChooseFile} />
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    )
  }

  render() {
    return (
      <Dimmer.Dimmable dimmed={this.state.loading}>
        <Grid padded columns={1}>
          <Grid.Column style={{ overflowX: "auto" }}>
            {this.menu()}
            {this.state.activeTab === "sheet" && this.data()}
            {this.state.activeTab === "history" && this.history()}
          </Grid.Column>
        </Grid>
      </Dimmer.Dimmable>
    )
  }
}

export default (withTranslation("product_importer.form")(ProductImporter))

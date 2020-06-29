import React, { Fragment } from "react"
import { connect } from "react-redux"
import moment from "moment"
import {
  Header, Grid, Table, Form, Input, Select,
  TextArea, Button, Segment, Image,
  Label, Container, Menu, Message, Divider,
  Dropdown, Dimmer, Loader, Icon
} from "semantic-ui-react"

import UnitPicker     from "View/base/unit/picker"
import CategoryPicker from "View/base/category/picker"

class ProductImporter extends React.Component {

  constructor(props) {
    super(props)

    this.onOpenFile       = this.onOpenFile.bind(this)
    this.onUnitPick       = this.onUnitPick.bind(this)
    this.onCategoryPick   = this.onCategoryPick.bind(this)
    this.onImportProducts = this.onImportProducts.bind(this)

    this.counterRef = React.createRef()

    this.importerApi = props.api.autoParts.product

    this.state = {
      loading: false,
      success: false,
      failure: false,
      fileName: "",
      activeSheetName: "",
      wb: {
        SheetNames: [],
        Sheets: {
        },
      },
      target: [],
      excludedRows: [],
      importedRows: 0,
      categoryId: -1,
      categoryTitle: "",
      unitId: -1,
      unitTitle: "",
    }
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

  onImportProducts() {
    const sheet = this.state.wb.Sheets[this.state.activeSheetName]
    const rect = this.rect(sheet)
    this.setState({
      loading: true,
    }, () => {
      this.importerApi.importProducts({
        barcodePrefix: this.props.opt.barcodePrefix,
        sheet: sheet,
        rect: rect,
        target: this.state.target,
        excludedRows: this.state.excludedRows,
        unitId: this.state.unitId,
        categoryId: this.state.categoryId,
        onRowDone: (r, row) => {
          this.counterRef.current.innerText = r
        },
      })
      .then(_ => {
        this.setState({
          loading: false,
          success: true,
          failure: false,
        })
      })
      .catch(_ => {
        this.setState({
          loading: false,
          success: false,
          failure: true,
        })
      })
    })
  }

  onOpenFile() {
    this.setState({ loading: true })
    this.importerApi
      .chooseFile()
      .then(res => {
        if (res) {
          const { wb, fileName, filePath } = res
          if (wb.SheetNames.length > 0) {
            const sheet = wb.Sheets[wb.SheetNames[0]]
            const rect = this.rect(sheet)
            this.setState({
              wb: wb,
              loading: false,
              fileName: fileName,
              activeSheetName: wb.SheetNames[0],
              target: [],
              excludedRows: [],
              rect: rect,
              sheet: sheet,
              importedRows: 0,
            })
          } else {
            this.setState({
              loading: false,
              success: false,
              fileName: fileName,
              target: [],
              excludedRows: [],
              importedRows: 0,
            })
          }
        } else {
          this.setState({
            loading: false,
          })
        }
      })
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
    return {
      minCol: minCol,
      maxCol: maxCol,
      minRow: minRow,
      maxRow: maxRow,
      cols: cols,
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
        <Table compact celled striped>
          <Table.Header>
            <Table.Row>
              {rect.cols.map(c => (
                <Table.HeaderCell key={c} textAlign="right">
                  <Dropdown icon="angle double down" text={this.getColTarget(c)}>
                    <Dropdown.Menu>
                      {this.targetTag(c, "title", "Наименование")}
                      {this.targetTag(c, "model", "Модель")}
                      {this.targetTag(c, "engine", "Мотор")}
                      {this.targetTag(c, "brand", "Бренд")}
                      {this.targetTag(c, "oemNo", "OEM")}
                      {this.targetTag(c, "serial", "Серийник")}
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

  menu() {
    const wb = this.state.wb
    return (
      <Menu>
        { this.state.fileName.length > 0 &&
          <Menu.Item>
            {this.state.fileName}
          </Menu.Item>
        }
        <Menu.Item>Ед.изм.</Menu.Item>
        <div style={{ width: 150, paddingTop: 8, marginLeft: 10 }}>
          <UnitPicker
            api={this.props.api}
            value={this.state.unitId}
            onPick={this.onUnitPick}
          />
        </div>
        <Menu.Item>Категория</Menu.Item>
        <div style={{ width: 150, paddingTop: 8, marginLeft: 10 }}>
          <CategoryPicker
            api={this.props.api}
            value={this.state.categoryId}
            onPick={this.onCategoryPick}
          />
        </div>
        <Menu.Menu position="right">
          { this.state.loading && <Menu.Item><Loader active={this.state.loading} size="small" /></Menu.Item> }
          { !this.state.loading && this.state.success && <Menu.Item><Icon name="check" color="green" /></Menu.Item> }
          { !this.state.loading && this.state.failure && <Menu.Item><Icon name="x"     color="red"   /></Menu.Item> }
          { this.state.activeSheetName !== "" && (
            <Fragment>
              <Menu.Item>
                Всего: {this.state.rect.rows.length - this.state.excludedRows.length}
              </Menu.Item>
              <Menu.Item>
                Готово: <p ref={this.counterRef}></p>
              </Menu.Item>
              { this.state.unitId > 0 && this.state.target.filter(t => t.key === "title").length > 0 &&
                <Menu.Item>
                  <Button onClick={this.onImportProducts}>
                    Импорт
                  </Button>
                </Menu.Item>
              }
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
          <Menu.Item>
            <Button onClick={this.onOpenFile}>
              Открыть файл
            </Button>
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    )
  }

  render() {
    return (
      <Dimmer.Dimmable dimmed={this.state.loading}>
        <Grid padded columns={1}>
          <Grid.Column>
            {this.menu()}
            {this.data()}
          </Grid.Column>
        </Grid>
      </Dimmer.Dimmable>
    )
  }
}

export default ProductImporter

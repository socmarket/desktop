import React from "react";
import { connect } from "react-redux";
import { Modal, Menu, Grid, Container, Divider, Form, Table, Card,
  Input, Select, TextArea, Button, Segment, Image, Label } from "semantic-ui-react"
import { AppActions } from "../../serv/app"
import { ProductActions } from "../../serv/product"
import { LabellerActions } from "../../serv/labeller"
import { CategoryPicker } from "../../aui/comp/category";

class ProductDialog extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      ...(this.props.productList.currentProduct),
      useGenBarcode: false,
      labelCount: 1,
      categoryTitle: "",
      formHeight: 0,
      searchId: -1,
      filterPattern: "",
    };
    this.handleBarcodeActivate = this.handleBarcodeActivate.bind(this);
    this.handleBarcodeChange = this.handleBarcodeChange.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleNotesChange = this.handleNotesChange.bind(this);
    this.handleUnitChange = this.handleUnitChange.bind(this);
    this.handleCategoryChange = this.handleCategoryChange.bind(this);
    this.handleCreateProduct = this.handleCreateProduct.bind(this);
    this.handleUpdateProduct = this.handleUpdateProduct.bind(this);
    this.handleResetProduct = this.handleResetProduct.bind(this);
    this.handleLabelCountChange = this.handleLabelCountChange.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.genBarcode = this.genBarcode.bind(this);
    this.printLabel = this.printLabel.bind(this);
    this.setFilter = this.setFilter.bind(this);
    this.pickProduct = this.pickProduct.bind(this);
    this.createBarcodeInput = this.createBarcodeInput.bind(this);

    this.barcodeInputRef = React.createRef();
    this.categorySelectRef = React.createRef();
    this.productFormRef = React.createRef(); 
  }

  componentDidUpdate() {
    const id = this.props.productList.currentProduct.id;
    if (id > 0 && id !== this.state.id) {
      this.setState(this.props.productList.currentProduct);
    } else if (id < 0 && id !== this.state.id) {
      this.setState({ id: -1 });
    }
    if (this.productFormRef.current && this.state.formHeight !== this.productFormRef.current.clientHeight + 15) {
      this.setState({
        formHeight: this.productFormRef.current.clientHeight + 15,
      });
    }
  }

  updateForm() {
    this.props.changeCurrentProduct(this.state);
  }

  setFilter(filterPattern) {
    if (this.state.searchId > 0) {
      clearTimeout(this.state.searchId);
    }
    this.setState({
      filterPattern: filterPattern,
      searchId: setTimeout(
        () => {
          clearTimeout(this.state.searchId);
          console.log("yay");
          this.props.setProductListFilter(this.state.filterPattern);
        },
        200
      )
    });
  }


  printLabel() {
    this.props.printLabel(this.state.barcode, this.state.title, this.state.categoryTitle, this.state.labelCount);
  }

  genBarcode() {
    this.props.genBarcode();
    const self = this;
    setTimeout(() => {
      this.setState({
        barcode: this.props.newBarcode,
        useGenBarcode: true
      }, () => {
        self.updateForm()
      });
    }, 200);
  }

  handleResetProduct() {
    this.setState({
      barcode: "",
      title: "",
      notes: "",
      unitId: 1,
      categoryId: -1,
      useGenBarcode: false
    }, () => {
      this.updateForm();
      this.barcodeInputRef.current.focus();
    });
  }

  handleBarcodeActivate(event) {
    if (event.key) {
      if (event.key === "Enter") {
        this.updateForm();
      }
    } else {
      this.updateForm();
    }
  }

  handleBarcodeChange(event) {
    this.setState({ barcode: event.target.value, useGenBarcode: false });
  }

  handleTitleChange(event) {
    this.setState({ title: event.target.value },
      () => {
        const filterPattern = [ this.state.categoryTitle, this.state.title ].join(" ").trim();
        this.setFilter(filterPattern);
      }
    );
  }

  handleNotesChange(event) {
    this.setState({ notes: event.target.value });
  }

  handleUnitChange(event, data) {
    this.setState({ unitId: data.value });
  }

  handleCategoryChange(category) {
    this.setState({
      categoryId: category.id,
      categoryTitle: category.title,
    }, () => {
      const filterPattern = [ this.state.categoryTitle, this.state.title ].join(" ").trim();
      this.setFilter(filterPattern);
    });
  }

  handleLabelCountChange(event, data) {
    this.setState({ labelCount: data.value });
  }

  handleCreateProduct() {
    const self = this;
    this.props.createProduct(this.state);
    this.setState({
      id: -1,
      barcode: "",
      title: "",
      notes: "",
      unitId: 1,
      categoryId: -1,
      useGenBarcode: false,
    }, () => {
      this.barcodeInputRef.current.focus();
    });
  }

  handleUpdateProduct() {
    this.props.updateProduct(this.state);
  }

  createBarcodeInput(props) {
    return (
      <div className="ui input">
        <input ref={this.barcodeInputRef} {...props} />
      </div>
    );
  }

  pickProduct(barcode) {
    this.setState({
      barcode: barcode
    }, () => {
      this.handleBarcodeActivate({ key: "Enter" });
    });
  }

  handleFilterChange(event) {
    const filterPattern = event.target.value;
    this.setFilter(filterPattern);
  }

  body() {
    const barcode = this.state.useGenBarcode ? this.props.newBarcode : this.state.barcode;
    const isNewProduct: boolean = this.state.id <= 0;
    const isEmpty: boolean = barcode === "" ||  this.state.title === "";
    return (
      <Grid>
        <Grid.Row>
          <Grid.Column width={16}>
            <Form>
              <Form.Input
                icon="search"
                value={this.state.filterPattern}
                onChange={this.handleFilterChange}
              />
              <Form.Group>
                <Form.Input width={10}
                  label="Штрихкод"
                  error={isNewProduct}
                  onKeyPress={this.handleBarcodeActivate}
                  onBlur={this.handleBarcodeActivate}
                  onChange={this.handleBarcodeChange}
                  control={this.createBarcodeInput}
                  value={barcode}
                  autoFocus
                />
                <Form.Select width={6} label="Ед. изм." fluid
                  options={this.props.unitOptions}
                  value={this.state.unitId}
                  onChange={this.handleUnitChange}
                />
              </Form.Group>
              <Form.Field>
                <label>Категория товара</label>
                <CategoryPicker
                  value={this.state.categoryId}
                  onPick={this.handleCategoryChange}
                />
              </Form.Field>
              <Form.Group>
                <Form.Input
                  width={16}
                  label="Наименование"
                  value={this.state.title}
                  onChange={this.handleTitleChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Input width={16} label="Описание"
                  value={this.state.notes}
                  onChange={this.handleNotesChange}
                />
              </Form.Group>
              <Divider />
              <Form.Group>
                <Form.Input
                  value={this.state.labelCount}
                  onChange={this.handleLabelCountChange}
                  style={{ width: "50px" }}
                />
                <Button disabled>шт.</Button>
                <Button
                  fluid
                  onClick={this.printLabel}
                  disabled={this.state.barcode.length === 0 || this.state.title.length === 0}
                >
                  Печатать наклейки
                </Button>
                {this.props.errorMsg.length > 0 && <Message danger>{this.props.errorMsg}</Message> }
              </Form.Group>
            </Form>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={16}>
            { !isEmpty && (
              <Button.Group fluid disabled={isEmpty} >
                <Button
                  floated="right"
                  {...(isNewProduct && {content: "Создать", onClick: this.handleCreateProduct})}
                  {...(!isNewProduct && {content: "Изменить", onClick: this.handleUpdateProduct})}
                />
                { !isNewProduct && (
                  <Button
                    color="orange"
                    floated="right"
                    content="Сбросить"
                    onClick={this.handleResetProduct}
                  />
                )}
              </Button.Group>
            )}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }

  table(height) {
    return (
      <Container style={{ minHeight: height, maxHeight: height, overflowY: "auto" }}>
        <Table compact celled selectable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Кат</Table.HeaderCell>
              <Table.HeaderCell>Название</Table.HeaderCell>
              <Table.HeaderCell>Штрихкод</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            { this.props.productList.items.map(product => (
              <Table.Row key={product.id}>
                <Table.Cell>{product.categoryTitle}</Table.Cell>
                <Table.Cell>{product.title}</Table.Cell>
                <Table.Cell>
                  <a href="#"
                    onClick={() => this.pickProduct(product.barcode)}
                  >
                    {product.barcode}
                  </a>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Container>
    );
  }

  render() {
    const height = this.state.formHeight;
    return (
      <Modal open size="large" centered={false} closeIcon onClose={() => this.props.closeProducts()}>
        <Modal.Content>
          <Grid>
            <Grid.Column width={6}>
              <div ref={this.productFormRef} className="ui segment">
                {this.body()}
              </div>
            </Grid.Column>
            <Grid.Column width={10}>
              {this.table(height)}
            </Grid.Column>
          </Grid>
        </Modal.Content>
      </Modal>
    );
  }
}

const stateMap = (state) => {
  return {
    app: state.app,
    unitOptions: state.registry.unitOptions,
    categoryOptions: state.registry.categoryOptions,
    productList: state.productList,
    newBarcode: state.labeller.newBarcode,
    errorMsg: state.labeller.errorMsg
  };
}

export default connect(stateMap, { ...ProductActions, ...LabellerActions, ...AppActions })(ProductDialog);

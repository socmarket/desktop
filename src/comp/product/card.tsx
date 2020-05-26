import React from "react";
import { connect } from "react-redux";
import { Grid, Form, Card, Input, Select, TextArea, Button, Segment, Image, Label } from "semantic-ui-react"
import { Product, ProductActions } from "../../serv/product"
import { LabellerActions } from "../../serv/labeller"

class ProductCard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      ...(this.props.productList.currentProduct),
      useGenBarcode: false,
      labelCount: 1,
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
    this.genBarcode = this.genBarcode.bind(this);
    this.printLabel = this.printLabel.bind(this);
  }

  componentDidUpdate() {
    const id = this.props.productList.currentProduct.id;
    if (id > 0 && id !== this.state.id) {
      this.setState(this.props.productList.currentProduct);
    } else if (id < 0 && id !== this.state.id) {
      this.setState({ id: -1 });
    }
  }

  private updateForm() {
    this.props.changeCurrentProduct(this.state);
  }

  printLabel() {
    this.props.printLabel(this.state.barcode, this.state.title, this.state.labelCount);
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
    }, this.updateForm);
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
    this.setState({ title: event.target.value });
  }

  handleNotesChange(event) {
    this.setState({ notes: event.target.value });
  }

  handleUnitChange(event, data) {
    this.setState({ unitId: data.value });
  }

  handleCategoryChange(event, data) {
    this.setState({ categoryId: data.value });
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
    });
  }

  handleUpdateProduct() {
    this.props.updateProduct(this.state);
  }

  render() {
    const barcode = this.state.useGenBarcode ? this.props.newBarcode : this.state.barcode;
    const isNewProduct: boolean = this.state.id <= 0;
    const isEmpty: boolean = barcode === "" ||  this.state.title === "";
    return (
      <Grid columns={2}>
        <Grid.Row>
          <Grid.Column width={6}>
            <Card>
              <Card.Content extra>
                <Button fluid basic color="red" onClick={this.genBarcode}>Новый штрихкод</Button>
              </Card.Content>
              <Card.Content header="Печать этикеток" />
              <Card.Content extra>
                <Input
                  label="#"
                  size="mini"
                  value={this.state.labelCount}
                  onChange={this.handleLabelCountChange}
                />
              </Card.Content>
              <Card.Content extra>
                <Button
                  fluid basic
                  color="green"
                  onClick={this.printLabel}
                  disabled={this.state.barcode.length === 0 || this.state.title.length === 0}
                >Печать</Button>
              </Card.Content>
              {this.props.errorMsg.length > 0 &&
                <Card.Content>
                  {this.props.errorMsg}
                </Card.Content>
              }
            </Card>
          </Grid.Column>
          <Grid.Column width={10}>
            <Form>
              <Form.Group>
                <Form.Input width={10}
                  label="Штрихкод"
                  error={isNewProduct}
                  onKeyPress={this.handleBarcodeActivate}
                  onBlur={this.handleBarcodeActivate}
                  onChange={this.handleBarcodeChange}
                  value={barcode}
                  autoFocus
                />
                <Form.Select width={6} label="Ед. изм." fluid
                  options={this.props.unitOptions}
                  value={this.state.unitId}
                  onChange={this.handleUnitChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Select width={16} label="Категория товара" fluid
                  options={this.props.categoryOptions}
                  value={this.state.categoryId}
                  onChange={this.handleCategoryChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Input width={16} label="Наименование"
                  value={this.state.title}
                  onChange={this.handleTitleChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.TextArea width={16} label="Описание"
                  value={this.state.notes}
                  onChange={this.handleNotesChange}
                />
              </Form.Group>
            </Form>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={16}>
            { !isEmpty && (
              <Button.Group fluid>
                <Button
                  floated="right"
                  {...(isNewProduct && {content: "Создать", onClick: this.handleCreateProduct})}
                  {...(!isNewProduct && {content: "Изменить", onClick: this.handleUpdateProduct})}
                />
                { !isNewProduct && (
                  <Button
                    negative
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
}

const stateMap = (state) => {
  return {
    unitOptions: state.registry.unitOptions,
    categoryOptions: state.registry.categoryOptions,
    productList: state.productList,
    newBarcode: state.labeller.newBarcode,
    errorMsg: state.labeller.errorMsg
  };
}

export default connect(stateMap, { ...ProductActions, ...LabellerActions })(ProductCard);

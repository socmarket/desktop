import React from "react";
import { connect } from "react-redux";
import { Product, ProductActions } from "serv/product"
import { Grid, Form, Input, Select, TextArea, Button, Segment, Image } from "semantic-ui-react"

const options = [
  { key: 'kg', text: 'кг', value: 'kg' },
  { key: 'item', text: 'шт.', value: 'item' },
]

class ProductCard extends React.Component {

  constructor(props) {
    super(props);
    this.state = { ...(this.props.productList.currentProduct) };
    this.handleBarcodeChange = this.handleBarcodeChange.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleNotesChange = this.handleNotesChange.bind(this);
  }

  private updateForm() {
    this.props.changeCurrentProduct(this.state)
  }

  handleBarcodeChange(event) {
    this.setState({ barcode: event.target.value }, this.updateForm);
  }

  handleTitleChange(event) {
    this.setState({ title: event.target.value }, this.updateForm);
  }

  handleNotesChange(event) {
    this.setState({ notes: event.target.value }, this.updateForm);
  }

  render() {
    const currentProduct: Product = this.props.productList.currentProduct;
    const isNewProduct: boolean = currentProduct.id <= 0;
    const isEmpty: boolean = currentProduct.barcode === "" ||  currentProduct.title === "";
    return (
      <Grid columns={2}>
        <Grid.Row>
          <Grid.Column width={6}>
            <Image fluid bordered rounded src="https://picsum.photos/200/250" />
          </Grid.Column>
          <Grid.Column width={10}>
            <Form>
              <Form.Group>
                <Form.Input width={10} label="Штрихкод"
                  focus
                  value={currentProduct.barcode}
                  onChange={this.handleBarcodeChange}
                />
                <Form.Select width={6} label="Ед. изм." options={options} fluid />
              </Form.Group>
              <Form.Group>
                <Form.Input width={16} label="Наименование"
                  value={currentProduct.title}
                  onChange={this.handleTitleChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.TextArea width={16} label="Описание"
                  value={currentProduct.notes}
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
                  {...(isNewProduct && {content: "Создать"})}
                  {...(!isNewProduct && {content: "Изменить"})}
                />
              </Button.Group>
            )}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

const stateMap = (state) => {
  return { productList: state.productList };
}

export default connect(stateMap, ProductActions)(ProductCard);

import React from "react";
import { connect } from "react-redux";
import moment from "moment";
import { components } from 'react-select';
import AsyncSelect from 'react-select/async';
import {
  Header, Grid, Table, Form, Input,
  TextArea, Button, Segment, Image,
  Label, Container, Menu, Message, Divider
} from "semantic-ui-react"
import { Product, ProductActions } from "../../serv/product"

const Group = props => {
  return (
    <components.Group {...props} />
  );
};

const Option = props => {
  const { data, getStyles, innerRef, innerProps } = props;
  console.log(data);
  return (
    <components.Option {...props} />
  );
};

class ProductSelector extends React.Component {

  constructor(props) {
    super(props);
    this.loadOptions = this.loadOptions.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onChange(item) {
    this.props.onProductSelected(item.product);
  }

  loadOptions(pattern, cb) {
    this.props.setProductListFilter(pattern, function (rows) {
      const options = rows.map(product => ({
        label: product.categoryTitle + " : " + product.title + " : " + product.barcode,
        value: product.id,
        product: product,
      }));
      cb(options);
    });
  }

  render() {
    return (
      <AsyncSelect
        { ...this.props }
        closeMenuOnSelect={true}
        isClearable={true}
        loadOptions={this.loadOptions}
        onChange={this.onChange}
        ref={this.props.forwardRef}
      />
    );
  }
}

const stateMap = (state) => {
  return {
    productList: state.productList
  };
}

export default connect(stateMap, { ...ProductActions })(ProductSelector);

import React          from "react";
import { components } from "react-select";
import AsyncSelect    from "react-select/async";

export default class ProductPicker extends React.Component {

  constructor(props) {
    super(props);
    this.api = props.api;
    this.onPick = this.onPick.bind(this);
    this.loadOptions = this.loadOptions.bind(this);
    this.state = {
      value: -1,
      label: "",
    };
  }

  updateLabel(value) {
    return this.api.product.pick(value)
      .then(product => {
        if (product) {
          this.setState({
            value: product.id,
            label: this.mkLabelFrom(product),
          });
        } else {
          this.setState({
            value: -1,
            label: "",
          });
        }
      })
    ;
  }

  mkLabelFrom(product) {
    return product.categoryTitle
      + " : " + product.title
      + " : " + product.quantity
      + " | " + product.barcode
    ;
  }

  mkOptsFrom(products) {
    const self = this;
    return products.map(product => ({
      label: self.mkLabelFrom(product),
      value: product.id,
      product: product,
    }));
  }

  componentDidMount() {
    this.updateLabel(this.props.value);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.value !== this.props.value) {
      this.updateLabel(this.props.value);
    }
  }

  loadOptions(pattern, cb) {
    return this.api.product.find(pattern)
      .then(products => {
        cb(this.mkOptsFrom(products));
      })
    ;
  }

  onPick(option) {
    this.setState({
      value: option.product.id,
      label: this.mkLabelFrom(option.product),
    }, () => {
      if (typeof this.props.onPick === "function") {
        this.props.onPick(option.product);
      }
    });
  }

  render() {
    return (
      <AsyncSelect
        { ...this.props }
        closeMenuOnSelect={true}
        loadOptions={this.loadOptions}
        ref={this.props.forwardRef}
        onChange={this.onPick}
        components={{ DropdownIndicator:() => null }}
        defaultOptions
        value={{
          value: this.state.value,
          label: this.state.label
        }}
        styles={{
          control: (provided) => ({
            ...provided,
            marginBottom: 10
          })
        }}
      />
    );
  }

}

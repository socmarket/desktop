import React          from "react"
import { components } from "react-select"
import AsyncSelect    from "react-select/async"
import {
  Header, Grid, Table, Form, Input, Select,
  TextArea, Button, Segment, Image,
  Label, Container, Menu, Message, Divider, List
} from "semantic-ui-react"
import { withTranslation } from 'react-i18next';

const Option = (props) => {
  const p = props.data.product
  const {
    children,
    className,
    cx,
    getStyles,
    isDisabled,
    isFocused,
    isSelected,
    innerRef,
    innerProps,
  } = props
  const cname = className + " ui compact " +
    (isFocused ?
      (isSelected ? "blue" : "info") :
      (isSelected ? "blue" : "")
    ) + " message"

  return (
    <div
      className={cname}
      ref={innerRef}
      style={{ margin: 0 }}
      {...innerProps}
    >
      {
        p.categoryTitle
        + " : " + p.title
        + " : " + p.quantity
        + " : " + p.price
        + " | " + p.barcode
      }
    </div>
  )
}

class ProductPicker extends React.Component {

  constructor(props) {
    super(props)
    this.productApi = this.props.api.product
    this.onPick = this.onPick.bind(this)
    this.onKeyDown = this.onKeyDown.bind(this)
    this.loadOptions = this.loadOptions.bind(this)
    this.state = {
      value: -1,
      label: "",
    }
    this.t = this.props.t
  }

  updateLabel(value) {
    return this.productApi.pick(value)
      .then(product => {
        if (product) {
          this.setState({
            value: product.id,
            label: this.mkLabelFrom(product),
          })
        } else {
          this.setState({
            value: -1,
            label: "",
          })
        }
      })

  }

  mkLabelFrom(product) {
    return product.categoryTitle
      + " : " + product.title
      + " : " + (product.quantity ? product.quantity : 0) + " " + product.unitNotation
      + (product.price ? " : " + product.price : this.t("noPrice"))
      + (product.brand ? " | " + product.brand : "")
      + (product.model ? " | " + product.model : "")
      + " | " + product.barcode
      + (product.oemNo ? " | " + product.oemNo : "")
  }

  mkOptsFrom(products) {
    const self = this
    return products.map(product => ({
      label: self.mkLabelFrom(product),
      value: product.id,
      product: product,
    }))
  }

  componentDidMount() {
    this.updateLabel(this.props.value)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.value !== this.props.value) {
      this.updateLabel(this.props.value)
    }
  }

  loadOptions(pattern, cb) {
    return this.productApi.find(pattern, 10)
      .then(products => {
        cb(this.mkOptsFrom(products))
      })

  }

  onPick(option) {
    this.setState({
      value: option.product.id,
      label: this.mkLabelFrom(option.product),
    }, () => {
      if (typeof this.props.onPick === "function") {
        this.props.onPick(option.product)
      }
    })
  }

  onKeyDown(ev) {
    // !!! This handler is need to make barcode reader work
    // Barcode reader "types in" barcode too fast, so we need to
    // debounce search action, otherwise control can't make it out
    const ref = this.props.forwardRef.current
    const target = ev.target
    if (ev.key === "Enter") {
      if (ref.state.isLoading) {
        setTimeout(() => {
          target.dispatchEvent(new KeyboardEvent("keydown", { type: "keydown", key: 'Enter', bubbles: true }))
        }, 100)
      }
    }
  }

  render() {
    var height = 35
    switch (this.props.size) {
      case "small":
        height = 35
        break
    }
    return (
      <AsyncSelect
        { ...this.props }
        closeMenuOnSelect={true}
        loadOptions={this.loadOptions}
        ref={this.props.forwardRef}
        onChange={this.onPick}
        onKeyDown={this.onKeyDown}
        defaultOptions
        value={{
          value: this.state.value,
          label: this.state.label
        }}
        components={{
          ClearIndicator:() => null,
          DropdownIndicator:() => null,
          IndicatorSeparator:() => null,
        }}
        theme={theme => ({
          ...theme,
        })}
        styles={{
          container: (base) => ({
            ...base,
          }),
          control: (base, state) => ({
            ...base,
            borderColor: state.isFocused ? "#cce2ff" : "rgba(34,36,38,.15)",
            boxShadow: "none",
          }),
          input: (provided) => ({
            ...provided,
          }),
          dropdownIndicator: (base) => ({
            ...base,
          }),
          clearIndicator: (base) => ({
            ...base,
          }),
        }}
      />
    )
  }

}
export default (withTranslation("productPicker")(ProductPicker))

import React          from "react"
import { components } from "react-select"
import AsyncSelect    from "react-select/async"

export default class CurrencyPicker extends React.Component {

  constructor(props) {
    super(props)
    this.onPick = this.onPick.bind(this)
    this.loadOptions = this.loadOptions.bind(this)
    this.state = {
    }
  }

  mkLabel(currency) {
    return `${currency.notation}: ${currency.title}`
  }

  updateLabel(value) {
    const self = this
    return this.props.api.currency.pick(value)
      .then(currency => {
        if (currency) {
          self.setState({
            value: currency.id,
            label: this.mkLabel(currency),
          })
        } else {
          self.setState({
            value: -1,
            label: "",
          })
        }
      })
    
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
    const self = this
    this.props.api.currency.find(pattern)
      .then(cats => {
        const opts = cats.map(cat => ({
          label: this.mkLabel(cat),
          value: cat.id,
          currency: cat,
        }))
        cb(opts)
      })
    
  }

  onPick(option) {
    this.setState({
      value: option.currency.id,
      label: option.currency.title,
    }, () => {
      if (this.props.onPick) {
        this.props.onPick(option.currency)
      }
    })
  }

  render() {
    var height = 38
    switch (this.props.size) {
      case "small":
        height = 35
        break
      case "large":
        height = 42
        break
    }
    return (
      <AsyncSelect
        { ...this.props }
        closeMenuOnSelect={true}
        loadOptions={this.loadOptions}
        ref={this.props.forwardRef}
        onChange={this.onPick}
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
        styles={{
          control: (base, state) => ({
            ...base,
            borderColor: state.isFocused ? "#cce2ff" : "rgba(34,36,38,.15)",
            boxShadow: "none",
            paddingTop: 0,
            paddingBottom: 0,
            minHeight: height,
            height: height,
          }),
          valueContainer: (base) => ({
            ...base,
            paddingTop: 0,
            paddingBottom: 0,
            minHeight: height,
            height: height,
          }),
          input: (provided) => ({
            ...provided,
            paddingTop: 0,
            paddingBottom: 0,
            minHeight: height,
            height: height,
          }),
        }}
      />
    )
  }

}

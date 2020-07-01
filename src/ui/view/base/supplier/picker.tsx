import React          from "react"
import { components } from "react-select"
import AsyncSelect    from "react-select/async"

export default class SupplierPicker extends React.Component {

  constructor(props) {
    super(props)
    this.onPick = this.onPick.bind(this)
    this.loadOptions = this.loadOptions.bind(this)
    this.state = {
    }
  }

  updateLabel(value) {
    const self = this
    return this.props.api.supplier.pick(value)
      .then(supplier => {
        if (supplier) {
          self.setState({
            value: supplier.id,
            label: supplier.name,
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
    this.props.api.supplier.find(pattern)
      .then(cats => {
        const opts = cats.map(cat => ({
          label: cat.name,
          value: cat.id,
          supplier: cat,
        }))
        cb(opts)
      })
    
  }

  onPick(option) {
    this.setState({
      value: option.supplier.id,
      label: option.supplier.name,
    }, () => {
      if (this.props.onPick) {
        this.props.onPick(option.supplier)
      }
    })
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
          control: (base) => ({
            ...base,
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

import React          from "react"
import { components } from "react-select"
import AsyncSelect    from "react-select/async"

export default class UnitPicker extends React.Component {

  constructor(props) {
    super(props)
    this.onPick = this.onPick.bind(this)
    this.loadOptions = this.loadOptions.bind(this)
    this.state = {
    }
  }

  updateLabel(value) {
    const self = this
    return this.props.api.unit.pick(value)
      .then(unit => {
        if (unit) {
          self.setState({
            value: unit.id,
            label: unit.title,
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
    this.props.api.unit.find(pattern)
      .then(cats => {
        const opts = cats.map(cat => ({
          label: cat.title,
          value: cat.id,
          unit: cat,
        }))
        cb(opts)
      })
    
  }

  onPick(option) {
    this.setState({
      value: option.unit.id,
      label: option.unit.title,
    }, () => {
      if (this.props.onPick) {
        this.props.onPick(option.unit)
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
          input: (provided) => ({
            ...provided,
            paddingTop: 0,
            paddingBottom: 0,
            minHeight: height,
            height: height,
          }),
          dropdownIndicator: (base) => ({
            ...base,
            paddingTop: 0,
            paddingBottom: 0,
          }),
          clearIndicator: (base) => ({
            ...base,
            paddingTop: 0,
            paddingBottom: 0,
          }),
        }}
      />
    )
  }

}

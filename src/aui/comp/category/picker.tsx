import React          from "react";
import { components } from "react-select";
import AsyncSelect    from "react-select/async";

export default class CategoryPicker extends React.Component {

  api = window.api

  constructor(props) {
    super(props);
    this.onPick = this.onPick.bind(this);
    this.loadOptions = this.loadOptions.bind(this);
    this.state = {};
  }

  updateText(value) {
    const self = this;
    api.category.pick(value)
      .then(category => {
        if (category) {
          self.setState({
            value: category.id,
            label: category.title,
          });
        } else {
          self.setState({
            value: -1,
            label: "",
          });
        }
      })
    ;
  }

  componentDidMount() {
    this.updateText(this.props.value);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.value !== this.props.value) {
      this.updateText(this.props.value);
    }
  }

  loadOptions(pattern, cb) {
    const self = this;
    api.category.find(pattern)
      .then(cats => {
        const opts = cats.map(cat => ({
          label: cat.title,
          value: cat.id,
          category: cat,
        }));
        cb(opts);
      })
    ;
  }

  onPick(option) {
    this.props.onPick(option.category);
    this.setState({
      value: option.category.id,
      label: option.category.title,
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

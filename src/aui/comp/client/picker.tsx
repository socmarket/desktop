import React          from "react";
import { components } from "react-select";
import AsyncSelect    from "react-select/async";

export default class ClientPicker extends React.Component {

  api = window.api

  constructor(props) {
    super(props);
    this.onPick = this.onPick.bind(this);
    this.loadOptions = this.loadOptions.bind(this);
    this.state = {
    };
  }

  updateLabel(value) {
    const self = this;
    return api.client.pick(value)
      .then(client => {
        if (client) {
          self.setState({
            value: client.id,
            label: client.name + ": " + client.balance,
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
    this.updateLabel(this.props.value);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.value !== this.props.value) {
      this.updateLabel(this.props.value);
    }
  }

  loadOptions(pattern, cb) {
    const self = this;
    api.client.find(pattern)
      .then(clients => {
        const opts = clients.map(client => ({
          label: client.name + ": " + client.balance,
          value: client.id,
          client: client,
        }));
        cb(opts);
      })
    ;
  }

  onPick(option) {
    if (typeof this.props.onPick === "function") {
      this.props.onPick(option.client);
    }
    this.setState({
      value: option.client.id,
      label: option.client.name,
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
        cache={null}
        cacheOptions={false}
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

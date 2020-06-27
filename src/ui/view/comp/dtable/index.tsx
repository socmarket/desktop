import React from "react"
import moment from "moment"
import {
  Table, Header, Segment, Icon
} from "semantic-ui-react"

class DTable extends React.Component {

  constructor(props) {
    super(props)

    this.onOpenRow    = this.onOpenRow.bind(this)
    this.onKeyDown    = this.onKeyDown.bind(this)

    this.state = {
      idx: -1, 
    }
  }

  componentDidUpdate() {
    if (this.props.items.length <= this.state.idx) {
      this.setState({
        idx: this.props.items.length - 1
      })
    }
  }

  onKeyDown(ev) {
    const count = this.props.items.length
    switch (ev.key) {
      case "ArrowUp": {
        const cidx = this.state.idx <= 0 ? count : this.state.idx
        this.setState({ idx: cidx - 1 })
        break
      }
      case "ArrowDown": {
        const cidx = this.state.idx === (count - 1) ? -1 : this.state.idx
        this.setState({ idx: cidx + 1 })
        break
      }
      case "Enter": {
        if (ev.shiftKey) {
          this.onActivate()
        } else {
          this.onOpenRow(this.state.idx)
        }
        break
      }
      case "Delete": {
        this.onDeleteRow(this.state.idx)
        break
      }
    }
  }

  onDeleteRow(idx) {
    if (typeof this.props.onDeleteRow === "function" &&
      idx >= 0 && idx < this.props.items.length) {
      this.props.onDeleteRow(this.props.items[idx], idx)
    }
  }

  onActivate() {
    if (typeof this.props.onActivate === "function") {
      this.props.onActivate()
    }
  }

  onOpenRow(idx) {
    if (typeof this.props.onOpenRow === "function" &&
      idx >= 0 && idx < this.props.items.length) {
      this.props.onOpenRow(this.props.items[idx], idx)
    }
  }

  table() {
    return (
      <Segment raised color="green"
        tabIndex={1000}
        onKeyDown={this.onKeyDown}
      >
        <Header as="h2" dividing color="green" textAlign="center">
          <Icon name={this.props.titleIcon} />
          {this.props.title}
        </Header>
        <table
          className="ui compact celled selectable table light-focus"
          ref={this.props.innerRef}
        >
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell textAlign="center" >#</Table.HeaderCell>
              { this.props.columns.map((col, idx) => (
                <Table.HeaderCell key={idx} textAlign={col.align || "left"} {...(col.positive ? {positive: true} : {})} >{col.title}</Table.HeaderCell>
              ))}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            { this.props.items.map((item, ridx) => (
              <Table.Row key={ridx} active={ridx === this.state.idx} onClick={() => this.onOpenRow(ridx)}>
                <Table.Cell textAlign="right">{ridx+1}</Table.Cell>
                { this.props.columns.map((col, cidx) => (
                  <Table.Cell key={cidx} textAlign={col.align || "left"} {...(col.positive ? {positive: true} : {})} >{item[col.key]}</Table.Cell>
                ))}
              </Table.Row>
            ))}
          </Table.Body>
        </table>
      </Segment>
    )
  }

  render() {
    return this.table()
  }
}

export default React.forwardRef((props, ref) => <DTable innerRef={ref} {...props} />)

import { AppActions }    from "Store/base/app"

import { connect } from "react-redux"
import React, { Fragment } from "react"
import { withTranslation } from 'react-i18next'
import { Modal, Divider, Grid, Header, Segment, Label } from "semantic-ui-react"

const INTERVAL = 5000

class AboutDialog extends React.Component {

  constructor(props) {
    super(props)
    this.checkHealth = this.checkHealth.bind(this)
    this.serverApi = this.props.api.server
    this.t = this.props.t
    this.state = {
      error: false,
      loading: true,
      apiVersion: "",
    }
  }

  checkHealth() {
    this.setState({
      loading: true,
      error: false,
    }, () => {
      this.serverApi.health.check()
        .then(res => {
          this.setState({
            apiVersion: res.data.apiVersion,
            loading: false,
            error: false,
          }, () => {
            setTimeout(this.checkHealth, INTERVAL)
          })
        })
        .catch(err => {
          console.log(err)
          this.setState({
            error: true,
            loading: false,
          }, () => {
            setTimeout(this.checkHealth, INTERVAL)
          })
        })
    })
  }

  componentDidMount() {
    this.checkHealth()
  }

  componentWillUnmount() {
  }

  render() {
    const theme = this.props.theme
    return (
      <Modal open size="mini" centered={false} onClose={this.props.onClose}>
        <Modal.Content>
          <Segment inverted color={theme.mainColor} textAlign="center">
            <Label color={theme.mainColor}  size="big" style={{ padding: 5, margin: 0 }}>SOC</Label>
            <Label color="green" size="big" style={{ padding: 5, margin: 0 }}>Market</Label>
            <Label color={theme.mainColor}  size="big" style={{ padding: 5, margin: 0 }}>2C</Label>
          </Segment>
          <Segment>
            <Grid columns={2}>
              <Grid.Column textAlign="right">
                <p>{this.t("version")}</p>
                <p>{this.t("build")}</p>
                <p>{this.t("buildDate")}</p>
                <p>{this.t("apiVersion")}</p>
              </Grid.Column>
              <Grid.Column>
                <p>{VERSION.value}</p>
                <p>{VERSION.hash.substring(0, 8)}</p>
                <p>{VERSION.date.substring(0, 10)}</p>
                { (!this.state.loading && !this.state.error) && <p>{this.state.apiVersion}</p> }
                { this.state.loading && <p>Проверка...</p> }
                { (!this.state.loading && this.state.error) && <p>Нет соединения</p> }
              </Grid.Column>
            </Grid>
            <Divider vertical>|</Divider>
          </Segment>
        </Modal.Content>
      </Modal>
    )
  }
}

const stateMap = (state) => {
  return {
  }
}

export default connect(stateMap, { ...AppActions })(withTranslation("about")(AboutDialog))

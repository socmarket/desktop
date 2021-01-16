import React, { Fragment } from "react"
import i18next from "i18next"

import SaleCheck        from "PrintPreview/base/saleCheck"
import Consignment      from "PrintPreview/base/consignment"
import SaleCheckJournal from "PrintPreview/base/saleCheck/journal"
import ProfitByDay      from "PrintPreview/base/profitByDay"
import Stocks           from "PrintPreview/base/stocks"

const renderView = (view, data) => {
  switch (view) {
    case ""                 : return (<div>Waiting...</div>)
    case "Consignment"      : return (<Consignment {...data} />)
    case "SaleCheck"        : return (<SaleCheck {...data} />)
    case "SaleCheckJournal" : return (<SaleCheckJournal {...data} />)
    case "ProfitByDay"      : return (<ProfitByDay {...data} />)
    case "Stocks"           : return (<Stocks {...data} />)
  }
}

class PrintPreview extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      view: "",
      data: {},
    }
  }

  componentDidMount() {
    this.props.api.onUseSettings(opts => {
      i18next.changeLanguage(opts.language)
    })
    this.props.api.onPrintPreview(pack => {
      if (pack && pack.hasOwnProperty("msg") && pack.hasOwnProperty("wcId")) {
        this.setState({
          view: pack.msg.view,
          data: pack.msg.data,
        }, () => {
          this.props.api.pcPrinter.printToPdf(pack.wcId)
        })
      }
    })
  }

  render() {
    return renderView(this.state.view, this.state.data)
  }

}

export default PrintPreview

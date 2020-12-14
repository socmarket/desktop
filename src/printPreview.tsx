import "./i18n"
import i18next from "i18next"

import React, { Fragment } from "react"
import ReactDom from "react-dom"

import "moment/locale/ru"

import "react-dates/initialize"
import "react-dates/lib/css/_datepicker.css"
import "semantic-ui-css/semantic.min.css"

import "Style/main.css"

import PrintPreview from "PrintPreview/"

const api = window.api

ReactDom.render(<PrintPreview api={api} />, document.getElementById("root"))

import { createStore } from "Ui/store/creator"

import StartPage from "Ui/start"
import ErrorPage from "Ui/error"

import "./i18n"


import React, { Fragment } from "react"
import ReactDom from "react-dom"
import { Provider } from "react-redux"

import "react-dates/initialize"
import "react-dates/lib/css/_datepicker.css"
import "semantic-ui-css/semantic.min.css"

import "Style/main.css"

const api = window.api

api.migrateDb()
  .then(_ => createStore({ api: api }))
  .then(store => 
    ReactDom.render(
      <Provider store={store}>
        <StartPage api={api} />
      </Provider>,
      document.getElementById("root")
    )
  )
  .catch(err => {
    console.trace(err)
    ReactDom.render(
      <ErrorPage error={err} />,
      document.getElementById("root")
    )
  })

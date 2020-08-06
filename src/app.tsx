import { createStore } from "Ui/store/creator"

import StartPage from "Ui/start"
import ErrorPage from "Ui/error"

import "./i18n"


import React, { Fragment } from "react"
import ReactDom from "react-dom"
import { Provider } from "react-redux"

import "moment/locale/ru"

import "react-dates/initialize"
import "react-dates/lib/css/_datepicker.css"
import "semantic-ui-css/semantic.min.css"

import "Style/main.css"

const api = window.api

function serverHealthCheckerUp(store) {
  function healthChecker(interval) {
    setTimeout(() => {
      api.server.health.check()
        .then(res => {
          if (res.error) {
            store.dispatch({ type: "SERVER_HEALTH_NOT_OK", data: res })
          } else {
            store.dispatch({ type: "SERVER_HEALTH_OK", data: res.data })
          }
        })
        .catch(e => {
          store.dispatch({ type: "SERVER_HEALTH_NOT_OK", data: e })
        })
        .then(() => healthChecker(5000))
    }, interval)
  }
  healthChecker(0)
}

api.migrateDb()
  .then(_ => createStore({ api: api }))
  .then(store => {
    serverHealthCheckerUp(store)
    return ReactDom.render(
      <Provider store={store}>
        <StartPage api={api} />
      </Provider>,
      document.getElementById("root")
    )
  })
  .catch(err => {
    console.trace(err)
    ReactDom.render(
      <ErrorPage error={err} />,
      document.getElementById("root")
    )
  })

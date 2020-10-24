import { createStore } from "Ui/store/creator"

import StartPage from "Ui/start"
import ErrorPage from "Ui/error"
import { AppActions } from "Store/base/app"

import "./i18n"


import React, { Fragment } from "react"
import ReactDom from "react-dom"
import { Provider } from "react-redux"

import "moment/locale/ru"

import "react-dates/initialize"
import "react-dates/lib/css/_datepicker.css"
import "semantic-ui-css/semantic.min.css"

import "Style/main.css"

function startIdlenessDetektor(store, api, idleMillis) {

  var isIdle = false
  var idleTimeoutId = 0

  function detectIdleness() {
    window.addEventListener("mousemove", resetTimer, false)
    window.addEventListener("mousedown", resetTimer, false)
    window.addEventListener("keypress", resetTimer, false)
    window.addEventListener("DOMMouseScroll", resetTimer, false)
    window.addEventListener("mousewheel", resetTimer, false)
    window.addEventListener("touchmove", resetTimer, false)
    window.addEventListener("MSPointerMove", resetTimer, false)
    startTimer()
  }

  function startTimer() {
    idleTimeoutId = setTimeout(function () {
      isIdle = true
      down()
    }, idleMillis)
  }

  function resetTimer(e) {
    clearTimeout(idleTimeoutId)
    startTimer()
    if (isIdle) {
      up()
      isIdle = false
    }
  }

  function down() {
    store.dispatch(AppActions.goIdle())
  }

  function up() {
    store.dispatch(AppActions.goWork())
  }

  detectIdleness()
}

function serverHealthCheckerUp(store, api, checkInterval) {
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
        .then(() => healthChecker(checkInterval))
    }, interval)
  }
  healthChecker(0)
}

function startJobs(store, api) {
  let newV = false
  function onChange() {
    const oldV = newV
    const { app } = store.getState()
    newV = app.online && app.idle
    if (newV !== oldV) {
      if (newV) {
        api.server.sync.resume()
      } else {
        api.server.sync.pause()
      }
    }
  }
  store.subscribe(onChange)
}

const api = window.api
const IdleDetectTimeout   = 30000
const HealthCheckInterval = 10000

api.migrateDb()
  .then(_ => createStore({ api: api }))
  .then(store => {
    startIdlenessDetektor(store, api, IdleDetectTimeout)
    serverHealthCheckerUp(store, api, HealthCheckInterval)
    startJobs(store, api)
    AppActions.reloadBg()(store.dispatch, store.getState)
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

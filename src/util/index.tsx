import React from "react"
import moment from "moment"

const numberInputWithRef = (ref) => (props) => (
  <div className="ui input">
    <input ref={ref} {...props} style={{ textAlign: "right" }} />
  </div>
)

const inputWithRef = (ref) => (props) => (
  <div className="ui input">
    <input ref={ref} {...props} />
  </div>
)

const ifNumberF = (ev, f) => {
  try {
    const value = +event.target.value;
    if (event.target.value === "") {
      f(0)
    } else if (!isNaN(value) && isFinite(value)) {
      f(event.target.value)
    }
  } catch (e) {
  }
}

function asDate(value) {
  return moment.utc(value).local().format("DD-MM-YYYY HH:mm")
}

export { numberInputWithRef, inputWithRef, ifNumberF, asDate }

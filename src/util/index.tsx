import React from "react"
import moment from "moment"
import {
  Button, Label,
} from "semantic-ui-react"

const actionInputWithRef = (ref, icon, onClickF) => (props) => (
  <div className="ui action input">
    <input ref={ref} {...props} />
    { icon && <Button type="button" icon={icon} onClick={onClickF} /> }
  </div>
)

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
      f(event.target.value.replace(/^(0+([1-9].*))/, "$2").replace(/^(0+(\.*))/, "0$2"))
    }
  } catch (e) {
  }
}

function asDate(value) {
  return moment.utc(value).local().format("DD-MM-YYYY HH:mm")
}

function mround(value) {
  return Math.round(value * 100) / 100
}

const asDateBadge = (date, color) => (
  <Label color={color} size="large">{moment.utc(date).fromNow()}</Label>
)

const spacedNum = (x) => {
  if (x) {
    const str = mround(x).toString()
    if (str.length > 3) {
      return str.replace(/\B(?=(\d{3})+(?!\d))/g, " ")
    } else {
      return str
    }
  } else {
    return "0"
  }
}
const maxText = (x, maxN) => {
  if (x) {
    const y = x.toString()
    if (y.length > maxN) {
      return y.substr(0, maxN - 2) + ".."
    } else {
      return y
    }
  } else {
    return ""
  }
}

export {
  mround,
  numberInputWithRef,
  inputWithRef,
  actionInputWithRef,
  ifNumberF,
  asDate,
  asDateBadge,
  spacedNum,
  maxText,
}

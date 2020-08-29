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

const asDateBadge = (date, color) => (
  <Label color={color} size="large">{moment.utc(date).fromNow()}</Label>
)

const spacedNum = (x) => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")

export {
  numberInputWithRef,
  inputWithRef,
  actionInputWithRef,
  ifNumberF,
  asDate,
  asDateBadge,
  spacedNum,
}

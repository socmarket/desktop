import React from "react"

const numberInputWithRef = (ref) => (props) => (
  <div className="ui input">
    <input ref={ref} {...props} style={{ textAlign: "right" }} />
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

export { numberInputWithRef, ifNumberF }

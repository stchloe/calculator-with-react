import { useReducer } from "react"
import DigitButton from "./DigitButton"
import OperationButton from "./OperationButton"
import "./styles.css"

export const ACTIONS = { /* object of all the different actions that can be taken on the calculator*/
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERATION: "choose-operation",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  EVALUATE: "evaluate",
}

function reducer(state, { type, payload }) { /* reducer hook manages all of the states for you */
  switch (type) {
    case ACTIONS.ADD_DIGIT:

      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        }
      }
      /* overwrites after evaluation */

      if (payload.digit === "0" && state.currentOperand === "0") {
        return state
      }
      /* builds logic for only 1 zero at start */

      if (payload.digit === "." && state.currentOperand.includes(".")) {
        return state
      }
      /* builds logic for only one decimal place */

      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      }
    /* updates operation*/

    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperand == null && state.previousOperand == null) {
        return state
      }
      /* ops buttons cannot be clicked if display is empty */

      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation,
        }
      }
      /* allows you to change the operation button */

      if (state.previousOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null,
        }
        /* sets current operand to the previous when an operation is pressed */
      }

      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null
      }

    case ACTIONS.CLEAR:
      return {}
    /* on click of AC, returns empty state */

    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: null,
        }
      }
      /* if in overwrite state, clear current operand, change overwite back to false & spread state */

      if (state.currentOperand == null) return state /* if current operand is empty, then there is nothing to delete */
      if (state.currentOperand.length === 1) {
        return {
          ...state,
          currentOperand: null,
        }
      }
      /* if there is only 1 digit in current operand, reset & clear all */

      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1), /* removes the last digit from the current operand */
      }

    case ACTIONS.EVALUATE:
      if (
        state.operation == null ||
        state.currentOperand == null ||
        state.previousOperand == null
      ) {
        return state
      }

      return {
        ...state,
        overwrite: true,
        previousOperand: null,
        operation: null,
        currentOperand: evaluate(state),
      }
    /* if operation is not complete or null, then do nothing */
  }
}

function evaluate({ currentOperand, previousOperand, operation }) {
  const prev = parseFloat(previousOperand)
  const current = parseFloat(currentOperand)
  if (isNaN(prev) || isNaN(current)) return ""

  let computation = ""
  switch (operation) {
    case "+":
      computation = prev + current
      break
    case "-":
      computation = prev - current
      break
    case "*":
      computation = prev * current
      break
    case "÷":
      computation = prev / current
      break
  }

  return computation.toString()
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
})

function formatOperand(operand) {
  if (operand == null) return
  const [integer, decimal] = operand.split('.')
  if (decimal == null) return INTEGER_FORMATTER.format(integer)
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}
/* function to format calculator */

function App() {

  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(reducer, {})
  /* useReducer hook allows you to keep all state logic in one place */

  return (
    <div className="calculator-grid">
      <div className="display">
        <div className="previous-operand">{formatOperand(previousOperand)} {operation}</div>
        <div className="current-operand">{formatOperand(currentOperand)}</div>
      </div>
      <button id="clear" className="span-two" onClick={() => dispatch({ type: ACTIONS.CLEAR })}>AC</button>
      <button id="delete" onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>DEL</button>
      <OperationButton id="divide" operation="÷" dispatch={dispatch} />
      <DigitButton id="seven" digit="7" dispatch={dispatch} />
      <DigitButton id="eight" digit="8" dispatch={dispatch} />
      <DigitButton id="nine" digit="9" dispatch={dispatch} />
      <OperationButton id="multiply" operation="*" dispatch={dispatch} />
      <DigitButton id="four" digit="4" dispatch={dispatch} />
      <DigitButton id="five" digit="5" dispatch={dispatch} />
      <DigitButton id="six" digit="6" dispatch={dispatch} />
      <OperationButton id="add" operation="+" dispatch={dispatch} />
      <DigitButton id="one" digit="1" dispatch={dispatch} />
      <DigitButton id="two" digit="2" dispatch={dispatch} />
      <DigitButton id="three" digit="3" dispatch={dispatch} />
      <OperationButton id="subtract" operation="-" dispatch={dispatch} />
      <DigitButton id="decimal" digit="." dispatch={dispatch} />
      <DigitButton id="zero" digit="0" dispatch={dispatch} />
      <button id="equals" className="span-two" onClick={() => dispatch({ type: ACTIONS.EVALUATE })}>=</button>
    </div>
  );
}

export default App;

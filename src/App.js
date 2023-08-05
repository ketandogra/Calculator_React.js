import "./styles.css";
import {useReducer} from 'react'
import DigitButton from "./components/DigitButton";
import OperationButton from "./components/OperationButton";

export const ACTIONS = {

  ADD_DIGIT:'add-digit',
  CLEAR:'clear',
  DELETE_DIGIT:'delete-digit',
  CHOOSE_OPERATION:'choose-operation',
  EVALUATE:'evalutae'


}

function reducer(state,{type,payload}){

  switch(type){
    // Add digit to current operand
    case ACTIONS.ADD_DIGIT:
      if(state.overwrite){
        return{
          ...state,
          currentOperand:payload.digit,
          overwrite:false
        }
      }
      if(payload.digit === '0' && state.currentOperand === '0'){
        return state
      }
     
      if(payload.digit === '.' && state.currentOperand.includes(".")){
        return state
      }
      return{
        ...state,
        currentOperand:`${state.currentOperand || ""}${payload.digit}`
       
      }


      // operations
      case ACTIONS.CHOOSE_OPERATION:
        if(state.currentOperand == null && state.previousOperand == null){
          return state
        }
        if (state.currentOperand == null){
          return {
            ...state,
            operation:payload.operation
          }
        }

        if(state.previousOperand == null){
          return {
          ...state,
          previousOperand:state.currentOperand,
          operation:payload.operation,
          currentOperand:null
          }

        }

        return{
          ...state,
          previousOperand: evaluate(state),
          operation:payload.operation,
          currentOperand:null
        }
        

      // action for reset calculator
      case ACTIONS.CLEAR:
        return {}

      // action for evaluate result
      case ACTIONS.EVALUATE:
        if(state.operation == null || state.previousOperand == null || state.currentOperand == null){
          return state
        }

        return {
          ...state,
          overwrite:true,
          previousOperand:null,
          operation:null,
          currentOperand: evaluate(state),
         
        }

      // action for delete digit
      case ACTIONS.DELETE_DIGIT:
        if(state.overwrite){
          return{
            ...state,
            overwrite:false,
            currentOperand:null
          }
        }
        if(state.currentOperand == null){
          return state
        }
        return {
          ...state,
          currentOperand:state.currentOperand.slice(0,-1)
        }

      default:
        return state
  }

}

// operations evaluate function
function evaluate({currentOperand,previousOperand,operation}){
  const current = parseFloat(currentOperand)
  const prev = parseFloat(previousOperand)

  if(isNaN(prev) || isNaN(current)){
    return ""
  }

  let result = ""

  switch(operation){
    case "+":
     result = prev+current
     break 

    case "-":
     result =  prev-current 
     break         
        
    case "*":
     result =  prev*current 
     break 
    case "÷":
       result =  prev / current 
       break 

    default:
      result = null


  }

  return result.toString()

}

// Integer formatter
const  INTEGER_FORMATTER = new Intl.NumberFormat('en-IN',{maximumFractionDigits:0,
})
//format operand function
function formatOperand(operand){
  if(operand == null) return

  const [integer,decimal] = operand.split(".")

  if(decimal == null) return INTEGER_FORMATTER.format(integer) 

  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`

}


function App() {
  const [{currentOperand,previousOperand,operation},dispatch] = useReducer(reducer,{})

  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">{formatOperand(previousOperand)} {operation}</div>
        <div className="current-operand">{formatOperand(currentOperand)}</div>
      </div>

      <button className="span-two" onClick={()=>dispatch({type:ACTIONS.CLEAR})}>AC</button>
      <button onClick={()=>dispatch({type:ACTIONS.DELETE_DIGIT})}>DEL</button>
      <OperationButton operation='÷' dispatch={dispatch}/>
      <DigitButton digit='1' dispatch={dispatch}/>
      <DigitButton digit='2' dispatch={dispatch}/>
      <DigitButton digit='3' dispatch={dispatch}/>
      <OperationButton operation='*' dispatch={dispatch}/>
      <DigitButton digit='4' dispatch={dispatch}/>
      <DigitButton digit='5' dispatch={dispatch}/>
      <DigitButton digit='6' dispatch={dispatch}/>
      <OperationButton operation='+' dispatch={dispatch}/>
      <DigitButton digit='7' dispatch={dispatch}/>
      <DigitButton digit='8' dispatch={dispatch}/>
      <DigitButton digit='9' dispatch={dispatch}/>
      <OperationButton operation='-' dispatch={dispatch}/>
      <DigitButton digit='.' dispatch={dispatch}/>
      <DigitButton digit='0' dispatch={dispatch}/>
      <button className="span-two" onClick={()=>dispatch({type:ACTIONS.EVALUATE})}>=</button>
    </div>
  );
}

export default App;

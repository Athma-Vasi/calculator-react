import React from "react";
import { OperandBttn } from "../../styledTwComponents/operandBttn";
import { OperatorBttn } from "../../styledTwComponents/operatorBttn";
import { Dispatch, State } from "../../typings/types";

type CalculatorProps = {
  state: State;
  action: any;
  dispatch: React.Dispatch<Dispatch>;
};

function Calculator({ state, action, dispatch }: CalculatorProps) {
  console.log("state", state);
  return (
    <div className="grid h-full w-full grid-rows-6 p-6 outline-dotted">
      {/* history */}
      <div className="row-span-1">
        <h3>History</h3>
      </div>

      {/* display */}
      <div className="row-span-1">
        <h2>Display</h2>
      </div>

      {/* buttons */}
      <div className="row-span-4 grid grid-cols-4">
        {/* row 1 */}
        <OperandBttn state={state}>7</OperandBttn>
        <OperandBttn state={state}>9</OperandBttn>
        <OperandBttn state={state}>9</OperandBttn>
        <OperatorBttn state={state}>DEL</OperatorBttn>

        {/* row 2 */}
        <OperandBttn state={state}>4</OperandBttn>
        <OperandBttn state={state}>5</OperandBttn>
        <OperandBttn state={state}>6</OperandBttn>
        <OperatorBttn state={state}>+</OperatorBttn>

        {/* row 3 */}
        <OperandBttn state={state}>1</OperandBttn>
        <OperandBttn state={state}>2</OperandBttn>
        <OperandBttn state={state}>3</OperandBttn>
        <OperatorBttn state={state}>-</OperatorBttn>

        {/* row 4 */}
        <OperandBttn state={state}>.</OperandBttn>
        <OperandBttn state={state}>0</OperandBttn>
        <OperandBttn state={state}>/</OperandBttn>
        <OperatorBttn state={state}>X</OperatorBttn>

        {/* row 5 */}
        <OperatorBttn state={state} className="col-span-2">
          RESET
        </OperatorBttn>
        <button type="submit" className="col-span-2">
          =
        </button>
      </div>
    </div>
  );
}

export default Calculator;

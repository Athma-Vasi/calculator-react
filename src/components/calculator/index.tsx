import React, { useEffect } from "react";
import { v4 as v4uuid } from "uuid";
import type { Action, Dispatch, Operator, State } from "../../typings/types";

import { BttnsContainer } from "../../styledTwComponents/bttnsContainer";
import { Display } from "../../styledTwComponents/display";
import { EnterBttn } from "../../styledTwComponents/enterBttn";
import { History } from "../../styledTwComponents/history";
import { OperandBttn } from "../../styledTwComponents/operandBttn";
import { OperatorBttn } from "../../styledTwComponents/operatorBttn";
import { calculate } from "../../utils";

type CalculatorProps = {
  state: State;
  action: Action;
  dispatch: React.Dispatch<Dispatch>;
};

function Calculator({ state, action, dispatch }: CalculatorProps) {
  function handleDecimalBttnClick(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    const value = event.currentTarget.value;

    const currentValue =
      state.appState.nextOperand === null && state.appState.operator === null
        ? state.appState.prevOperand
        : state.appState.nextOperand;

    if (currentValue !== null) {
      if (!currentValue.includes(".")) {
        state.appState.nextOperand === null
          ? (state.appState.prevOperand = `${currentValue}${value}`)
          : (state.appState.nextOperand = `${currentValue}${value}`);

        dispatch({
          type:
            state.appState.nextOperand === null
              ? action.app.setPrevOperand
              : action.app.setNextOperand,
          payload: { state },
        });
      }
    }
  }

  function handleToggleMinusClick() {
    // event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    const currentValue =
      state.appState.nextOperand === null
        ? state.appState.prevOperand
        : state.appState.nextOperand;

    if (currentValue !== null) {
      if (!currentValue.includes("-")) {
        state.appState.nextOperand === null
          ? (state.appState.prevOperand = `-${currentValue}`)
          : (state.appState.nextOperand = `-${currentValue}`);

        dispatch({
          type:
            state.appState.nextOperand === null
              ? action.app.setPrevOperand
              : action.app.setNextOperand,
          payload: { state },
        });
      } else {
        state.appState.nextOperand === null
          ? (state.appState.prevOperand = currentValue.slice(1))
          : (state.appState.nextOperand = currentValue.slice(1));

        dispatch({
          type:
            state.appState.nextOperand === null
              ? action.app.setPrevOperand
              : action.app.setNextOperand,
          payload: { state },
        });
      }
    }
  }

  function handleClearBttnClick() {
    // event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    state.appState.prevOperand = null;
    state.appState.operator = null;
    state.appState.nextOperand = null;
    state.appState.result = null;
    dispatch({
      type: action.app.setAll,
      payload: { state },
    });
  }

  function handleBackspaceBttnClick() {
    // event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    const currentValue =
      state.appState.nextOperand === null
        ? state.appState.prevOperand
        : state.appState.nextOperand;

    if (currentValue !== null) {
      const newValue = currentValue.slice(0, -1);
      state.appState.nextOperand === null
        ? (state.appState.prevOperand = newValue)
        : (state.appState.nextOperand = newValue);

      dispatch({
        type:
          state.appState.nextOperand === null
            ? action.app.setPrevOperand
            : action.app.setNextOperand,
        payload: { state },
      });
    }
  }

  function handleOperandBttnClick(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    const number = event.currentTarget.value;

    if (state.appState.prevOperand === null) {
      state.appState.prevOperand = `${number}`;
      dispatch({
        type: action.app.setPrevOperand,
        payload: { state },
      });
    } else if (
      state.appState.operator === null &&
      state.appState.nextOperand === null
    ) {
      state.appState.prevOperand = `${state.appState.prevOperand}${number}`;
      dispatch({
        type: action.app.setPrevOperand,
        payload: { state },
      });
    } else if (
      state.appState.prevOperand !== null &&
      state.appState.operator !== null &&
      state.appState.nextOperand === null
    ) {
      state.appState.nextOperand = `${number}`;
      dispatch({
        type: action.app.setNextOperand,
        payload: { state },
      });
    } else if (
      state.appState.prevOperand !== null &&
      state.appState.operator !== null &&
      state.appState.nextOperand !== null
    ) {
      state.appState.nextOperand = `${state.appState.nextOperand}${number}`;
      dispatch({
        type: action.app.setNextOperand,
        payload: { state },
      });
    }
  }

  function handleOperatorBttnClick(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    const operator_ = event.currentTarget.value as Operator;

    state.appState.operator = operator_;
    dispatch({
      type: action.app.setOperator,
      payload: { state },
    });

    if (
      state.appState.prevOperand === null &&
      state.appState.nextOperand === null &&
      state.appState.history.length !== 0
    ) {
      if (
        state.appState.history[state.appState.history.length - 1] !== undefined
      ) {
        const history = state.appState.history[
          state.appState.history.length - 1
        ] as string[];

        state.appState.prevOperand =
          history[4] === "Error: Division by 0" ? "0" : (history[4] as string);

        dispatch({
          type: action.app.setPrevOperand,
          payload: { state },
        });
      }
    }

    if (
      state.appState.prevOperand !== null &&
      state.appState.nextOperand !== null &&
      state.appState.operator !== null
    ) {
      const { prevOperand, operator, nextOperand } = state.appState;
      let result = calculate(prevOperand, operator, nextOperand);
      const smallerOperandLength = Math.min(
        prevOperand.length > 12 ? 12 : prevOperand.length,
        nextOperand.length > 12 ? 12 : nextOperand.length,
        12
      );
      //prevents scientific notation when result does not have a decimal
      result =
        result === "Error: Division by 0"
          ? "Error: Division by 0"
          : result.toString().includes(".")
          ? parseFloat(`${result}`).toPrecision(smallerOperandLength + 2)
          : parseFloat(`${result}`);

      //only add to history if prevOperand, operator, and nextOperand are not null
      state.appState.history.push([
        prevOperand,
        operator,
        nextOperand,
        "=",
        `${result}`,
      ]);
      dispatch({
        type: action.app.setHistory,
        payload: { state },
      });

      state.appState.prevOperand = null;
      state.appState.nextOperand = null;
      state.appState.operator = null;
      state.appState.result = result.toString();
      dispatch({
        type: action.app.setAll,
        payload: { state },
      });
    }
  }

  function handleEnterBttnClick() {
    // event: React.MouseEvent<HTMLButtonElement>
    if (
      state.appState.prevOperand !== null &&
      state.appState.nextOperand !== null &&
      state.appState.operator !== null
    ) {
      const { prevOperand, operator, nextOperand } = state.appState;
      let result = calculate(prevOperand, operator, nextOperand);
      const smallerOperandLength = Math.min(
        prevOperand.length > 12 ? 12 : prevOperand.length,
        nextOperand.length > 12 ? 12 : nextOperand.length,
        12
      );
      //prevents scientific notation when result does not have a decimal
      result =
        result === "Error: Division by 0"
          ? "Error: Division by 0"
          : result.toString().includes(".")
          ? parseFloat(`${result}`).toPrecision(smallerOperandLength + 2)
          : parseFloat(`${result}`);

      //only add to history if prevOperand, operator, and nextOperand are not null
      state.appState.history.push([
        prevOperand,
        operator,
        nextOperand,
        "=",
        `${result}`,
      ]);
      dispatch({
        type: action.app.setHistory,
        payload: { state },
      });

      state.appState.prevOperand = null;
      state.appState.nextOperand = null;
      state.appState.operator = null;
      state.appState.result = result.toString();
      dispatch({
        type: action.app.setAll,
        payload: { state },
      });
    }
  }

  useEffect(() => {
    //scrolls to the bottom of the history div when new expression is added
    function handleHistoryDivScroll() {
      const historyDiv = document.querySelector(
        '[data-cy="history"]'
      ) as HTMLDivElement;

      const scrollHeight = historyDiv.scrollHeight;
      historyDiv.scroll({ top: scrollHeight, left: 0, behavior: "smooth" });
    }

    handleHistoryDivScroll();
  });

  return (
    <div className="grid h-full w-full grid-rows-6 gap-y-5">
      {/* history */}
      <History state={state} data-cy="history" className="historyView">
        <div className="flex w-full flex-col items-end justify-between gap-y-3 ">
          {state.appState.history.map(
            ([prevOperand, operator, nextOperand, enter, result]) => (
              <div
                key={v4uuid()}
                className="flex w-full flex-row items-center justify-end gap-x-3"
              >
                <p>{prevOperand}</p>
                <p>{operator}</p>
                <p>{nextOperand}</p>
                <p>{enter}</p>
                <p>{result}</p>
              </div>
            )
          )}
        </div>
      </History>

      {/* display */}
      <Display state={state} data-cy="display">
        {state.appState.result &&
        state.appState.nextOperand &&
        state.appState.prevOperand === null
          ? state.appState.nextOperand
          : state.appState.result &&
            state.appState.prevOperand &&
            state.appState.nextOperand === null
          ? state.appState.prevOperand
          : state.appState.prevOperand === null &&
            state.appState.nextOperand === null &&
            state.appState.result
          ? state.appState.result
          : state.appState.result &&
            state.appState.prevOperand &&
            state.appState.nextOperand
          ? state.appState.nextOperand
          : state.appState.result ??
            state.appState.nextOperand ??
            state.appState.prevOperand ??
            state.appState.nextOperand}
      </Display>

      {/* buttons */}
      <BttnsContainer state={state}>
        {/* row 1 */}
        <div className="row-span-1 grid grid-cols-4 gap-4">
          <OperandBttn
            data-cy="bttn-7"
            state={state}
            value="7"
            onClick={handleOperandBttnClick}
          >
            7
          </OperandBttn>
          <OperandBttn
            data-cy="bttn-8"
            state={state}
            value="8"
            onClick={handleOperandBttnClick}
          >
            8
          </OperandBttn>
          <OperandBttn
            data-cy="bttn-9"
            state={state}
            value="9"
            onClick={handleOperandBttnClick}
          >
            9
          </OperandBttn>
          <OperatorBttn
            state={state}
            className="text-xl"
            data-cy="bttn-divide"
            value="/"
            onClick={handleOperatorBttnClick}
          >
            /
          </OperatorBttn>
        </div>

        {/* row 2 */}
        <div className="row-span-1 grid grid-cols-4 gap-4">
          <OperandBttn
            state={state}
            data-cy="bttn-4"
            value="4"
            onClick={handleOperandBttnClick}
          >
            4
          </OperandBttn>
          <OperandBttn
            state={state}
            data-cy="bttn-5"
            value="5"
            onClick={handleOperandBttnClick}
          >
            5
          </OperandBttn>
          <OperandBttn
            state={state}
            data-cy="bttn-6"
            value="6"
            onClick={handleOperandBttnClick}
          >
            6
          </OperandBttn>
          <OperatorBttn
            state={state}
            className="text-2xl"
            data-cy="bttn-add"
            value="+"
            onClick={handleOperatorBttnClick}
          >
            +
          </OperatorBttn>
        </div>

        {/* row 3 */}
        <div className="row-span-1 grid grid-cols-4 gap-4">
          <OperandBttn
            state={state}
            data-cy="bttn-1"
            value="1"
            onClick={handleOperandBttnClick}
          >
            1
          </OperandBttn>
          <OperandBttn
            state={state}
            data-cy="bttn-2"
            value="2"
            onClick={handleOperandBttnClick}
          >
            2
          </OperandBttn>
          <OperandBttn
            state={state}
            data-cy="bttn-3"
            value="3"
            onClick={handleOperandBttnClick}
          >
            3
          </OperandBttn>
          <OperatorBttn
            state={state}
            className="text-3xl"
            data-cy="bttn-subtract"
            value="-"
            onClick={handleOperatorBttnClick}
          >
            -
          </OperatorBttn>
        </div>

        {/* row 4 */}
        <div className="row-span-1 grid grid-cols-4 gap-4">
          <OperandBttn
            state={state}
            data-cy="bttn-decimal"
            value="."
            onClick={handleDecimalBttnClick}
          >
            .
          </OperandBttn>
          <OperandBttn
            state={state}
            data-cy="bttn-0"
            value="0"
            onClick={handleOperandBttnClick}
          >
            0
          </OperandBttn>
          <OperandBttn
            state={state}
            data-cy="bttn-plusMinus"
            onClick={handleToggleMinusClick}
          >
            +/-
          </OperandBttn>
          <OperatorBttn
            state={state}
            className="text-lg"
            value="*"
            data-cy="bttn-multiply"
            onClick={handleOperatorBttnClick}
          >
            X
          </OperatorBttn>
        </div>

        {/* row 5 */}
        <div className="row-span-1 grid grid-cols-4 gap-4">
          <div className="col-span-2">
            <EnterBttn
              state={state}
              onClick={handleEnterBttnClick}
              data-cy="bttn-enter"
              value="="
            >
              =
            </EnterBttn>
          </div>

          <OperatorBttn
            state={state}
            data-cy="bttn-clear"
            className="col-span-1 text-base"
            onClick={handleClearBttnClick}
          >
            CLEAR
          </OperatorBttn>
          <OperatorBttn
            state={state}
            data-cy="bttn-backspace"
            className="col-span-1 text-2xl"
            onClick={handleBackspaceBttnClick}
          >
            ⬅
          </OperatorBttn>
        </div>
      </BttnsContainer>
    </div>
  );
}

export default Calculator;

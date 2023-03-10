import { type NextPage } from "next";
import React, { useEffect, useReducer } from "react";
import Calculator from "../components/calculator";
import { useWindowSize } from "../hooks/useWindowSize";
import { action, initialState, reducer } from "../state";

import { Header } from "../styledTwComponents/header";
import { MainWrapper } from "../styledTwComponents/mainWrapper";
import { ThemeSwitch } from "../styledTwComponents/themeSwitch";
import { ThemeSwitchBg } from "../styledTwComponents/themeSwitchBg";
import { calculate } from "../utils";

const Home: NextPage = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const windowDims = useWindowSize();
  const windowsize = (function () {
    const { width = 0, height = 0 } = windowDims;

    return {
      width,
      height,
    };
  })();

  function handleThemeSwitchClick() {
    // event: React.MouseEvent<HTMLDivElement, MouseEvent>
    const currentTheme = state.themeState.$theme;
    const newTheme =
      currentTheme === "theme1"
        ? "theme2"
        : currentTheme === "theme2"
        ? "theme3"
        : "theme1";
    state.themeState.$theme = newTheme;

    dispatch({
      type: action.theme.switchTheme,
      payload: { state },
    });
  }

  useEffect(() => {
    //capture keyboard input
    function handleKeyDown(event: KeyboardEvent) {
      const eventKey = event.key;
      const operators = ["+", "-", "*", "/"];

      if (eventKey === "Enter") {
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

      //handles operators +, -, *, /
      if (operators.includes(eventKey)) {
        state.appState.operator = eventKey as "+" | "-" | "*" | "/";
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
            state.appState.history[state.appState.history.length - 1] !==
            undefined
          ) {
            const history = state.appState.history[
              state.appState.history.length - 1
            ] as string[];

            state.appState.prevOperand =
              history[4] === "Error: Division by 0"
                ? "0"
                : (history[4] as string);

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

      //handles backspace keyboard input
      if (eventKey === "Backspace") {
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

      //only number keyboard input
      if (!Number.isNaN(parseFloat(event.key))) {
        const number = parseFloat(eventKey);

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

      //handles decimal keyboard input
      if (eventKey === ".") {
        const value = eventKey;

        const currentValue =
          state.appState.nextOperand === null &&
          state.appState.operator === null
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
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  return (
    <MainWrapper state={state} windowsize={windowsize}>
      {/* left padding empty div */}
      <div className="col-span-1 row-start-1 row-end-4 "></div>

      <div className="col-span-1 row-start-2 row-end-3 grid grid-rows-[8]">
        <div className="row-span-1 mb-4 flex flex-row items-center justify-between px-6">
          <p>
            Made by <a href="https://github.com/Athma-Vasi">Athma Vasi</a>
          </p>
          <p>
            <a href="https://github.com/Athma-Vasi/calculator-react">
              View code
            </a>
          </p>
        </div>

        <Header state={state}>
          <h1 className="mt-3 text-4xl font-bold">calc</h1>
          {/* theme */}
          <div className="flex flex-col ">
            {/* theme nums */}
            <div className="flex w-full flex-row items-center justify-between gap-x-4 px-3  ">
              <p>1</p>
              <p>2</p>
              <p>3</p>
            </div>
            {/* theme switch */}
            <ThemeSwitchBg state={state}>
              <ThemeSwitch
                state={state}
                onClick={handleThemeSwitchClick}
                data-cy="theme-switch"
              ></ThemeSwitch>
            </ThemeSwitchBg>
          </div>
        </Header>

        <div className="row-span-6 mt-2">
          <Calculator state={state} action={action} dispatch={dispatch} />
        </div>
      </div>

      {/* right padding empty div */}
      <div className="col-span-1 row-start-1 row-end-4 "></div>
    </MainWrapper>
  );
};

export default Home;

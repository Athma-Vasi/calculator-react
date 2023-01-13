import tw from "tailwind-styled-components";
import type { State } from "../../typings/types";

type HistoryProps = {
  state: State;
};

const History = tw.div<HistoryProps>`
  row-span-1
  rounded-lg

  flex
  items-center
  justify-end
  pr-4

  text-4xl  
  
  
  ${({
    state: {
      themeState: { $theme },
    },
  }) =>
    $theme === "theme1"
      ? "bg-myBlue1ScreenBg text-myWhite1Text"
      : $theme === "theme2"
      ? "bg-myLtGrey2ScreenBg text-myDarkYellow2Text"
      : "bg-myDarkViolet3ToggleBg text-myLtYellow3Text"}

`;

export { History };
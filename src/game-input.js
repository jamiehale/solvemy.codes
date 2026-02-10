import { useState, useCallback } from "react";
import useEventListener from "@use-it/event-listener";
import { isLetter } from "./letters";

const useGameInput = (set, clear) => {
  const [settingLetter, setSettingLetter] = useState(null);

  const handleKeyDown = useCallback(
    (event) => {
      console.log("wat");
      if (settingLetter) {
        if (isLetter(event.key)) {
          set(settingLetter, event.key);
          setSettingLetter(null);
        } else if (event.key === " ") {
          clear(settingLetter);
          setSettingLetter(null);
        }
      } else {
        if (isLetter(event.key)) {
          setSettingLetter(event.key);
        }
      }
    },
    [settingLetter, setSettingLetter, set, clear]
  );

  useEventListener("keydown", handleKeyDown);

  return {
    settingLetter,
  };
};

export default useGameInput;

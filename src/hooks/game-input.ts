import { useState, useCallback, useEffect } from "react";
import { isLetter } from "../letters";
import type { ClearPuzzleKeyFn, SetPuzzleKeyFn } from "./puzzle-key";

const useEventListener = <K extends keyof WindowEventMap>(type: K, onEvent: (event: WindowEventMap[K]) => void) => {
  useEffect(() => {
    window.addEventListener(type, onEvent);
    return () => {
      window.removeEventListener(type, onEvent);
    };
  }, [type, onEvent]);
};

const useGameInput = (set: SetPuzzleKeyFn, clear: ClearPuzzleKeyFn) => {
  const [settingLetter, setSettingLetter] = useState<string | null>(null);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (settingLetter) {
        if (isLetter(event.key)) {
          set(settingLetter, event.key);
          setSettingLetter(null);
        } else if (event.key === " " || event.key === 'Escape') {
          clear(settingLetter);
          setSettingLetter(null);
          event.preventDefault();
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

  const handleClickLetter = useCallback((l: string) => {
    if (settingLetter) {
      clear(settingLetter);
    }
    setSettingLetter(l);
  }, [clear, settingLetter, setSettingLetter])

  return {
    settingLetter,
    handleClickLetter
  };
};

export default useGameInput;

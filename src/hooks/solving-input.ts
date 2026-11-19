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

const useSolvingInput = (set: SetPuzzleKeyFn, clear: ClearPuzzleKeyFn) => {
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (selectedLetter) {
        if (isLetter(event.key)) {
          set(selectedLetter, event.key);
          setSelectedLetter(null);
        } else if (event.key === " " || event.key === 'Escape') {
          clear(selectedLetter);
          setSelectedLetter(null);
          event.preventDefault();
        }
      } else {
        if (isLetter(event.key)) {
          setSelectedLetter(event.key);
        }
      }
    },
    [selectedLetter, setSelectedLetter, set, clear]
  );

  useEventListener("keydown", handleKeyDown);

  const handleClickLetter = useCallback((l: string) => {
    if (selectedLetter) {
      clear(selectedLetter);
    }
    setSelectedLetter(l);
  }, [clear, selectedLetter, setSelectedLetter])

  return {
    selectedLetter,
    handleClickLetter
  };
};

export default useSolvingInput;

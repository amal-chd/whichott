import React, { createContext, useContext, useState } from 'react';

type Mode = 'entertainment' | 'sports';

interface ModeContextType {
  mode: Mode;
  setMode: (mode: Mode) => void;
}

const ModeContext = createContext<ModeContextType | undefined>(undefined);

export function ModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<Mode>(() => {
    try {
      const saved = localStorage.getItem('whichott_mode');
      if (saved === 'entertainment' || saved === 'sports') {
        return saved;
      }
    } catch (e) {
      // LocalStorage might be disabled in private mode
    }
    return 'entertainment';
  });

  const setMode = (newMode: Mode) => {
    setModeState(newMode);
    try {
      localStorage.setItem('whichott_mode', newMode);
    } catch (e) {
      // Ignore write errors
    }
  };

  return (
    <ModeContext.Provider value={{ mode, setMode }}>
      {children}
    </ModeContext.Provider>
  );
}

export function useMode() {
  const context = useContext(ModeContext);
  if (context === undefined) {
    throw new Error('useMode must be used within a ModeProvider');
  }
  return context;
}

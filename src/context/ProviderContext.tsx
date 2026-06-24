import React, { createContext, useContext, useState, useEffect } from 'react';

interface ProviderContextType {
  selectedProviders: number[];
  toggleProvider: (id: number) => void;
  clearProviders: () => void;
}

const ProviderContext = createContext<ProviderContextType | undefined>(undefined);

export function ProviderProvider({ children }: { children: React.ReactNode }) {
  const [selectedProviders, setSelectedProviders] = useState<number[]>(() => {
    try {
      const stored = localStorage.getItem('whichott_providers');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('whichott_providers', JSON.stringify(selectedProviders));
  }, [selectedProviders]);

  const toggleProvider = (id: number) => {
    setSelectedProviders(prev => 
      prev.includes(id) 
        ? prev.filter(p => p !== id)
        : [...prev, id]
    );
  };

  const clearProviders = () => setSelectedProviders([]);

  return (
    <ProviderContext.Provider value={{ selectedProviders, toggleProvider, clearProviders }}>
      {children}
    </ProviderContext.Provider>
  );
}

export function useProviders() {
  const context = useContext(ProviderContext);
  if (context === undefined) {
    throw new Error('useProviders must be used within a ProviderProvider');
  }
  return context;
}

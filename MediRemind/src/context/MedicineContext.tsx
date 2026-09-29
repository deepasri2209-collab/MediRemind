import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { Medicine } from '../types';
import { SAMPLE_MEDICINES } from '../data/sampleData';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'medicines_data';

interface MedicineContextType {
  medicines: Medicine[];
  addMedicine:    (m: Medicine) => void;
  updateMedicine: (m: Medicine) => void;
  removeMedicine: (id: string) => void;
}

export const MedicineContext = createContext<MedicineContextType>({
  medicines: [],
  addMedicine:    () => {},
  updateMedicine: () => {},
  removeMedicine: () => {},
});

export const MedicineProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [medicines, setMedicines] = useState<Medicine[]>(SAMPLE_MEDICINES);

  // Hydrate from AsyncStorage on mount
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(data => {
      if (data) setMedicines(JSON.parse(data));
    });
  }, []);

  // Persist whenever medicines change
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(medicines));
  }, [medicines]);

  const addMedicine = (m: Medicine) =>
    setMedicines(prev => [m, ...prev]);

  const updateMedicine = (updated: Medicine) =>
    setMedicines(prev => prev.map(m => m.id === updated.id ? updated : m));

  const removeMedicine = (id: string) =>
    setMedicines(prev => prev.filter(m => m.id !== id));

  return (
    <MedicineContext.Provider value={{ medicines, addMedicine, updateMedicine, removeMedicine }}>
      {children}
    </MedicineContext.Provider>
  );
};

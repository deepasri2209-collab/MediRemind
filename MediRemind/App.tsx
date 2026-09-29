/**
 * Smart Medicine Reminder — MediRemind
 * React Native TypeScript App
 * Experiments 1–12 (TCE Lab)
 */
import React from 'react';
import { Provider } from 'react-redux';
import { store } from './src/store';
import { UserProvider } from './src/context/UserContext';
import { MedicineProvider } from './src/context/MedicineContext';
import AppNavigator from './src/navigation/AppNavigator';

const App: React.FC = () => (
  <Provider store={store}>
    <UserProvider>
      <MedicineProvider>
        <AppNavigator />
      </MedicineProvider>
    </UserProvider>
  </Provider>
);

export default App;

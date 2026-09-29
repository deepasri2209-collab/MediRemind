import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

import SplashScreen          from '../screens/SplashScreen';
import WelcomeScreen         from '../screens/WelcomeScreen';
import LoginScreen           from '../screens/LoginScreen';
import RegisterScreen        from '../screens/RegisterScreen';
import MedicineDetailsScreen from '../screens/MedicineDetailsScreen';
import EditMedicineScreen    from '../screens/EditMedicineScreen';
import DrawerNavigator       from './DrawerNavigator';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => (
  <NavigationContainer>
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
    >
      <Stack.Screen name="Splash"          component={SplashScreen} />
      <Stack.Screen name="Welcome"         component={WelcomeScreen} />
      <Stack.Screen name="Login"           component={LoginScreen} />
      <Stack.Screen name="Register"        component={RegisterScreen} />
      <Stack.Screen name="Main"            component={DrawerNavigator} />
      <Stack.Screen name="MedicineDetails" component={MedicineDetailsScreen} />
      <Stack.Screen name="EditMedicine"    component={EditMedicineScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;

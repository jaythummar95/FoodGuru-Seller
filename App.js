import 'react-native-gesture-handler';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Feather';

import SplashScreen from './src/screen/SplashScreen';
import LoginScreen from './src/screen/LoginScreen';
import RegisterScreen from './src/screen/RegisterScreen';
import DrawerNavigationRoutes from './src/screen/DrawerNavigatorRoutes';
import ForgotPassword from './src/screen/ForgotPassword';

const Stack = createStackNavigator();

const Auth = () => {
  // Stack Navigator for Login and Sign up Screen
  return (
    <Stack.Navigator initialRouteName="LoginScreen">
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPassword}
        options={({ navigation }) => ({
          title: 'Forgot Your Password', //Set Header Title
          headerLeft: () => (
            <TouchableOpacity onPress={() => {
              navigation.goBack()
            }}>
              <Icon name={'arrow-left'} size={25} color='#fff' style={{ marginHorizontal: 20 }} />
            </TouchableOpacity>
          ),
          headerStyle: { backgroundColor: '#307ecc' },
          headerTintColor: '#fff', //Set Header text color
          headerTitleStyle: { fontWeight: 'bold' },
        })}
      />
      <Stack.Screen
        name="RegisterScreen"
        component={RegisterScreen}
        options={({ navigation }) => ({
          title: 'Register', //Set Header Title
          headerLeft: () => (
            <TouchableOpacity onPress={() => {
              navigation.goBack()
            }}>
              <Icon name={'arrow-left'} size={25} color='#fff' style={{ marginHorizontal: 20 }} />
            </TouchableOpacity>
          ),
          headerStyle: { backgroundColor: '#307ecc' },
          headerTintColor: '#fff', //Set Header text color
          headerTitleStyle: { fontWeight: 'bold' },
        })}
      />
    </Stack.Navigator>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SplashScreen">
        {/* SplashScreen which will come once for 5 Seconds */}
        <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
          // Hiding header for Splash Screen
          options={{ headerShown: false }}
        />
        {/* Auth Navigator: Include Login and Signup */}
        <Stack.Screen
          name="Auth"
          component={Auth}
          options={{ headerShown: false }}
        />
        {/* Navigation Drawer as a landing page */}
        <Stack.Screen
          name="DrawerNavigationRoutes"
          component={DrawerNavigationRoutes}
          // Hiding header for Navigation Drawer
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
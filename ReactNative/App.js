import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LogIn from './src/Screens/LogIn'
import TabNav from './src/Navigation/TabNav';
import SignUp from './src/Screens/SignUp';
import React, { useState,useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { userContext } from './src/General/userContext';
import { I18nManager } from "react-native";
import ForgotPassword from './src/Screens/ForgotPassword';
import {LogBox,AppState} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage'

LogBox.ignoreLogs([
  "AsyncStorage has been extracted from react-native core and will be removed in a future release. It can now be installed and imported from '@react-native-async-storage/async-storage' instead of 'react-native'.",
  "ViewPropTypes will be removed from React Native. Migrate to ViewPropTypes exported from 'deprecated-react-native-prop-types'.",
  "Invalid prop textStyle of type array supplied to Cell",
  "EventEmitter.removeListener",
])

//AsyncStorage.clear();
I18nManager.forceRTL(true);
I18nManager.allowRTL(true);

const Stack = createNativeStackNavigator();

const App = () => {

  const [user, setUser] = useState({ID:null})
  useEffect(() => {
    const subscription = AppState.addEventListener('change', ()=>{})
    return () => {
      subscription.remove()
    }
   }, [])
  

  return (
    //<SafeAreaProvider>
      <userContext.Provider value={{ user, setUser }}>
        <NavigationContainer
       
        >
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen
              name="LogIn"
              component={LogIn}
            />
            <Stack.Screen
              name="Sign"
              component={SignUp}
              options={{
                headerShown: true,
                title: 'הרשמה',
                headerStyle: {
                  backgroundColor: '#52B69A',
                },
                headerTitleStyle: {
                  color: 'white',
                  fontSize: 30,
                },
                headerTitleAlign: 'center',
              }}
            />

            <Stack.Screen
              name="TabNav"
              component={TabNav}
            />
              <Stack.Screen
              name="password"
              component={ForgotPassword}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </userContext.Provider>
   // </SafeAreaProvider>

  );
}

export default App;

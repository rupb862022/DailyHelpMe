import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LogIn from './src/Screens/LogIn'
import TabNav from './src/Navigation/TabNav';
import SignUp from './src/Screens/SignUp';
import React, { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { userContext } from './src/General/userContext';
import MyFutureTasks from './src/Screens/MyFutureTasks';
import Profile from './src/Screens/Profile';
import HomePage from './src/Screens/HomePage'
const Stack = createNativeStackNavigator();

const App = () => {

  const [user, setUser] = useState(null)

  return (
    <SafeAreaProvider>
      <userContext.Provider value={{ user, setUser }}>
        <NavigationContainer >
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
              name="FutureTasks"
              component={MyFutureTasks}
              options={{
                headerShown: true,
                title: 'משימות שהשתבצתי',
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
              name="Profile"
              component={Profile}
            />
               <Stack.Screen
              name="Home"
              component={HomePage}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </userContext.Provider>
    </SafeAreaProvider>

  );
}

export default App;





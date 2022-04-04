import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LogIn from './src/Screens/LogIn'
import TabNav from './src/Navigation/TabNav';
import HomePage from './src/Screens/HomePage';
import React, { useState, useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
// constimport { UserContext } from './src/General/useContext';

const Stack = createNativeStackNavigator();

const App = () => {

 // const [user,setUser] = useState()

  return (
    <SafeAreaProvider>
      {/* <UserContext.Provider user={{user,setUser}}> */}
        <NavigationContainer >
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
            }}

          >
            <Stack.Screen
              name="TabNav"
              component={TabNav}
            />
            <Stack.Screen
              name="LogIn"
              component={LogIn}
            />
            <Stack.Screen
              name="Home"
              component={HomePage}
              options={{
                title: 'Home Title',
                headerTitleStyle: {
                  color: '#fff',
                },
                headerStyle: {
                  backgroundColor: '#833471',
                },
              }}
            />

          </Stack.Navigator>
        </NavigationContainer>
      {/* </UserContext.Provider> */}
    </SafeAreaProvider>
  );
}

//AppRegistry.registerComponent("DailyHelpMe", () => App)
export default App;




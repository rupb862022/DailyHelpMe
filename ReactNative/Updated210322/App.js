import { NavigationContainer } from  '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LogIn from './src/Screens/LogIn'
import SignUp from './src/Screens/SignUp';
import TabNav from './src/Navigation/TabNav';
import HomePage from './src/Screens/HomePage';


const Stack = createNativeStackNavigator();

const App = () => {

  return (
    <NavigationContainer >
      <Stack.Navigator
        screenOptions={{
          headerShown:false,
        }} >
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
  );
}

export default App;



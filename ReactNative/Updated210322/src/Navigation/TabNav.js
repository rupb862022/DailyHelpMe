
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import LogIn from '../Screens/LogIn'
import SignUp from '../Screens/SignUp';
import Calendar from '../Screens/Calendar';
import HomePage from '../Screens/HomePage';
import AddRequest from '../Screens/AddRequest';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { useFocusEffect } from '@react-navigation/native';

const Tab = createBottomTabNavigator();

const CostumTabBarButton = ({ children, onPress }) => {
  return (<TouchableOpacity
    activeOpacity={1}
    style={{
      top: -30,
      justifyContent: 'center',
      alignItems: 'center',
      ...styles.shadow,
    }}
    onPress={onPress}
  >
    <View style={{
      width: 70,
      height: 60,
      borderRadius: 10,
      backgroundColor: '#F8B11C',
    }}>
      {children}
    </View>
  </TouchableOpacity>)
}


const TabNav = ({ navigation }) => {

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarShowLabel: false,
        tabBarStyle: {
          showlable: false,
          backgroundColor: '#52B69A',
          height: 70,
          showlable: false,
          position: 'absolute',
          button: 25,
          left: 10,
          right: 10,
          elevation: 0,
          borderRadius: 20,
          ...styles.shadow
        },
        headerStyle: {
          backgroundColor: '#52B69A',
        },
        headerTitleStyle: {
          color: 'white',
          fontSize: 30,
        },
        headerTitleAlign: 'center',
        headerBackgroundContainerStyle:{
          borderBottomColor:'black',
          borderBottomWidth:2,
          height:100      
        },
        tabBarIcon: ({ focused, size }) => {
          switch (route.name) {
            case 'Home':
              size = focused ? 25 : 27
              return <Ionicons name='home-outline' size={size} color="white" />
            case 'Sign':
              size = focused ? 25 : 27
              return <Ionicons name='chatbubbles-outline' size={size} color="white" />
            case 'AddRequest':
              size = focused ? 33 : 36
              return <Ionicons name='add' size={size} color="white" />
            case 'Calendar':
              size = focused ? 25 : 27
              return <Ionicons name='calendar-outline' size={size} color="white" />
            case 'LogIn':
              size = focused ? 25 : 27
              return <Ionicons name='person-outline' size={size} color="white" />
            default:
              return;
          }
        }
      })
      }
    >
      <Tab.Screen name="Home" component={HomePage} options={{title:'דף הבית'}}/>
      <Tab.Screen name="Sign" component={SignUp} options={{title:'הרשמה'}} tabBarStyle= {{ display: 'none' }}/>
      <Tab.Screen name="AddRequest" component={AddRequest}
        options={{
          title:'יצירת בקשה',
          tabBarButton: (props) => (
            <CostumTabBarButton {...props} />
          )
        }}
      />
      <Tab.Screen name="Calendar" component={Calendar} options={{title:'היומן שלי'}} />
      <Tab.Screen name="LogIn" component={LogIn} />

    </Tab.Navigator >
  )
}



const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#7F5DF0',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5
  }
})


export default TabNav;
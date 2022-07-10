
import React, { useContext } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Profile from '../Screens/ProfileScreens/Profile'
import Chats from '../Screens/ChatScreens/Chats';
import Calendars from '../Screens/Calendar';
import HomePage from '../Screens/HomePage';
import AddRequest from '../Screens/AddRequest';
import MyFutureTasks from '../Screens/ProfileScreens/MyFutureTasks';
import MyPastTasks from '../Screens/ProfileScreens/MyPastTasks';
import MyPastRequests from '../Screens/ProfileScreens/MyPastRequests';
import MyRequests from '../Screens/ProfileScreens/MyRequests';
import AcceptVolunteers from '../Screens/ProfileScreens/AcceptVolunteers';
import ProfileOfUser from '../Screens/ProfileScreens/ProfileOfUser';
import EditProfile from '../Screens/ProfileScreens/EditProfile';
import TaskRating from '../Screens/ProfileScreens/TaskRating';
import ChatMesseges from '../Screens/ChatScreens/ChatMesseges';
import UnsignUser from '../Screens/UnsignedUser';
import UsersRate from '../Screens/ProfileScreens/UsersRate';
import ManagerProfile from '../Screens/ProfileScreens/ManagerProfile';
import { userContext } from '../General/userContext';

import { createNativeStackNavigator } from '@react-navigation/native-stack';


const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const ProfileStack = () => {
  return (
    <Stack.Navigator screenOptions={{
      headerStyle: {
        backgroundColor: '#52B69A',
      },
      headerTitleStyle: {
        color: 'white',
        fontSize: 24,
      },
      headerTitleAlign: 'center',

    }}>
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="FutureTasks" component={MyFutureTasks} options={{ title: "משימות שהשתבצתי" }} />
      <Stack.Screen name="PastTasks" component={MyPastTasks} options={{ title: "משימות שביצעתי" }} />
      <Stack.Screen name="PastRequests" component={MyPastRequests} options={{ title: "בקשות שפתחתי בעבר" }} />
      <Stack.Screen name="Requests" component={MyRequests} options={{ title: "בקשות פתוחות" }} />
      <Stack.Screen name="AcceptVol" component={AcceptVolunteers} options={{ title: "אישור שיבוצים" }} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
      <Stack.Screen name="ProfileOfUser" component={ProfileOfUser} />
      <Stack.Screen name="ManagerProfile" component={ManagerProfile} options={{ title: "עמוד מנהל" }} />
      <Stack.Screen name="TaskRating" component={TaskRating} options={{ title: " דירוג מתנדבים" }} />
      <Stack.Screen name="UsersRate" component={UsersRate} options={{ title: "" }} />

    </Stack.Navigator>
  )
}

const ChatStack = ({navigation}) => {
  return (
    <Stack.Navigator screenOptions={{
      headerStyle: {
        backgroundColor: '#52B69A',
      },
      headerTitleStyle: {
        color: 'white',
        fontSize: 24,
      },
      headerTitleAlign: 'center',
      headerBackTitleVisible: true
    }}>
      <Stack.Screen name="Chat" component={Chats} options={{
        title: "צ'אטים",
        initial: true,
        headerLeft: () => (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text> חזור  </Text>
          </TouchableOpacity>
        ),
      }} />
      <Stack.Screen name="ChatMesseges" component={ChatMesseges} />
    </Stack.Navigator>
  )
}

const CostumTabBarButton = ({ children, onPress }) => {
  return (<TouchableOpacity
    activeOpacity={1}
    style={{
      top: -20,
      justifyContent: 'center',
      alignItems: 'center',
      ...styles.shadow,
    }}
    onPress={onPress}
  >
    <View style={{
      width: 60,
      height: 50,
      borderRadius: 10,
      backgroundColor: '#F8B11C',
    }}>
      {children}
    </View>
  </TouchableOpacity>)
}


const TabNav = ({ navigation }) => {

  const { user } = useContext(userContext);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarHideOnKeyboard: true,
        tabBarShowLabel: false,
        tabBarStyle: {
          showlable: false,
          backgroundColor: '#52B69A',
          height: 60,
          position: 'absolute',
          marginBottom: 5,
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
        headerBackgroundContainerStyle: {
          height: 85
        },
        tabBarIcon: ({ focused, size }) => {
          switch (route.name) {
            case 'Home':
              size = focused ? 25 : 27
              return <Ionicons name='home-outline' size={size} color="white" />
            case 'ChatS':
              size = focused ? 25 : 27
              return <Ionicons name='chatbubbles-outline' size={size} color="white" />
            case 'AddRequest':
              size = focused ? 33 : 36
              return <Ionicons name='add' size={size} color="white" />
            case 'Calendar':
              size = focused ? 25 : 27
              return <Ionicons name='calendar-outline' size={size} color="white" />
            case 'ProfileS':
              size = focused ? 25 : 27
              return <Ionicons name='person-outline' size={size} color="white" />
            default:
              return;
          }
        }
      })
      }
    >
      <Tab.Screen name="Home" component={HomePage} options={{ title: 'דף הבית' }} />
      <Tab.Screen name="ChatS" component={user.ID == 0 ? UnsignUser : ChatStack} options={{ headerShown: false, tabBarStyle: { display: 'none', } }} />
      <Tab.Screen name="AddRequest" component={user.ID == 0 ? UnsignUser : AddRequest}
        options={{
          headerShown: user.ID == 0 ? false : true,
          title: 'יצירת בקשה',
          tabBarButton: (props) => (
            <CostumTabBarButton {...props} />
          )
        }}
      />
      <Tab.Screen name="Calendar" component={user.ID == 0 ? UnsignUser : Calendars} options={{ title: 'היומן שלי', headerShown: user.ID == 0 ? false : true }} />
      <Tab.Screen name="ProfileS" component={user.ID == 0 ? UnsignUser : ProfileStack} options={{ headerShown: false, }} />
    </Tab.Navigator >
  )
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: 'grey',
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
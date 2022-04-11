import { StyleSheet, Text, View } from 'react-native'
import React,{useContext} from 'react'
import { userContext } from '../General/userContext';

const MyFutureTasks = () => {

  const { user } = useContext(userContext);
  
  // user.ID,
  // user.FirstName,
  // user.LastName,
  // user.MobilePhone,
  // user.Email,
  // user.DateOfBirth,
  // user.Photo,
  // user.Gender,
  // user.City.CityName,
  // user.TokenID,
  // user.UserDescription,

  return (
    <View>
      <Text>MyFutureTasks</Text>
    </View>
  )
}

export default MyFutureTasks

const styles = StyleSheet.create({})
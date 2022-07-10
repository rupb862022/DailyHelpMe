import AsyncStorage from '@react-native-async-storage/async-storage'
import registerForPushNotificationsAsync from './registerForPushNotificationsAsync'

export const getData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(await registerForPushNotificationsAsync())
    if (jsonValue != null) {
      return JSON.parse(jsonValue)
    }
    else {
      return false;
    }
  } catch (e) {
    console.log("error with getting user from stored data");
  }
}


export const storeData = async (value) => {
  try {
    const jsonValue = JSON.stringify(value)
    await AsyncStorage.setItem(value.TokenID, jsonValue)
  } catch (e) {
    console.log("async storage didnt work :(", jsonValue)
  }
}

export const removeUser = async (token) => {
  try {
    AsyncStorage.removeItem(token)
    return true;

  } catch (e) {
    console.log("async storage didnt stop=", e)
  }
}
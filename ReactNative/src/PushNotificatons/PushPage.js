import * as Notifications from 'expo-notifications';
import React, { useState, useEffect, useRef } from 'react';
import { Text, View, Button } from 'react-native';
import registerForPushNotificationsAsync from './registerForPushNotificationsAsync';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const PushPage = ({ text,token }) => {
  const [expoPushToken, setExpoPushToken] = useState("ExponentPushToken[KybQo3JFMtoJR7QtjI49DR]");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {

    console.log("entereddddddd")
    //registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
    // This listener is fired whenever a notification is received while the app is foregrounded

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log(notification);
      setNotification(notification);
    });

    //This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
      setNotification(response.notification);
    });
    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  // Can use this function below, OR use Expo's Push Notification Tool-> https://expo.dev/notifications

  useEffect(async() => {

    const message = {
      to: expoPushToken,
      sound: 'default',
      text
    };

    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

  },[])

}


export default PushPage;
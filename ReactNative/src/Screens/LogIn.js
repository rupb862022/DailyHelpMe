
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Alert, Clipboard,ActivityIndicator} from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import ButtonCustom from '../ComponentStyle/ButtonCustom';
import registerForPushNotificationsAsync from '../General/registerForPushNotificationsAsync'
import * as Facebook from 'expo-facebook';
import { useFocusEffect } from '@react-navigation/native';
import { userContext } from '../General/userContext';
import { searchUser, logIn } from '../FetchCalls/logInAPI';
import ErrorText from '../ComponentStyle/ErrorText';
import * as Google from 'expo-google-app-auth';

const LogIn = ({ navigation }) => {

  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isImageLoading, setIsImageLoadStatus] = useState(false);
  const { user, setUser } = useContext(userContext);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);

  useEffect(() => {
    if (isLoggedin) {

    }
  }, [isLoggedin]);

  useEffect(async () => {
    // const yo = await registerForPushNotificationsAsync();
    // Alert.alert("Your token:", JSON.stringify(yo), [{ text: "copy", onPress: () => { Clipboard.setString(yo) } }, { text: "close", onPress: () => { } }]);

    searchUser(await registerForPushNotificationsAsync())
      .then(
        (result) => {
          if (result != "NO") {
            setUser(result);
            console.log("user id gotten: ", result);
          }
        },
        (error) => {
          console.log("couldnt load the user = ", error);
        });
  }, [])

  useEffect(() => {
    if (user != null) {
      navigation.navigate("TabNav")
    }
  }, [user])

  const [error, setError] = useState();
  const [Email, setEmail] = useState();
  const [Passwords, setPassword] = useState();

  facebookLogin = async () => {
    // try {
    //   await Facebook.initializeAsync({
    //     appId:"530739378550393",
    //     appName:"DailyHelpMe"});
    //   const { type, token, expires, permissions, declinedPermissions, }
    //   = await Facebook.logInWithReadPermissionsAsync({
    //   permissions: ['public_profile'],
    //   });
    //   if (type === 'success') {
    //   // Get the user's name using Facebook's Graph API
    //   const response = await fetch(`https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${token}`);
    //   let res = await response.json();
    //   setIsLoggedin(true);
    //   setUserData(data)
    //   Alert.alert('Logged in!', `Hi NAME: ${res.name}!\nEMAIL: ${res.email}\nPICTURE: ${res.picture.data.url}`);
    //  console.log(JSON.stringify(res)) 
    //   } else { type === 'cancel' }
    //   } catch ({ message }) {
    //   alert(`Facebook Login Error: ${message}`);
    //   }
      
    try {
      console.log('logged')
      await Facebook.initializeAsync({ appId: '530739378550393', });
      const { type, token, expires, permissions, declinedPermissions, }
        = await Facebook.logInWithReadPermissionsAsync({
          permissions: ['public_profile'],
        });
      if (type === 'success') {
        // Get the user's name using Facebook's Graph API
        fetch(`https://graph.facebook.com/me?access_token=${token}&fields=id,name,email,picture.height(500)`)
          .then(response => response.json())
          .then(data => {
            setIsLoggedin(true);
            setUserData(data)
          }).catch(e => console.log(e))
      } else { type === 'cancel' }
    } catch ({ message }) {
      alert(`Facebook Login Error: ${message} `);
    }
  }


  const EnterUser = () => {
    logIn({
      Email: Email,
      Passwords: Passwords
    }).then(
      (result) => {
        if (result != "user not exists") {
          setUser(result);
          console.log("logged in successfully ", result);
        }
        else {
          setError(true)
        }
      },
      (error) => {
        setError(true)
      });
  }

  const handleGoogleSignin = () => {
    setGoogleSubmitting(true);
    const config = {
      iosClientId: `1083109020432-cc20vj5lg9qgoqbr2u8s6cg2t9r61dog.apps.googleusercontent.com`,
      //androidClientId:``
      scopes: ['profile', 'email']
    };
    Google
      .logInAsync(config)
      .then((result) => {
        const { type, user } = result;

        if (type == 'success') {
          const { email, name, photoUrl } = user;
          console.log("successssssss");
          handleMessage('Google signin successful', 'SUCCESS');
          setUser({
            Email: email,
            FirstName: name,
            Photo: photoUrl,
          })
          setTimeout(() => navigation.navigate("TabNav", { email, name, photoUrl }), 1000)
        } else {
          handleMessage('Google signin was cancelled');
        }
        //setGoogleSubmitting(false);
      })
      .catch(error => {
        console.log(error);
        handleMessage('An error occurred,');
        setGoogleSubmitting(false);
      });
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.container, styles.flexStyle]}>
      <View>
        <Image style={styles.imgStyle} source={require('../../assets/LogoReg.png')} />
      </View>
      <View style={styles.inputBox}>
        <Text style={styles.textS}> אימייל </Text>
        <TextInput
          style={styles.input}
          onChangeText={text => setEmail(text)}
          value={Email}
        />
        <Text style={styles.textS}> סיסמה </Text>
        <TextInput
          style={styles.input}
          onChangeText={text => setPassword(text)}
          value={Passwords}
          secureTextEntry
        />
      </View>
      {error && <ErrorText text="אחד או יותר מהנתונים שהזנת שגוי" />}
      <ButtonCustom textInBtn={"התחברות"} func={EnterUser} />

      <View style={[styles.mediaBox, styles.flexStyle]}>
        <TouchableOpacity style={[styles.media, styles.shadowS]} onPress={() => facebookLogin()}>
          <Image style={styles.imgMedia} source={require('../../assets/Facebook.png')} />
        </TouchableOpacity>
        {!googleSubmitting && (
          <TouchableOpacity style={[styles.media, styles.shadowS]} google={true} onPress={handleGoogleSignin}>
            <Image style={styles.imgMedia} source={require('../../assets/Google.png')} />
          </TouchableOpacity>
        )}
      </View>

      <View style={[styles.lastLineBox, styles.flexStyle]}>
        <TouchableOpacity onPress={() => navigation.navigate('Sign')}>
          <Text style={styles.lastLineBtn}> הרשם </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
          setUser(0)
          navigation.navigate('TabNav')
        }}>
          <Text style={styles.lastLineBtn}> התחבר כאורח </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>

  );
};

export default LogIn;


const styles = StyleSheet.create({
  imgStyle: {
    height: 170,
    width: 270,
  },
  input: {
    height: 40,
    marginTop: 5,
    marginBottom: 15,
    borderWidth: 1,
    padding: 10,
    width: "70%",
    alignSelf: "center",
    borderRadius: 20,
    borderColor: "#C8C8C8",
  },
  container: {
    marginTop: "20%",
    textAlign: "center",
  },
  inputBox: {
    marginTop: "5%",
    width: "100%",
  },
  btnS: {
    width: "30%",
    backgroundColor: "#52B69A",
    color: "black",
    alignSelf: 'center',
    textAlign: 'center',
    padding: 10,
    borderRadius: 20,
    fontSize: 18,
    margin: 10
  },
  mediaBox: {
    flexDirection: "row",
    width: "30%"
  },
  imgMedia: {
    width: 30,
    height: 30,
  },
  lastLineBox: {
    marginTop: 30,
    flexDirection: "row",
    width: "80%"
  },
  lastLineBtn: {
    borderBottomColor: "black",
    borderBottomWidth: 1
  },
  media: {
    borderRadius: 30,
    padding: 5,
  },
  shadowS: {
    shadowColor: '#171717',
    shadowOffset: { width: -1, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 3,
  },
  flexStyle: {
    alignItems: "center",
    justifyContent: 'space-around',
  },
  textS: {
    textAlign: 'center',
  }

});

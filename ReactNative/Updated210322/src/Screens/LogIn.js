
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import React, { useState } from 'react';
import ButtonCustom from '../ComponentStyle/ButtonCustom';
// import Register from '../api/Register'

//import * as Facebook from 'expo-facebook';
import { useFocusEffect } from '@react-navigation/native';

const LogIn = ({ navigation }) => {

  useFocusEffect(() => {
    navigation.setOptions({
      tabBarStyle: { display: 'none' },
       headerShown: false
    });
  })


  const [Email, setEmail] = useState();
  const [Passwords, setPassword] = useState();

   const btnFBLogin = async () => {
    // try {
    //   console.log('logged')
    //   await Facebook.initializeAsync('1020712778540156');
    //   const { type, token, expires, permissions, declinedPermissions, }
    //     = await Facebook.logInWithReadPermissionsAsync({
    //       permissions: ['public_profile'],
    //     });
    //   if (type === 'success') {
    //     // Get the user's name using Facebook's Graph API
    //     const response = await fetch(`https://graph.facebook.com/me?fields=id,name,email,picture& access_token=${token}`);

    //     let res = await response.json();
    //     Alert.alert('Logged in!', `Hi NAME: ${res.name}!\nEMAIL: ${res.email}\nPICTURE: ${res.picture.data.url}`);
    //     Alert.alert('Logged in!', `Hi NAME: ${res.name}!\nEMAIL: ${res.email}\nPICTURE: ${res.picture}\n RES:${JSON.stringify(res)} `);

    //   } else { type === 'cancel' }
    // } catch ({ message }) {
    //   alert(`Facebook Login Error: ${message} `);
    // }
  };

  // const apiAxois = async ()=>{
  //   const response = await LogIn.post('/LogIn',{
  //     Email: Email,
  //     Passwords: Passwords
  //   })
  //   response.status == 200 ? navigation.navigator('HomePage'):console.log(response)
  // }


  const EnterUser = () => {

    console.log('Enter')

    const apiUrl = 'https://localhost:44389/api/LogIn'

    fetch(apiUrl, {
      method: 'POST',
      body: JSON.stringify({
        Email: Email,
        Passwords: Passwords
      }),
      headers: new Headers({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      })
    })
      .then(res => {
        return res.json()
      })
      .then(
        (result) => {
          console.log('yay')
        },
        (error) => {
          console.log("err post=", error);
        });
  }


  const WithGoogle = () => {

  }

  const RegisterAsGuest = () => {

  }

  const SignUp = () => {
    navigation.navigate('Sign');
  }


  return (

      <SafeAreaView style={[styles.container, styles.flexStyle]} >
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
          />
        </View>

        <ButtonCustom textInBtn={"התחברות"} func={EnterUser} />

        <View style={[styles.mediaBox, styles.flexStyle]}>
          <TouchableOpacity style={[styles.media, styles.shadowS]} onPress={() => btnFBLogin()}>
            <Image style={styles.imgMedia} source={require('../../assets/Facebook.png')} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.media, styles.shadowS]} onPress={() => WithGoogle()}>
            <Image style={styles.imgMedia} source={require('../../assets/Google.png')} />
          </TouchableOpacity>
        </View>

        <View style={[styles.lastLineBox, styles.flexStyle]}>
          <TouchableOpacity onPress={() => SignUp()}>
            <Text style={styles.lastLineBtn}> הרשם </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => RegisterAsGuest()}>
            <Text style={styles.lastLineBtn}> התחבר כאורח </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
  

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

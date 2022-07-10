
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import ButtonCustom from '../ComponentStyle/ButtonCustom';
import * as Facebook from 'expo-facebook';
import { userContext } from '../General/userContext';
import { searchUser, logIn, getUser, addUser } from '../FetchCalls/logInAPI';
import { Checkbox } from 'react-native-paper';
import { getData, storeData } from '../General/asyncStoreUser';
import registerForPushNotificationsAsync from '../General/registerForPushNotificationsAsync'
import * as Google from 'expo-auth-session/providers/google';
import { ResponseType } from 'expo-auth-session';

const LogIn = ({ navigation }) => {

  const { user, setUser } = useContext(userContext);
  const [saveUser, setSaveUser] = useState(false);
  const [logInError, setLogInError] = useState(null);
  const [Email, setEmail] = useState(null);
  const [Passwords, setPassword] = useState(null);
  const [logging, setLogging] = useState(true);

  useEffect(() => {
    const listener = navigation.addListener('focus', () => {
      setUser({ ID: null })
      setEmail(null)
      setPassword(null)
      setSaveUser(false)
      setLogging(true)

      const GetUser = async () => {
        const user = await getData();
        if (!user) {
          console.log('no data of user is saved')
          setLogging(false)
        }
        else {
          console.log('found user')
          searchUser(user.TokenID).then(
            (result) => {
              if (result != "NO") {
                result.HowSigned = user.HowSigned;
                setUser(result);
              }
              else{
                setLogging(false)
              }
            },
            (error) => {
              setLogging(false)
            });
        }
      }
      GetUser();
    })

    return listener;
  }, [navigation])


  useEffect(() => {
    if (user.ID != null) {
      let temp = user;
      temp.SavedInStorage = saveUser ? true : false;
      if(user.SavedInStorage != false){
        if (saveUser) {
          storeData(temp);
        }
      }
      setUser(temp)
      navigation.navigate("TabNav")
    }
  }, [user])


  const facebookLogin = async () => {
    try {
      setLogging(true)
      await Facebook.initializeAsync({ appId: '1020712778540156', });
      const { type, token, expires, permissions, declinedPermissions, }
        = await Facebook.logInWithReadPermissionsAsync({
          permissions: ['public_profile'],
        });
      if (type === 'success') {
        // Get the user's name using Facebook's Graph API
        fetch(`https://graph.facebook.com/me?access_token=${token}&fields=id,name,gender,email,picture.height(500)`)
          .then(response => response.json())
          .then(userDataGotten => {
            let indexOfFirst = userDataGotten.name.indexOf(' ');
            let firstName = userDataGotten.name.substring(0, indexOfFirst);
            let lastName = userDataGotten.name.substring(indexOfFirst + 1);

            getUser(userDataGotten.id).then(
              (result) => {
                if (result == "NO") {
                  addUserToDB({
                    ID: userDataGotten.id,
                    FirstName: firstName,
                    LastName: lastName,
                    Photo: userDataGotten.picture.data.url,
                    Email: userDataGotten.email,
                    HowSigned: "Facebook"
                  });
                }
                else {
                  result.HowSigned = "Facebook";
                  setUser(result);
                }
              },
              (error) => {
                console.log("נסה שוב במועד מאוחר יותר")
                setLogging(false)
              });

          }).catch(e => { setLogging(false); console.log(e) })
      } else { type === 'cancel' }
    } catch (e) {
      setLogging(false)
      alert(`Facebook Login Error: ${e} `);
    }
  }


  const EnterUser = () => {
    if (Email == null || Email == "" || Passwords == null || Passwords == "") {
      setLogInError("עליך למלא את שני השדות");
    }
    else {
      setLogging(true)
      logIn({
        Email: Email,
        Passwords: Passwords
      }).then(
        (result) => {
          console.log("result=", result)
          if (result != "user not exists" && result != "user blocked") {
            setLogInError(false)
            result.HowSigned = "Signed";
            setUser(result);
          }
          else {
            setLogInError("אחד או יותר מהנתונים שהזנת שגוי");
            setLogging(false)
          }
        },
        (error) => {
          setLogInError("אחד או יותר מהנתונים שהזנת שגוי");
          setLogging(false)
        });
    }
  }


  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: `564386225841-kmcjo8phqaajtod9bnig6693uh2kjrlb.apps.googleusercontent.com`,
    androidClientId: `564386225841-4geamg1qq6d8c6jkalu16j5hdc4pnn2c.apps.googleusercontent.com`,
    expoClientId: "564386225841-4dqfl3kufsik23duc5povh6rkk4rseps.apps.googleusercontent.com",
    responseType: ResponseType.Token,
  })


  const addUserToDB = async (res) => {
    res.TokenID = await registerForPushNotificationsAsync();

    addUser(res).then(
      (result) => {
        console.log("result=", result)
        if (result == "OK") {
          res.OpenRequests = 0,
            res.RegisteredTasks = 0,
            res.PastRequests = 0,
            res.TaskDone = 0
          setUser(res);
        }
        else {
          console.log("נסה שוב במועד מאוחר יותר")
        }
      },
      (error) => {
        console.log("נסה שוב במועד מאוחר יותר")
      });
  }

  useEffect(() => {
    try {
      if (response?.type === 'success') {
        setLogging(true)
        const { authentication } = response;
        fetch('https://www.googleapis.com/userinfo/v2/me', {
          headers: { Authorization: `Bearer ${authentication.accessToken}` }
        })
          .then(res => res.json())
          .then(res => {
            getUser(res.id).then(
              (result) => {
                if (result == "NO") {
                  addUserToDB({
                    FirstName: res.given_name,
                    LastName: res.family_name,
                    Email: res.email,
                    ID: res.id,
                    Photo: res.picture,
                    HowSigned: "Google"
                  });
                }
                else {
                  result.HowSigned = "Google";
                  setUser(result);
                }
              },
              (error) => {
                console.log("נסה שוב במועד מאוחר יותר")
                setLogging(false)
              });

          })
      }
    } catch (error) {
      console.log("נסה שוב במועד מאוחר יותר")
      setLogging(false)
    }
  }, [response]);


  if (logging) {
    return (
      <View style={{width: '100%', height: '100%',alignItems:'center',marginTop:"20%"}}>    
          <Image style={{ width: 300, height: 200,marginBottom:60,marginTop:40, }} source={require('../../assets/LogoReg.png')} />  
          <ActivityIndicator size={70}/>
          <Text style={{marginTop:20}}>טוענים עבורך נתונים</Text>
      </View>
    )
  }
  else {
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
            style={[styles.input, { marginBottom: 0 }]}
            onChangeText={text => setPassword(text)}
            value={Passwords}
            secureTextEntry
          />
          <TouchableOpacity onPress={() => navigation.navigate('password')}>
            <Text style={{ alignSelf: 'center', fontSize: 12 }}>  שכחת את הסיסמה? </Text>
          </TouchableOpacity>

        </View>

        <Text style={styles.errorText}>{logInError != null ? logInError : null} </Text>
        <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row', marginTop: 10 }}>
          <Checkbox
            status={saveUser ? 'checked' : 'unchecked'}
            color='#52B69A'
            onPress={() => {
              saveUser ? setSaveUser(false) : setSaveUser(true)
            }}
          />
          <Text>  זכור אותי </Text>
        </View>
        <ButtonCustom textInBtn={"התחברות"} func={EnterUser} />

        <View style={[styles.mediaBox, styles.flexStyle]}>
          <TouchableOpacity style={[styles.media, styles.shadowS]} onPress={() => facebookLogin()}>
            <Image style={styles.imgMedia} source={require('../../assets/Facebook.png')} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.media, styles.shadowS]} google={true} onPress={() => promptAsync()}>
            <Image style={styles.imgMedia} source={require('../../assets/Google.png')} />
          </TouchableOpacity>
        </View>

        <View style={[styles.lastLineBox, styles.flexStyle]}>
          <TouchableOpacity onPress={() => navigation.navigate('Sign')}>
            <Text style={styles.lastLineBtn}> הרשם </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            setUser({ ID: 0 })
            navigation.navigate('TabNav')
          }}>
            <Text style={styles.lastLineBtn}> התחבר כאורח </Text>
          </TouchableOpacity>

        </View>

      </ScrollView>

    );
  }
}

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
    width: "30%",
    marginTop: 30
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
  },
  errorText: {
    color: 'red',
    marginTop: 5,
    textAlign: 'center',
    fontSize: 12
  }

});

import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React, { useContext, useLayoutEffect, useState, useEffect } from 'react'
import { userContext } from '../../General/userContext';
import { MaterialCommunityIcons, FontAwesome, AntDesign } from '@expo/vector-icons';
import CrownImg from '../../Components/CrownImg';
import { removeUser } from '../../General/asyncStoreUser';
import * as Facebook from 'expo-facebook';
import {getUser} from '../../FetchCalls/profileAPI';
import { useFocusEffect } from '@react-navigation/native';

const Profile = ({ navigation }) => {

  const { user,setUser } = useContext(userContext);
  
  useLayoutEffect(() => {
    navigation.setOptions({
      title: user != 0 ? user.FirstName : null,
    });
  }, [navigation, user]);


  const getUserInfo=()=>{
    getUser(user.ID).then(
      (result) => {     
        setUser(result);
      },
      (error) => {
        console.log("couldnt get requests")
      });
  }

  useEffect(() => {
   const whenFocus =navigation.addListener('focus', () => {
      setPressMenu(false);
      getUserInfo();
    })
    return whenFocus;
  }, [navigation])


  const [pressMenu, setPressMenu] = useState(false);

  const MenuButtons = () => {

    return (
      <View style={{
        position: 'absolute', top: 5, left: 5, width: "30%",

      }}>
        <TouchableOpacity
          onPress={() => pressMenu ? setPressMenu(false) : setPressMenu(true)}
          style={[{ width: "90%", alignItems: "flex-start", }]}
        >
          <MaterialCommunityIcons name="menu" size={24} color="grey" />
        </TouchableOpacity>
        {pressMenu &&
          <View>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("ProfileOfUser", {
                  ID: user.ID,
                  FirstName: user.FirstName,
                  LastName: user.LastName
                })}
              style={[styles.row, styles.menuButtons]}
            >
              <FontAwesome name="user-circle-o" size={20} color="grey" style={{ width: "20%" }} />
              <Text style={{ fontSize: 12, marginLeft: 5, width: "80%" }} >
                לפרופיל שלי
              </Text>
            </TouchableOpacity>
            {user.UStatus == "מנהל" &&
              <TouchableOpacity
                onPress={() => navigation.navigate("ManagerProfile", {
                  ID: user.ID,
                  FirstName: user.FirstName,
                  LastName: user.LastName
                })}
                style={[styles.row, styles.menuButtons]}
              >
                <AntDesign name="profile" size={20} color="grey" style={{ width: "20%" }} />
                <Text style={{ fontSize: 12, marginLeft: 5, width: "80%" }} >
                  לפרופיל מנהל
                </Text>
              </TouchableOpacity>
            }
            <TouchableOpacity
              onPress={() => logOut()}
              style={[styles.row, styles.menuButtons]}
            >
              <MaterialCommunityIcons name="logout-variant" size={20} color="grey" style={{ width: "20%" }} />
              <Text style={{ fontSize: 12, marginLeft: 5, width: "80%" }} >
                התנתקות
              </Text>
            </TouchableOpacity>
          </View>
        }
      </View>
    )

  }

  const logOut = () => {
    
      removeUser(user.TokenID)
    

    if(user.HowSigned == "Facebook"){
      Facebook.logOutAsync();
    }
    navigation.navigate('LogIn')
  }

  return (
    <View >
      <View style={{ width: "100%", height: "18%" }}>
        <MenuButtons />

        <View
          style={{ marginTop: 15, flexDirection: 'row', justifyContent: 'center', width: '80%', marginBottom: 5, alignSelf: 'center' }}
        >
          <CrownImg rank={user.Rank} profile={true} />
          <Image resizeMode="contain" style={styles.imgStyle} source={{ uri: user.Photo }} />
        </View>
      </View>

      <View style={{ marginTop: 30 }}>
        <View style={styles.row}>
        <TouchableOpacity onPress={() => navigation.navigate("Requests")} style={styles.box}>
            <Text style={styles.title}>{user.OpenRequests}</Text>
            <Text style={styles.textTitles}>בקשות פתוחות</Text>
          </TouchableOpacity> 
          <TouchableOpacity onPress={() => navigation.navigate("FutureTasks")} style={styles.box}>
            <Text style={styles.title} >{user.RegisteredTasks}</Text>
            <Text style={styles.textTitles}>משימות שהשתבצתי</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
        <TouchableOpacity onPress={() => navigation.navigate("PastRequests")} style={styles.box} >
            <Text style={styles.title} >{user.PastRequests}</Text>
            <Text style={styles.textTitles}>בקשות שפתחתי בעבר</Text>
          </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("PastTasks")} style={styles.box}>
            <Text style={styles.title}>{user.TaskDone}</Text>
            <Text style={styles.textTitles}>משימות שביצעתי</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={[styles.row,{height:60,alignItems:"center",}]}>
        <TouchableOpacity style={styles.btnStyle} onPress={() => navigation.navigate("AcceptVol")} >
          <Text style={styles.textBtn}>אישור שיבוצים חדשים</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnStyle} onPress={() => navigation.navigate("TaskRating")}>
          <Text style={[styles.textBtn,{paddingTop:10}]}>דירוג מתנדבים</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={{ alignItems: 'center', marginTop: 30 }} onPress={() => navigation.navigate("UsersRate")}>
        <Image style={styles.imgDown} source={require('../../../assets/rank1.png')} />
        <Text> גלה מי שלושת המתנדבים המובילים </Text>
      </TouchableOpacity>

    </View>
  )
}

const styles = StyleSheet.create({
  imgDown: {
    width: 55,
    height: 30
  },
  textBtn: {
    fontSize: 13,
    textAlign: 'center',
  },
  customRatingBarStyle: {
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 10
  },
  starImgStyle: {
    width: 30,
    height: 30,
    resizeMode: 'cover'
  },
  imgStyle: {
    borderRadius: 50,
    height: 80,
    width: 80,
    alignSelf: 'center',
    marginTop: 10,
  },
  title: {
    fontSize: 22,
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    color: 'grey',
    textAlign: 'center',
    marginTop: 25,
    flexDirection: 'row',
  },
  btnStyleRating: {
    backgroundColor: "#F8B11C",
    alignSelf: 'center',
    marginTop: 20,
    borderRadius: 20,
    padding: 10,
  },
  btnStyle: {
    marginTop: 20,
    height:"100%",
    width: "35%",
    color: "black",
    backgroundColor: "#F8B11C",
    alignSelf: 'center',
    padding: 10,
    borderRadius: 20,
    shadowOffset: {
      width: 0,
      height: 8,
    },
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    fontSize: 20,
    marginTop: 20,
  },
  textTitles: {
    fontSize: 14,
    textAlign: 'center'
  },
  box: {
    shadowColor: '#171717',
    shadowOffset: { width: -2, height: 4 },
    elevation: 10,
    shadowOpacity: 0.2,
    shadowRadius: 3,
    backgroundColor: 'white',
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 5,
    width: '45%',
    marginVertical: 10,
    height: '100%',
  },
  menuButtons: {
    marginTop: 0,
    marginBottom: 5,
    width: "100%",
    padding: 1,
    alignSelf: 'flex-start'
  }
})

export default Profile;
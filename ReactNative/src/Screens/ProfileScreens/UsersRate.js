import { StyleSheet, Text, View, Image,Dimensions } from 'react-native'
import React, { useState, useEffect } from 'react'
import { getTheTop3 } from '../../FetchCalls/profileAPI';
import CrownImg from '../../Components/CrownImg'

const UsersRate = ({ navigation }) => {

  const screenHeight = Dimensions.get('screen').height;

  useEffect(() => {
    const whenFocus = navigation.addListener('focus', () => {
      getTheTop3()
        .then(
          (result) => {
            if (result.length != "NO") {
              console.log("rank-",result)
              setUsers(result)
            }
            console.log(result)
          },
          (error) => {
            consol.log("getTheTop3 not successfuly", error);
          })
    })
    return whenFocus;

  }, [navigation])


  const [users, setUsers] = useState([]);


  return (
    <View style={[styles.container]}>
      <View style={[styles.box,{height:screenHeight*0.7}]}>
        <Text style={styles.title}>שלושת חברי הקהילה המובילים</Text>
        <Text style={styles.text}>יש לך עד סוף החודש לנסות לתפוס את מקומך</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end', height: 270,marginBottom:5 }}>
          {users.length >= 2 &&
            <View>
             <CrownImg rank={2} profile={false} />
              <Image source={{ uri: users[1].Photo }} style={styles.img} />
              <View style={{ height: 20, width: "100%", backgroundColor: 'white', marginTop: 5 }} />
              <View style={{ width: 70, height: 100, borderWidth: 1, borderColor: '#fd9e26', backgroundColor: '#fd9e26', margin: 5, marginTop: -8, zIndex: -1, justifyContent: 'center' }}>
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16, alignSelf: 'center' }}>{users[1].HowMany}</Text>
              </View>
            </View>}
          {users.length >= 1 &&
            <View>
             <CrownImg rank={1} profile={false} />
              <Image source={{ uri: users[0].Photo }} style={styles.img} />
              <View style={{ height: 20, width: "100%", backgroundColor: 'white', marginTop: 5 }} />
              <View style={{ width: 70, height: 150, borderWidth: 1, borderColor: '#ca3146', backgroundColor: '#ca3146', margin: 5, marginTop: -8, zIndex: -1, justifyContent: 'center' }}>
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16, alignSelf: 'center' }}>{users[0].HowMany}</Text>
              </View>
            </View>
          }
          {users.length >= 3 &&
            <View>
              <CrownImg rank={3} profile={false} />
              <Image source={{ uri: users[2].Photo }} style={styles.img} />
              <View style={{ height: 20, width: "100%", backgroundColor: 'white', marginTop: 5 }} />
              <View style={{ width: 70, height: 50, borderWidth: 1, borderColor: '#4a5593', backgroundColor: '#4a5593', margin: 5, marginTop: -8, zIndex: -1, justifyContent: 'center' }}>
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16, alignSelf: 'center' }}>{users[2].HowMany}</Text>
              </View>
            </View>}
        </View>
        <Text style={{fontSize:10,color:"white"}}>*מספר ההתנדבויות מחושב רק לאחר השלמתן</Text>

      </View>
    </View>
  )
}

export default UsersRate

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    backgroundColor: "#52B69A",
    alignItems: "center",
    paddingTop: 40
  },
  box: {
    width: "90%",
    alignSelf: 'center',
    alignItems: 'center',
  },
  img: {
    height: 50,
    width: 50,
    alignSelf: 'center',
    borderRadius: 50,
  },
  title: {
    marginTop: 5,
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
    textAlign: 'center'
  },
  text: {
    marginTop: 20,
    color: "white",
    fontSize: 16,
    width: "80%",
    alignSelf: 'center',
    textAlign:'center'
  },
  btn: {
    marginTop: 40,
    backgroundColor: '#F8B11C',
    width: '40%',
    padding: 10,
    borderRadius: 5,
    alignSelf: 'center',
    alignItems: 'center',
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.5,
    shadowRadius: 1.8,
    elevation: 5
  },
  txtBtn: {
    fontWeight: 'bold',
  },
  btnTransparent: {
    marginTop: 20,
  }

});
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React from 'react'

const UnsignUser = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.box}>
      <Image style={styles.img} source={require('../../assets/lock.png')} />
      <Text style={styles.title}>אינך רשום לאפליקציה</Text>
      <Text style={styles.text}>בכדי לגשת לתכנים ולעזור לחברי הקהילה עליך להירשם</Text>
      <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Sign')}>
        <Text style={styles.txtBtn}>להרשמה</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btnTransparent} onPress={() => navigation.navigate('LogIn')}>
        <Text style={styles.txtBtn}>כבר משתמש רשום?</Text>
      </TouchableOpacity>
      </View>
    </View>
  )
}

export default UnsignUser


const styles = StyleSheet.create({
container: {
  height: "100%",
  width: "100%",
  backgroundColor: "#52B69A",
  alignItems: "center",
},
box:{
  width: "90%",
  alignSelf: 'center',
  alignItems: 'center',
},
img: {
  height: 120,
  width: 120,
  marginTop: "30%"
},
title: {
  marginTop: 5,
  color: "white",
  fontSize: 30,
  fontWeight: "bold",
  textAlign: 'center'
},
text: {
  marginTop: 30,
  color: "white",
  fontSize: 16,
  width:"80%",
  alignSelf: 'center'
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
btnTransparent:{
  marginTop: 20,
}

});
import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import React from 'react'

const ButtonCustom = ({ textInBtn,func }) => {
  return (
    <TouchableOpacity style={styles.btnS} onPress={()=> func()}>
      <Text style={styles.text}> {textInBtn} </Text>
    </TouchableOpacity>
  )
}

export default ButtonCustom;

const styles = StyleSheet.create({
  btnS: {
    marginTop:20,
    width: "50%",
    backgroundColor: "#52B69A",
    color: "black",
    alignSelf: 'center',
    padding: 7,
    borderRadius: 20,
    fontSize: 18,
    borderColor:"#52B69A",
    borderWidth:1,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.5,
    shadowRadius: 1.8,
    elevation: 5
  },
  text:{
    textAlign: 'center',
    fontSize:14,
    color: 'white',
  }
})
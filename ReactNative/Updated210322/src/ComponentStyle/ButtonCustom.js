import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'

const ButtonCustom = ({ textInBtn,func }) => {
  return (
    <TouchableOpacity style={styles.btnS} onPress={()=> func()}>
      <Text style={styles.text}> {textInBtn} </Text>
    </TouchableOpacity>
  )
}

export default ButtonCustom

const styles = StyleSheet.create({
  btnS: {
    width: "30%",
    backgroundColor: "#52B69A",
    color: "black",
    alignSelf: 'center',
    padding: 10,
    borderRadius: 20,
    fontSize: 18,
    margin: 10
  },
  text:{
    textAlign: 'center',
    fontSize:16,

  }
})
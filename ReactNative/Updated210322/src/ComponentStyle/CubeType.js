import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'

const CubeType = ({ type }) => {

  const [isPress, setIsPress] = useState(false);


  return (
    <TouchableOpacity onPress={() => {
      isPress ? setIsPress(false) : setIsPress(true)
    }}
      style={styles.cube}
    >
      <Text style={isPress ? styles.textPressed : styles.text} > {type} </Text>
    </TouchableOpacity>
  )
}

export default CubeType

const styles = StyleSheet.create({
  cube: {
    margin: 5,
    
  },
  text: {
    color: '#52B69A',
    backgroundColor: 'white',
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#52B69A',
    borderRadius: 15,
  },
  textPressed: {
    color: 'white',
    backgroundColor: '#52B69A',
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 15,
  }
})
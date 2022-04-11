import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'

const CubeType = ({ type, typeChose }) => {

  const [isPress, setIsPress] = useState(false);

  return (
    <TouchableOpacity onPress={() => {
      isPress ? setIsPress(false) : setIsPress(true)
      typeChose(type)
    }}
      style={isPress ? styles.cubePressed : styles.cube}
    >
      <Text style={isPress ? styles.textPressed : styles.text} > {type} </Text>
    </TouchableOpacity>
  )
}

export default CubeType

const styles = StyleSheet.create({
  cube: {
    margin: 5,
    borderRadius: 15,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#52B69A',
  },
  cubePressed: {
    margin: 5,
    borderRadius: 15,
    backgroundColor: '#52B69A',
    borderWidth: 1,
    borderColor: 'white',
  },
  text: {
    color: '#52B69A',
    width: '100%',
    padding: 10,
  },
  textPressed: {
    color: 'white',
    width: '100%',
    padding: 10,
  }
})
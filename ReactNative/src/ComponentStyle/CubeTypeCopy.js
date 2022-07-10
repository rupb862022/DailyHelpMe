import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'

const CubeTypeCopy = ({ type, typeChose,color,taskNumber }) => {

 
  const [isPress, setIsPress] = useState(color);

  return (
    <TouchableOpacity onPress={() => {
      isPress ? setIsPress(false) : setIsPress(true)
      typeChose(taskNumber,type)
    }}
      style={isPress ? styles.cubePressed : styles.cube}
    >
      <Text style={isPress ? styles.textPressed : styles.text} > {type} </Text>
    </TouchableOpacity>
  )
}

export default CubeTypeCopy

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
    padding: 7,
  },
  textPressed: {
    color: 'white',
    width: '100%',
    padding: 7,
  }
})
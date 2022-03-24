import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const ErrorText = ({ text }) => {
  return (
    <View style={styles.boxText}>
      <Text style={styles.textError}> {text} </Text>
    </View>
  )
}

export default ErrorText

const styles = StyleSheet.create({
  textError: {
    color: 'red',
    fontSize:12,
    marginTop:-10,
  },
  boxText: {
    width: '80%',
  }
})
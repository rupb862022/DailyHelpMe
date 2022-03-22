import { StyleSheet, Text, View } from 'react-native'
import React from 'react';
import ToggleSwitch from 'toggle-switch-react-native'
import { Ionicons, Feather } from '@expo/vector-icons';

const ToggleStyle = ({func,state,text}) => {
  return (
    <View style={styles.toggleBox}>
    <ToggleSwitch
      isOn={state}
      onColor="#52B69A"
      offColor="black"
      label={text}
      labelStyle={{ color: "black", fontWeight: "900" }}
      size="medium"
      onToggle={() => {
        state ? func(false) : func(true)
      }}
      icon={state ?
        <Ionicons name="checkmark" size={15} color="#52B69A" />
        : <Feather name="x" size={15} color="black" />
      }
    />
  </View>
  )
}

export default ToggleStyle

const styles = StyleSheet.create({
  toggleBox: {
    alignItems: 'flex-end',
    marginRight: '9%',
  },
})
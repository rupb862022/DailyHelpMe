import { StyleSheet, Text, View, SafeAreaView } from 'react-native'
import React, { useState } from 'react'
import InputStyle from '../ComponentStyle/InputStyle'
import { Ionicons, Feather } from '@expo/vector-icons';
import ToggleStyle from '../ComponentStyle/ToggleStyle';
import { List } from 'react-native-paper';
import Accordion from 'react-native-collapsible/Accordion';
import Collapsible from 'react-native-collapsible';

const AddRequest = () => {

  const [privateR, setPrivateR] = useState(false)

  const [nameOfRequest, setNameOfRequest] = useState("שם משימה")

  const [expanded, setExpanded] = useState(true);

  const handlePress = () => setExpanded(!expanded);

  return (
    <SafeAreaView style={styles.container}>
      <InputStyle placeHolderText="שם הבקשה" />
      <ToggleStyle state={privateR} text=" הפוך בקשה לאישית" func={setPrivateR} />
      <View style={styles.accordionsBox}>
        <Collapsible >
        
        </Collapsible>
      </View>
    </SafeAreaView>
  )
}

export default AddRequest

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    alignItems: 'flex-end',
  },
  accordionsBox: {
    width: '100%',
  }

})
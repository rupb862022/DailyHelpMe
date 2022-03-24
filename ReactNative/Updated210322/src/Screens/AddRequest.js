import { StyleSheet, View, SafeAreaView } from 'react-native'
import React, { useState } from 'react'
import InputStyle from '../ComponentStyle/InputStyle'
import ToggleStyle from '../ComponentStyle/ToggleStyle';


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
        <ToggleStyle state={privateR} text=" שם משימה " func={setPrivateR} />
        <View style={styles.listBox}>
          <List.Section title="בקשות פתוחות להתנדבות" style={styles.title1}>
            <List.Accordion
              title="Uncontrolled Accordion"
              left={props => <List.Icon {...props} icon="folder" />}>
              <List.Item title="First item" />
              <List.Item title="Second item" />
            </List.Accordion>

            <List.Accordion
              title="Controlled Accordion"
              left={props => <List.Icon {...props} icon="folder" />}
              expanded={expanded}
              onPress={handlePress}>
              <List.Item title="First item" />
              <List.Item title="Second item" />
            </List.Accordion>
          </List.Section>
        </View>

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
  listBox: {
    width: '100%',
  },



})
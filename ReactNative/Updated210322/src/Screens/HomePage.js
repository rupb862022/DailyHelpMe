import { StyleSheet, Text, View } from 'react-native'
import React, { useState, useEffect} from 'react';
import { List } from 'react-native-paper';

const HomePage = () => {

  const [expanded, setExpanded] = useState(true);

  const handlePress = () => setExpanded(!expanded);

  useEffect(()=> {
    const apiUrl = 'https://localhost:44389/api/HomePage/'

    fetch(apiUrl, {
      method: 'POST',
      body: JSON.stringify({
        ID: 284045452,
      }),
      headers: new Headers({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      })
    })
      .then(res => {
        return res.json()
      })
      .then(
        (result) => {
          console.log('yay',result)
        },
        (error) => {
          console.log("err post=", error);
        });
  },[]
  )


  return (
    <View style={styles.container}>
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
  )
}

export default HomePage

const styles = StyleSheet.create({
  container: {

  }
})
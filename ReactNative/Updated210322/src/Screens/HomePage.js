import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList, ScrollView, VirtualizedList  } from 'react-native'
import React, { useState, useEffect } from 'react';
import { List } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, SafeAreaProvider, InitialWindowMetrics } from "react-native-safe-area-context";

const HomePage = () => {

  const [expanded, setExpanded] = useState(true);

  const handlePress = () => setExpanded(!expanded);

  const [request, setRequest] = useState([{
    RequestCode: '123',
    RequestName: 'קשיש זקוק לעזרה',
    VolunteerType: [
      {
        VolunteerName: 'ביקורים'
      },
      {
        VolunteerName: 'סיוע לקשישים'
      },
      {
        VolunteerName: 'קניות'
      }],
    City: 'נתניה',
    StartDate: '06/02/22',
    EndDate: '08/02/22',
    Image: '',
    Tasks: [
      {
        TaskNumber: '1',
        TaskName: 'הבאת קניות מהסופר',
        TaskHour: '15:00',
        StartDate: '06/02/22',
        EndDate: '06/02/22',
        TaskDescription: 'סיוע לאדם מבוגר בהבאת הקניות מהסופר',
        Confirmation: true,
      },
      {
        TaskNumber: '2',
        TaskName: 'ביקור של שעה',
        TaskHour: '18:00',
        StartDate: '06/02/22',
        EndDate: '08/02/22',
        TaskDescription: 'נשמח אם יגיעו לשמח את סבא כשאנחנו בחו"ל',
        Confirmation: true,
      },
    ]
  },
  {
    RequestCode: '124',
    RequestName: 'קשיש זקוק מאוד לעזרה',
    VolunteerType: [
      {
        VolunteerName: 'עזרה'
      },
      {
        VolunteerName: 'כלום'
      },
      {
        VolunteerName: 'שום דבר'
      }],
    City: 'נתניה',
    StartDate: '06/02/22',
    EndDate: '08/02/22',
    Image: '',
    Tasks: [
      {
        TaskNumber: '1',
        TaskName: 'הבאת קניות מהסופר',
        TaskHour: '15:00',
        StartDate: '06/02/22',
        EndDate: '06/02/22',
        TaskDescription: 'סיוע לאדם מבוגר בהבאת הקניות מהסופר',
        Confirmation: true,
      },
      {
        TaskNumber: '2',
        TaskName: 'ביקור של שעה',
        TaskHour: '18:00',
        StartDate: '06/02/22',
        EndDate: '08/02/22',
        TaskDescription: 'נשמח אם יגיעו לשמח את סבא כשאנחנו בחו"ל',
        Confirmation: true,
      },
    ]
  },

  ]);

  useEffect(() => {
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
          setRequest(result);
          console.log('yay', result)
        },
        (error) => {
          console.log("err post=", error);
        });
  }, [])



  const renderItem = ({ item }) => (
    <List.Accordion
      style={{
        width: '100%',
      }}
      title={
        <View>
          <View style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}>
            <View>
              <Text style={styles.title}> {item.RequestName} </Text>
              <Types types={item.VolunteerType} />
            </View>
            <View>
              <Image style={styles.img} source={require('../../assets/Facebook.png')} />
            </View>
          </View>
          <View style={{
            flexDirection: 'row',
            width: '80%',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 15,
          }}>
            <Text style={{ flex: 5 }}> {item.StartDate} - {item.EndDate} </Text>
            <Text style={{ flex: 1 }}>    {item.City} </Text>
            <Ionicons style={{ flex: 1 }} name="location" size={24} color="#F8B11C" />
          </View>
        </View>
      }
      titleStyle={{
        alignSelf: 'flex-end'
      }}
      right={() => { null }} >
      <Tasks tasks={item.Tasks} />
    </List.Accordion>
  )

  const Types = ({ types }) => (
    <View >
      <FlatList
        style={styles.row}
        data={types}
        keyExtractor={item => item.VolunteerName}
        renderItem={({ item }) => {
          return <Text style={styles.text}> {item.VolunteerName} </Text>
        }}
      />
    </View>
  )

  const Tasks = ({ tasks }) => (
    <FlatList
      data={tasks}
      listKey={(item, index) => (item.TaskNumber + index).toString()}
      keyExtractor={(item, index) => (index).toString()}
      renderItem={({ item }) => {
        return (
          <List.Item
            style={{backgroundColor:'#dedfe1'}}
            title={item.TaskName}
            description={
              <View style={{ width: '100%', justifyContent: 'center' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text> תאריך {item.EndDate} </Text>
                  <Text>  בשעה {item.TaskHour} </Text>
                </View>
                <View >
                  <Text style={{ alignSelf: 'flex-end', marginTop: 5, }}>  {item.TaskDescription} </Text>
                </View>
                <View>
                  <TouchableOpacity style={styles.btnS} >
                    <Text style={{ textAlign: 'center' }}>  שיבוץ </Text>
                  </TouchableOpacity>
                </View>
              </View>
            }
            descriptionStyle={{
              width: '100%',
              textAlign: 'right',
            }}
            titleStyle={{
              fontWeight: 'bold',
              fontSize: 16,
              width: '100%',
              textAlign: 'right'
            }}
          />)
      }}
    />
  )

  return (
    <SafeAreaProvider  style={styles.container}>
      <View >
        <List.Section>
          <FlatList          
            scrollEnabled={true}     
            data={request}
            renderItem={renderItem}
            keyExtractor={item => item.RequestCode}
            ItemSeparatorComponent={() => {
              return <View style={{ backgroundColor: "#52B69A", height: 5 }} />
            }}
          />
        </List.Section>
      </View>
    </SafeAreaProvider >
  )

}

export default HomePage

const styles = StyleSheet.create({
  container: {
   
    width: '100%',
    height: '85%',
    alignSelf: 'flex-start',
  
  },
  row: {
    flexDirection: 'row',
  },
  img: {
    borderRadius: 40,
    height: 50,
    width: 50,
    alignSelf: 'flex-end',
    marginLeft: 20
  },
  title: {
    fontSize: 22,
    textAlign: 'right'
  },
  text: {
    fontSize: 14,
    color: 'grey',
    textAlign: 'right'
  },
  btnS: {
    marginTop: 20,
    width: "60%",
    backgroundColor: "#52B69A",
    color: "black",
    alignSelf: 'center',
    padding: 7,
    borderRadius: 20,
    fontSize: 18,
    borderColor: 'black',
    borderWidth: 1,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.5,
    shadowRadius: 1.8,
    elevation: 4,
    alignSelf: 'center',
  },
})
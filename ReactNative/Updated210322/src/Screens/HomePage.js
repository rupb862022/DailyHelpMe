import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react';
import { List } from 'react-native-paper';
import { backgroundColor } from 'react-native/Libraries/Components/View/ReactNativeStyleAttributes';
import { Ionicons } from '@expo/vector-icons';

const HomePage = () => {

  const [expanded, setExpanded] = useState(true);

  const handlePress = () => setExpanded(!expanded);

  const [request, setRequest] = useState({

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
        TaskName: 'הבאת קניות מהסופר',
        TaskHour: '15:00',
        StartDate: '06/02/22',
        EndDate: '06/02/22',
        TaskDescription: 'סיוע לאדם מבוגר בהבאת הקניות מהסופר',
        Confirmation: true,
      },
      {
        TaskName: 'ביקור של שעה',
        TaskHour: '18:00',
        StartDate: '06/02/22',
        EndDate: '08/02/22',
        TaskDescription: 'נשמח אם יגיעו לשמח את סבא כשאנחנו בחו"ל',
        Confirmation: true,
      },
    ]
  });

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
 

  return (
    <View style={styles.container}>
      <List.Section >
        <List.Accordion
          title={
            <View>
              <View style={{
                flexDirection: 'row',
                width: '100%',
                justifyContent: 'flex-end',
                alignItems: 'center',
              }}>
                <View>
                  <Text style={styles.title}> {request.RequestName} </Text>
                  <Text style={styles.text}> {request.VolunteerType[0].VolunteerName} | {request.VolunteerType[1].VolunteerName} | {request.VolunteerType[2].VolunteerName}</Text>
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
                <Text style={{ flex: 5 }}> {request.StartDate} - {request.EndDate} </Text>
                <Text style={{ flex: 1 }}>    {request.City} </Text>
                <Ionicons style={{ flex: 1 }} name="location" size={24} color="#F8B11C" />
              </View>
            </View>
          }
          titleStyle={{
            alignSelf: 'flex-end'
          }}
          right={() => { null }} >
          <List.Item
            title={request.Tasks[0].TaskName}
            description={
              <View style={{ width: '100%', justifyContent: 'center' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text > תאריך {request.Tasks[0].EndDate} </Text>
                  <Text >  בשעה {request.Tasks[0].TaskHour} </Text>
                </View>
                <View >
                  <Text style={{ alignSelf: 'flex-end', marginTop: 5, }}>  {request.Tasks[0].TaskDescription} </Text>
                </View>
                <View>
                  <TouchableOpacity style={styles.btnS} >
                    <Text style={{ textAlign: 'center' }}>  שיבוץ </Text>
                  </TouchableOpacity>
                </View>
              </View>
            }
            descriptionStyle={{
              width:'100%',
              textAlign: 'right',
            }}
            titleStyle={{        
              fontWeight: 'bold',
              fontSize:16,
              width:'100%',
              textAlign: 'right'
            }}
          />
          <List.Item title={request.Tasks[1].TaskName}
            description={
              <>
                <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                  <Text> תאריך {request.Tasks[1].EndDate} </Text>
                  <Text>  בשעה {request.Tasks[1].TaskHour} </Text>
                </View>
                <View>
                  <Text>  {request.Tasks[1].TaskDescription} </Text>
                </View>
              </>
            }
            descriptionStyle={{
              width: '100%',
              textAlign: 'right',
            }}
            titleStyle={{
              alignSelf: 'flex-end'
            }}
          />

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
    justifyContent: 'flex-end',
    width:'100%',
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
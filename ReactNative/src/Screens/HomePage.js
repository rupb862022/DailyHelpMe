import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList, ScrollView, VirtualizedList } from 'react-native'
import React, { useState, useEffect } from 'react';
import { List } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import {SafeAreaProvider } from "react-native-safe-area-context";
import moment from 'moment';
import { getRequests, signToTaskConfirm, signToTask, getTypesName, getRequestsSorted, cancelTask } from '../FetchCalls/homePageAPI';
import SelectDropdown from 'react-native-select-dropdown'
import * as Location from 'expo-location';
import { Button, Paragraph, Dialog, Portal, Provider } from 'react-native-paper';


const HomePage = ({ navigation }) => {

  const ID = "208445452"
  const [request, setRequest] = useState([])

  const [typeList, setListOfTypes] = useState([])

  const [locationList, setLocationList] = useState(["בחר", "באיזור שלי", "בעיר שלי"])

  const [sortBy, setSortBy] = useState({
    sortByType: null,
    sortByLocation: null
  })

  const [userLocation, setUserLocation] = useState({
    Lat: null,
    Lng: null,
    CityName: null,
  })


  const [visible, setVisible] = useState(false);

  const showDialog = () => setVisible(true);

  const hideDialog = () => setVisible(false);

  const [textForDialog, setTextForDialog] = useState({
    textBody: "",
    textTitle: "",
  });

  useEffect(() => {
    getTypesName().then(
      (result) => {
        console.log("get types in Home Page successfully: ", result)
        setListOfTypes(result)
      },
      (error) => {
        console.log("get types in home page Failed=", error);
      });

    getRequests(ID).then(
      (result) => {
        setRequest(result);
      },
      (error) => {
        console.log("get request didnt work = ", error);
      });
  }, [])

  useEffect(async () => {
    // console.log(location)
    // let reverseGC = await Location.reverseGeocodeAsync(location.coords);
    // console.log("yoooo", reverseGC);

    console.log("hiiiiiiiiiiiiiiiiiiiiiiiiii");
    var config;
    if (sortBy.sortByLocation == "בחר" && sortBy.sortByType == "כל התחומים") {
      getRequests(ID).then(
        (result) => {
          setRequest(result);
        },
        (error) => {
          console.log("get request didnt work = ", error);
        });
      return;
    }
    if (sortBy.sortByLocation == "באיזור שלי") {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
       setUserLocation({
        CityName: null,
        Lat: location.coords.latitude,
        Lng: location.coords.longitude
      });

      config = {
        CurrentLocation: {
          Lat: userLocation.Lat,
          Lng: userLocation.Lng,
          CityName: null,
        },
        VolunteerCode: 0,
        ID: ID,
      }
    }
    else if ("בעיר שלי") {
      config = {
        CurrentLocation: {
          Lat: null,
          Lng: null,
          CityName: "נתניה",
        },
        VolunteerCode: 0,
        ID: ID,
      }
    }
    else if (sortBy.sortByType != null) {
      config = {
        CurrentLocation: {
          Lat: null,
          Lng: null,
          CityName: "נתניה",
        },
        VolunteerName: sortBy.sortByType,
        ID: ID,
      }
    }

    getRequestsSorted(config)
      .then(
        (result) => {
          console.log("get sorted requests in Home Page successfully: ", result)
          setRequest(request)
        },
        (error) => {
          console.log("get sorted request Failed=", error);
        });

  }, [sortBy]);

  const signUserToTask = (Task) => {
    console.log("tried to sign!")
    console.log(Task);

    if (Task.Status == "sign") {
      if (!Task.Confirmation) {
        signToTask({
          ID: ID,
          TaskNumber: Task.TaskNumber,
        }).then(
          (result) => {
            console.log("Signed To Task Without confirmation successfully: ", result)
            Task.Status = "cancel"
            showDialog()
            setTextForDialog({ textTitle: "שיבוצך בוצע בהצלחה", textBody: `שיבוצך למשימה ${Task.TaskName} בוצע בהצלחה` })
          },
          (error) => {
            console.log("Signed To Task Without confirmation error=", error);
          });
      }
      else {
        console.log(moment())
        signToTaskConfirm({
          ID: ID,
          TaskNumber: Task.TaskNumber,
          SignToTaskTime: moment()
        }).then(
          (result) => {

            console.log("Signed To Task With confirmation: ", result)

            Task.Status = "wait"
            console.log("status", Task.Status)
            showDialog()
            setTextForDialog({ textTitle: "שיבוצך בוצע בהצלחה", textBody: `שיבוצך למשימה ${Task.TaskName} ממתין לאישור` })
            return;

          },
          (error) => {
            console.log("Signed To Task with confirmation error=", error);
          });
      }
    }
    else {
      cancelTask({
        ID: ID,
        TaskNumber: Task.TaskNumber,
      }).then(
        (result) => {
          console.log("cancel registration: ", result)
          console.log(result)
          if (result == "OK") {
            Task.Status = "sign"
            showDialog()
            setTextForDialog({textTitle:"שיבוצך בוטל בהצלחה",textBody:`שיבוצך למשימה ${Task.TaskName} בוטל בהצלחה`})
          }
         
        },
        (error) => {
          console.log("Signed To Task with confirmation error=", error);
        });
    }
  }


  const renderItem = ({ item }) => (
    <List.Accordion
      title={
        <View>
          <View style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}>
            <View>
              <Text style={styles.title}> {item.RequestName} </Text>
              <Types types={item.TypesList} />
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
            <Text style={{ flex: 5 }}> {moment(item.StartDate).format("DD-MM-YYYY")} - {moment(item.EndDate).format("DD-MM-YYYY")} </Text>
            <Text style={{ flex: 1 }}>    {item.City} </Text>
            <Ionicons style={{ flex: 1 }} name="location" size={24} color="#F8B11C" />
          </View>
        </View>
      }
      titleStyle={{
        alignSelf: 'flex-start'
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
        keyExtractor={(item, index) => (index).toString()}
        renderItem={({ item }) => {
          return <Text style={styles.text}> {item} </Text>
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
            style={{ backgroundColor: '#dedfe1' }}
            title={item.TaskName}
            description={
              <View style={{ width: '100%', }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                  <Text> תאריך {moment(item.StartDate).format("DD-MM-YYYY")} </Text>
                  <Text>  בשעה {item.TaskHour} </Text>
                </View>
                <View >
                  <Text style={{ alignSelf: 'flex-start', marginTop: 5, }}>  {item.TaskDescription} </Text>
                </View>
                <View style={{ width: '100%', justifyContent: 'center' }}>
                  <TouchableOpacity style={[styles.btnStyle,
                  {
                    backgroundColor: item.Status != "wait" ? "#52B69A" : "#808080",
                  }]}
                    onPress={() => signUserToTask(item)}
                  >
                    <Text style={{ textAlign: 'center' }}>  {item.Status != "wait" ? "שיבוץ" : "בטל שיבוץ"} </Text>
                  </TouchableOpacity>

                  {item.Status != "wait" ? null : <View style={{ flexDirection: 'row', marginTop: 3, alignSelf: 'center' }}>
                    <Ionicons name="timer-outline" size={24} color="#F8B11C" />
                    <Text> ממתין לאישור שיבוץ </Text>
                  </View>}
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
    <SafeAreaProvider style={styles.container}>
      <View style={styles.selectedListBox}>
        <SelectDropdown
          data={typeList}
          defaultButtonText="בחירת תחום עניין"
          onSelect={(selectedItem, index) => {
            console.log("selected: ", selectedItem)
            setSortBy({
              sortByType: selectedItem,
              sortByLocation: null
            })
          }}
          buttonTextAfterSelection={(selectedItem, index) => {
            return selectedItem
          }}
          rowTextForSelection={(item, index) => {
            return item
          }}
        />
        <SelectDropdown
          data={locationList}
          defaultButtonText="בחירת מיקום"
          onSelect={(selectedItem, index) => {
            setSortBy({
              sortByType: null,
              sortByLocation: selectedItem
            })
          }}
          buttonTextAfterSelection={(selectedItem, index) => {
            return selectedItem
          }}
          rowTextForSelection={(item, index) => {
            return item
          }}
        />
      </View>
      <View >
        <List.Section>
          <FlatList           
            initialNumToRender={request.length}
            scrollEnabled={true}
            data={request}
            renderItem={renderItem}
            keyExtractor={item => item.RequestCode}
            listKey={"list1s"}
            ItemSeparatorComponent={() => {
              return <View style={{ backgroundColor: "#52B69A", height: 5 }} />
            }}
          />
        </List.Section>
        <Provider>
        <View>
          <Portal>
            <Dialog visible={visible} onDismiss={hideDialog}>
              <Dialog.Title>{textForDialog.textTitle}</Dialog.Title>
              <Dialog.Content>
                <Paragraph>{textForDialog.textBody}</Paragraph>
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={hideDialog}>סגור</Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
        </View>
      </Provider>
      </View>
    </SafeAreaProvider >
  )

}

export default HomePage

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '85%',
    alignSelf: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  img: {
    borderRadius: 40,
    height: 50,
    width: 50,
    alignSelf: 'flex-start',
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
  btnStyle: {

    marginTop: 20,
    textAlign: 'center',
    width: "50%",
    color: "black",
    alignSelf: 'center',
    padding: 7,
    borderRadius: 20,
    fontSize: 14,
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
  selectedListBox: {
    flexDirection: 'row',
    marginTop: 10,
  }
})
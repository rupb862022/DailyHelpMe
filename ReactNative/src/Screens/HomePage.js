import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList, Dimensions } from 'react-native'
import React, { useState, useEffect, useContext } from 'react';
import { List } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
//import {SafeAreaProvider } from "react-native-safe-area-context";
import moment from 'moment';
import { getRequests, signToTaskConfirm, signToTask, getTypesName, getRequestsSorted, cancelTask } from '../FetchCalls/homePageAPI';
import SelectDropdown from 'react-native-select-dropdown'
import * as Location from 'expo-location';
import { Button, Paragraph, Dialog, Portal, Provider } from 'react-native-paper';
import { userContext } from '../General/userContext';


const HomePage = ({ navigation }) => {

  const { user } = useContext(userContext);

  const [request, setRequest] = useState([])

  const [typeList, setListOfTypes] = useState([])
  const [locationList, setLocationList] = useState(["כל הארץ", "באיזור שלי", "בעיר שלי"])

  const [sortBy, setSortBy] = useState({
    sortByType: "כל התחומים",
    sortByLocation: "כל הארץ",
  });

  const screenWidth = Dimensions.get('screen').width;
  const screenHeigth = Dimensions.get('screen').height;

  const [visible, setVisible] = useState(false);
  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  const [textForDialog, setTextForDialog] = useState({
    textBody: "",
    textTitle: "",
  });

  const getRequestNoSort = () => {
    getRequests(user.ID).then(
      (result) => {
        if (result != "Empty") {
          setRequest(result);

          return;
        }
      },
      (error) => {
        console.log("get request didnt work = ", error);
      });
  }

  useEffect(() => {


  }, [request])

  useEffect(() => {
    getTypesName().then(
      (result) => {
        setListOfTypes(result);
        return;
      },
      (error) => {
        console.log("get types in home page Failed=", error);
      });
  }, [])

  const [sortedListBy, setSortedListBy] = useState({
    CurrentLocation: {
      Lat: null,
      Lng: null,
      CityName: null,
    },
    VolunteerName: null,
    ID: user.ID,
  })

  useEffect(async () => {
    setTimeout(async () => {
      var config;
      if (sortBy.sortByLocation === "כל הארץ" && sortBy.sortByType === "כל התחומים") {
        getRequestNoSort();
        return;
      }

      if (sortBy.sortByType === "כל התחומים") {
        if (sortBy.sortByLocation === "באיזור שלי") {
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            return;
          }
          let location = await Location.getCurrentPositionAsync({});

          config = {
            CurrentLocation: {
              Lat: location.coords.latitude,
              Lng: location.coords.longitude,
              CityName: null,
            },
            VolunteerName: "none",
            ID: user.ID,
          }
        }
        else if (sortBy.sortByLocation == "בעיר שלי") {
          config = {
            CurrentLocation: {
              Lat: null,
              Lng: null,
              CityName: user.CityName,
            },
            VolunteerName: "none",
            ID: user.ID,
          }
        }
      }
      else {
        config = {
          CurrentLocation: {
            Lat: null,
            Lng: null,
            CityName: null,
          },
          VolunteerName: sortBy.sortByType,
          ID: user.ID,
        }
      }

      //   setSortedListBy({
      //     ...sortedListBy,
      //     VolunteerName: "none",
      //   })
      // }

      // if (sortBy.sortByLocation === "באיזור שלי") {
      //   let { status } = await Location.requestForegroundPermissionsAsync();
      //   if (status !== 'granted') {
      //     return;
      //   }
      //   let location = await Location.getCurrentPositionAsync({});
      //   config = {
      //     CurrentLocation: {
      //       Lat: location.coords.latitude,
      //       Lng: location.coords.longitude,
      //       CityName: null,
      //     },
      //     VolunteerName: sortBy.sortByType !== "כל התחומים" ? sortBy.sortByType : null,
      //     ID: user.ID,
      //   }
      //   // setSortedListBy({
      //   //   ...sortedListBy,
      //   //   CurrentLocation: {
      //   //     Lat: location.coords.latitude,
      //   //     Lng: location.coords.longitude,
      //   //     CityName: null,
      //   //   },
      //   // })
      // }
      // else if (sortBy.sortByLocation == "בעיר שלי") {
      //   setSortedListBy({
      //     ...sortedListBy,
      //     CurrentLocation: {
      //       Lat: null,
      //       Lng: null,
      //       CityName: user.CityName,
      //     },
      //   })
      // }

      //       else if (sortBy.sortByLocation === "כל הארץ") {
      //   setSortedListBy({
      //     ...sortedListBy,
      //     CurrentLocation: {
      //       Lat: null,
      //       Lng: null,
      //       CityName: null,
      //     },
      //   })
      // }

      getRequestsSorted(config)
        .then(
          (result) => {
            if (result == null) {
              ///להוסיף משהו להציג במידה ולא היו בקשות
              return;
            }
            setRequest(result);
          },
          (error) => {
            console.log("get sorted request Failed=", error);
          });
    }, 1000)

  }, [request, sortBy]);


  const signUserToTask = (Task) => {
    console.log("tried to sign!")
    console.log(Task);

    if (Task.Status == "sign") {
      if (!Task.Confirmation) {
        signToTask({
          ID: user.ID,
          TaskNumber: Task.TaskNumber,
          RegistereStatus: "טרם בוצע"
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
          ID: user.ID,
          TaskNumber: Task.TaskNumber,
          SignToTaskTime: moment()
        }).then(
          (result) => {
            console.log("Signed To Task With confirmation: ", result)
            Task.Status = "wait"
            showDialog()
            setTextForDialog({ textTitle: "  בקשת השיבוץ התקבלה ", textBody: `שיבוצך למשימה ${Task.TaskName} ממתין לאישור` })
            return;
          },
          (error) => {
            console.log("Signed To Task with confirmation error=", error);
          });
      }
    }
    else {
      cancelTask({
        ID: user.ID,
        TaskNumber: Task.TaskNumber,
      }).then(
        (result) => {
          console.log("cancel registration: ", result)
          console.log(result)
          if (result == "OK") {
            Task.Status = "sign"
            showDialog()
            setTextForDialog({ textTitle: "שיבוצך בוטל בהצלחה", textBody: `שיבוצך למשימה ${Task.TaskName} בוטל בהצלחה` })
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
        <View style={{
          height: screenHeigth * 0.13,
          width: screenWidth * 0.8,
        }}>
          <View style={{
            flexDirection: 'row',

          }}>
            <View style={{ marginRight: 10 }}>
              <Image style={styles.img} source={{ uri: "https://www.attendit.net/images/easyblog_shared/July_2018/7-4-18/b2ap3_large_totw_network_profile_400.jpg" }} />
            </View>
            <View style={{ alignItems: 'flex-start' }}>
              <Text style={styles.title}> {item.RequestName} </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {item.TypesList != undefined ? <Types types={item.TypesList} /> : null}
              </View>
            </View>
          </View>
          <View style={{
            flexDirection: 'row',
            marginTop: 5,
            justifyContent: 'flex-start',
            width: '80%',
          }}>
            <Ionicons name="location" size={24} color="#F8B11C" />
            <Text > {moment(item.StartDate).format("DD-MM-YYYY")} - {moment(item.EndDate).format("DD-MM-YYYY")} </Text>
            <Text > {item.City} </Text>
          </View>
        </View>
      }
      titleStyle={{
        fontSize: 14
      }}
      right={() => { null }} >
      <Tasks tasks={item.Tasks} />
    </List.Accordion>
  )

  const Types = ({ types }) => (
    types.map((item, index) => {
      return <Text key={index} style={styles.text}> | {item} </Text>
    })
  )

  const Tasks = ({ tasks }) => (
    <FlatList
      style={{ width: screenWidth }}
      data={tasks}
      listKey={(item, index) => (item.TaskNumber + index).toString()}
      keyExtractor={(item, index) => (index).toString()}
      renderItem={({ item }) => {
        return (
          <List.Item
            style={{ backgroundColor: '#dedfe1' }}
            title={item.TaskName}
            description={
              <View style={{ width: screenWidth * 0.9 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                  <Text> תאריך {moment(item.StartDate).format("DD-MM-YYYY")} </Text>
                  <Text>  שעה {item.TaskHour} </Text>
                </View>
                <Text>  {item.TaskDescription} </Text>
                <View style={{ width: '100%', justifyContent: 'center' }}>
                  {user != 0 ?
                    <TouchableOpacity style={[styles.btnStyle,
                    {
                      backgroundColor: item.Status === "sign" ? "#52B69A" : "#808080",
                    }]}
                      onPress={() => signUserToTask(item)}
                    >
                      <Text style={{ textAlign: 'center' }}>  {item.Status === "sign" ? "שיבוץ" : "בטל שיבוץ"} </Text>
                    </TouchableOpacity>
                    : null}
                  {item.Status != "wait" ? null : <View style={{ flexDirection: 'row', marginTop: 3, alignSelf: 'center' }}>
                    <Ionicons name="timer-outline" size={24} color="#F8B11C" />
                    <Text> ממתין לאישור שיבוץ </Text>
                  </View>}
                </View>
              </View>
            }
            descriptionStyle={{
              alignSelf: 'flex-start',
            }}
            titleStyle={{
              fontWeight: 'bold',
              fontSize: 16,
              alignSelf: 'flex-start',

            }}
          />)
      }}
    />
  )

  return (
    <View style={{ width: screenWidth, height: screenHeigth * 0.7 }}>
      <View style={[styles.selectedListBox, { width: screenWidth, height: screenHeigth * 0.05 }]}>
        <SelectDropdown
          data={typeList}
          defaultButtonText="בחירת תחום עניין"
          onSelect={(selectedItem, index) => {
            console.log("selected: ", selectedItem)
            setSortBy({
              ...sortBy,
              sortByType: selectedItem,
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
              ...sortBy,
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
      <List.Section>

        <FlatList
          render
          style={{ width: screenWidth, height: screenHeigth * 0.62 }}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          contentInsetAdjustmentBehavior="always"
          initialNumToRender={request.length}
          scrollEnabled={true}
          data={request}
          renderItem={renderItem}
          keyExtractor={item => item.RequestCode}
          listKey={"list1s"}
          ItemSeparatorComponent={() => {
            return <View style={{ backgroundColor: "#52B69A", height: 4 }} />
          }}
        />
      </List.Section>
      <Provider>
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
      </Provider>
    </View>
  )
}

const styles = StyleSheet.create({
  img: {
    borderRadius: 40,
    height: 50,
    width: 50,
    marginLeft: 20
  },
  title: {
    fontSize: 22,

  },
  text: {
    fontSize: 14,
    color: 'grey',

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
  },
  selectedListBox: {
    flexDirection: 'row',
    marginTop: 10,
  }
})

export default HomePage;
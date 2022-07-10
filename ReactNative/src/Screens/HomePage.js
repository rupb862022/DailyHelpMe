import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList, Dimensions, ActivityIndicator, Modal, TextInput } from 'react-native'
import React, { useState, useEffect, useContext } from 'react';
import { List } from 'react-native-paper';
import { Ionicons, AntDesign, MaterialIcons } from '@expo/vector-icons';
import moment from 'moment';
import { getRequests, signToTask, getTypesName, cancelTask } from '../FetchCalls/homePageAPI';
import SelectDropdown from 'react-native-select-dropdown'
import * as Location from 'expo-location';
import { userContext } from '../General/userContext';
import CrownImg from '../Components/CrownImg';
import ModalCustom from '../ComponentStyle/ModalCustom';
import CustomPopUp from '../ComponentStyle/CustomPopUp';

const HomePage = ({ navigation }) => {

  const { user, setUser } = useContext(userContext);

  const [request, setRequest] = useState([])

  const [typeList, setListOfTypes] = useState([])

  const screenWidth = Dimensions.get('screen').width;
  const screenHeigth = Dimensions.get('screen').height;

  const [dialog, setDialog] = useState({
    visible: false,
    textBody: "",
    textTitle: "",
    color: 'green'
  });

  const [tasksShow, setTasksShow] = useState(null);

  const [modalPriavteReq, setModalPriavteReq] = useState(false);
  const [priaveReqText, setPriaveReqText] = useState(null);

  const [ReqChose, setReqChose] = useState()

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

  const [filterRequest, setFilterRequest] = useState({
    ID: user.ID,
    FilterBy: [],
  });

  useEffect(() => {
    const whenFocus= navigation.addListener('focus', () => {
      getRequestsList()
      setReqChose(null)
      setAskedReqList(false)
      setTaskChosenDatesList([])
      setModalPriavteReq(false)
      setTasksShow(null)
    });
    return whenFocus;
  });

  const [askedReqList, setAskedReqList] = useState(false)

  const getRequestsList = () => {
    getRequests(filterRequest).
      then(
        (result) => {
          if (result != "empty") {
            setRequest(result)
          }
          else {
            setRequest([]);
          }
          setAskedReqList(false)
        },
        (error) => {
          console.log("Signed To Task with confirmation error=", error);
        });
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      getRequestsList()
    }, 5000)
    return () => clearTimeout(timer);
  }, [filterRequest, request])

  const typeFilter = (typeFil) => {
    let temp = []
    if (filterRequest.FilterBy.length !== 0) {
      let yo = filterRequest.FilterBy.filter(x => x.Type != "Volunteer")
      if (yo.length !== 0) {
        temp.push(yo[0]);
      }
    }

    if (typeFil != "כל התחומים") {
      temp.push({
        Type: "Volunteer",
        VolunteerName: typeFil
      })
    }

    setFilterRequest({
      ID: user.ID,
      FilterBy: temp
    })

  }

  const linkFilter = (link) => {
    let temp = [];
    if (filterRequest.FilterBy.length !== 0) {
      let yo = filterRequest.FilterBy.filter(type => type.Type != "Link");
      if (yo.length !== 0) {
        temp.push(yo[0])
      }
    }

    temp.push({
      Type: "Link",
      Link: link
    })

    setFilterRequest({
      ID: user.ID,
      FilterBy: temp
    })
  }

  const locationFilter = async (filterLocation) => {
    let temp = [];
    if (filterRequest.FilterBy.length !== 0) {
      let yo = filterRequest.FilterBy.filter(x => x.Type != "Coords" && x.Type != "City");
      if (yo.length !== 0) {
        temp.push(yo[0])
      }
    }

    if (filterLocation === "באיזור שלי") {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      temp.push({
        Type: "Coords",
        Coords: {
          Lat: location.coords.latitude,
          Lng: location.coords.longitude,
        }
      })
    }
    else if (filterLocation === "בעיר שלי") {
      temp.push({
        Type: "City",
        CityName: user.CityName
      })
    }
    setFilterRequest({
      ID: user.ID,
      FilterBy: temp
    })
  }

  const signUserToTask = (Task) => {
    console.log("task=", Task)

    if (Task.Status == "sign") {
      signToTask({
        ID: user.ID,
        TaskNumber: Task.TaskNumber,
        TaskDate: Task.TaskDate
      }).then(
        (result) => {
          setTasksShow(false)
          if (result == "signed") {
            console.log("Signed To Task Without confirmation successfully: ", result)
            setDialog({ visible: true, textTitle: "שיבוצך בוצע בהצלחה", textBody: `שיבוצך למשימה בוצע בהצלחה`, color: "green" })
            setUser({ ...user, RegisteredTasks: user.RegisteredTasks + 1 })
          }
          else if (result == "wait") {
            console.log("Signed To Task Without confirmation successfully: ", result)
            setDialog({ visible: true, textTitle: "בקשת השיבוץ התקבלה", textBody: `שיבוצך למשימה ממתין לאישור`, color: "green" })
          }
          else {
            console.log("NO")
            setDialog({ visible: true, textTitle: "לא ניתן להשתבץ", textBody: `אנא נסה שנית מאוחר יותר`, color: "red" })
          }
          setAskedReqList(true)
          getRequestsList();
        },
        (error) => {
          console.log("Signed To Task Without confirmation error=", error);
          return;
        });
    }
    if (Task.Status == "cancel" || Task.Status == "wait") {
      cancelTask({
        ID: user.ID,
        TaskNumber: Task.TaskNumber,
        TaskDate: Task.TaskDate
      }).then(
        (result) => {
          console.log("cancel registration: ", result)
          setTasksShow(false)
          if (result == "OK") {
            setDialog({ visible: true, textTitle: "שיבוצך בוטל בהצלחה", textBody: `שיבוצך למשימה בוטל בהצלחה`, color: "green" })
          }
          else {
            setDialog({ visible: true, textTitle: "לא ניתן לבטל שיבוץ", textBody: `אנא נסה שנית מאוחר יותר`, color: "red" })
          }
          setAskedReqList(true)
          getRequestsList();
        },
        (error) => {
          console.log("Signed To Task with confirmation error=", error);
        });
    }
  }

  const [taskNumberAndDate, setTaskChosenDatesList] = useState([]);

  const renderItem = ({ item }) => {
    return (
      <View>
        <TouchableOpacity
          activeOpacity={0.95}
          onPress={() => {
            setTasksShow(true)
            //setDateTaskChose({ dateChosen: null, taskNum: null })
            setReqChose(item)
          }}>
          <View style={{
            height: screenHeigth * 0.13,
            width: screenWidth * 0.98,
            alignSelf: 'flex-start',
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: "#B6E0D4",
            elevation: 6,
            shadowOpacity: 0.2,
            shadowRadius: 3,
            borderRadius: 10,
            paddingVertical: 5,
            paddingHorizontal: 5,
            marginVertical: 5,
            alignSelf: 'center'

          }}>
        
            <TouchableOpacity style={{ marginRight: 5, width: "25%" }} onPress={()=>{
                navigation.navigate("ProfileS",{
                 screen:"ProfileOfUser",
                 params: {
                    ID: item.ID,
                    FirstName: item.UserUpload,
                    LastName: item.LastName
                  }})
             }}>
              <CrownImg rank={item.Rank} profile={false} />
              <Image style={styles.img} source={{ uri: item.Image }} />
              <Text style={{ alignSelf: 'center', marginRight: 5, color: 'black' }}>{item.UserUpload}</Text>
            </TouchableOpacity>
            <View style={{ alignSelf: 'center', width: "75%" }}>
              <Text style={styles.title}>{item.RequestName}</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                <Types types={item.TypesList} />
              </View>
              <Text style={{ marginRight: 10, alignSelf: 'flex-start', fontSize: 13, color: 'grey' }}>{moment(item.StartDate).format("DD-MM-YYYY")} - {moment(item.EndDate).format("DD-MM-YYYY")}</Text>
            </View>
          </View>
        </TouchableOpacity>

      </View>
    )
  }


  const Types = ({ types }) => {
    return (
      types.map((item, index) => {
        return <Text key={index} style={styles.text}>{index == 0 ? null : <Text> | </Text>}{item}</Text>
      })
    )
  }


  const ButtonAcceptOrCancel = ({ taskBtn }) => {

    if (user.ID == 0) {
      return null;
    }

    let temp = taskNumberAndDate.find(task => task.TaskNumber == taskBtn.TaskNumber);
    let tasky = taskBtn.TaskDateStatus.filter(task => task.TaskDate == temp.TaskDate);


    if (!tasky.length) {
      return null
    }

    tasky = tasky[0];

    return (
      <TouchableOpacity style={[styles.btnStyle,
      {
        borderColor: tasky.Status === "sign" ? "#52B69A" : "#ca3146",
        backgroundColor: tasky.Status === "sign" ? "#52B69A" : "#ca3146",
      }]}
        onPress={() => signUserToTask({
          Status: tasky.Status,
          TaskNumber: taskBtn.TaskNumber,
          TaskDate: tasky.TaskDate
        })}
      >
        <Text style={{ textAlign: 'center', color: "white" }}>{tasky.Status === "sign" ? "שיבוץ" : "בטל שיבוץ"}</Text>
      </TouchableOpacity>
    )
  }

  const updateTaskChosenList = (taskNumber, date) => {
    let tempList;

    console.log("taskNumberAndDate in update=", taskNumberAndDate)
    if (!taskNumberAndDate.length) {
      tempList = [];
    }
    else if (taskNumberAndDate.some(x => x.TaskNumber == taskNumber)) {
      tempList = taskNumberAndDate.filter(x => x.TaskNumber != taskNumber)
    }
    else {
      tempList = taskNumberAndDate;
    }

    tempList.push({
      TaskNumber: taskNumber,
      TaskDate: date
    })

    setTaskChosenDatesList(tempList)
  }

  const Tasks = () => (
    <View>
      <View style={{
        height: screenHeigth * 0.13,
        width: screenWidth * 0.9,
        alignSelf: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: "#B6E0D4"
      }}>
        <TouchableOpacity style={{ marginRight: 5, width: "25%" }} onPress={() =>
         navigation.navigate("ProfileS",
         {screen:"ProfileOfUser", params:{
          ID: ReqChose.ID,
          FirstName: ReqChose.UserUpload,
          LastName: ReqChose.LastName
        }})}>
          <CrownImg rank={ReqChose.Rank} profile={false} />
          <Image style={styles.img} source={{ uri: ReqChose.Image }} />
          <Text style={{ alignSelf: 'center', marginRight: 5, color: 'black' }}>{ReqChose.UserUpload}</Text>
        </TouchableOpacity>
        <View style={{ alignSelf: 'center', width: "75%" }}>
          <Text style={[styles.title, { fontSize: 17 }]}>{ReqChose.RequestName}</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {ReqChose.TypesList == null ? null : <Types types={ReqChose.TypesList} />}
          </View>
          <Text style={{ marginRight: 10, alignSelf: 'flex-start', fontSize: 13, color: 'grey' }}>{moment(ReqChose.StartDate).format("DD/MM/YYYY")} - {moment(ReqChose.EndDate).format("DD/MM/YYYY")}</Text>
        </View>
      </View>

      <FlatList
        scrollEnabled={true}
        nestedScrollEnabled={true}
        data={ReqChose.Task}
        listKey={(item, index) => (item.TaskNumber + index).toString()}
        keyExtractor={(item, index) => (index).toString()}
        ItemSeparatorComponent={() => {
          return <View style={{ backgroundColor: "black", height: 1, width: "90%", alignSelf: 'center' }} />
        }}
        renderItem={({ item }) => {
          return (
            <View style={{ width: screenWidth * 0.82, alignSelf: 'center', marginBottom: 10, marginTop: 15, }}>
              <Text style={[styles.textTitle, { alignSelf: 'center', }]}>{item.TaskName}</Text>
              <Text style={{ fontSize: 14, alignSelf: 'center', color: 'grey' }}>{item.TaskDescription}</Text>
              <View style={[styles.row, { justifyContent: 'space-between', marginTop: 5 }]}>
                <View style={styles.row}>
                  <SelectDropdown
                    dropdownIconPosition={'left'}
                    renderDropdownIcon={() => <Ionicons name="calendar" size={20} color="#F8B11C" />}

                    buttonStyle={{
                      backgroundColor: 'transparent',
                      width: "70%",
                      height: "100%",
                      alignSelf: 'center',
                    }}
                    rowStyle={{ width: "100%", }}
                    buttonTextStyle={{ fontSize: 16, textAlign: 'center', }}
                    data={item.DatesForTask}
                    defaultButtonText={taskNumberAndDate.some(x => x.TaskNumber == item.TaskNumber) ?
                      moment(taskNumberAndDate.find(x => x.TaskNumber == item.TaskNumber).TaskDate).format('DD/MM/YYYY')
                      : "בחר תאריך"
                    }
                    onSelect={selectedItem => {
                      updateTaskChosenList(item.TaskNumber, selectedItem)
                    }}
                    buttonTextAfterSelection={selectedItem => moment(selectedItem).format('DD/MM/YYYY')}
                    rowTextForSelection={item => moment(item).format('DD/MM/YYYY')}

                  />
                </View>

                <View style={styles.row}>
                  <AntDesign name="clockcircleo" size={20} color="#F8B11C" />
                  <Text style={{ marginLeft: 14 }}>{item.TaskHour.substring(0, 5)}</Text>

                </View>

              </View>
              <View style={[styles.row, { alignSelf: 'center', marginTop: 10 }]}>
                <Ionicons name="location" size={20} color="#F8B11C" />
                <Text style={{ marginLeft: 10 }}>{item.CityName}</Text>
              </View>
              <View style={{ width: '100%', justifyContent: 'center' }}>
                {taskNumberAndDate.some(x => x.TaskNumber == item.TaskNumber) ? <ButtonAcceptOrCancel taskBtn={item} /> : null}
              </View>
            </View>
          )
        }} />
    </View>
  )


  return (
    <View style={{ width: screenWidth, height: screenHeigth * 0.8 }}>
      <Modal
        transparent
        visible={tasksShow}
        onRequestClose={() => { setTasksShow(false) }}
      >
        <TouchableOpacity style={styles.ModalBackGround}
          onPress={() => setTasksShow(false)}
        >
          <View style={styles.modal}>
            <Tasks />
          </View>

        </TouchableOpacity>
      </Modal>

      <View style={[styles.row, { width: screenWidth, height: screenHeigth * 0.07 }]}>
        <SelectDropdown
          data={user.ID == 0 ? ["כל הארץ", "באיזור שלי"] : ["כל הארץ", "באיזור שלי", "בעיר שלי"]}
          defaultButtonText="מיקום"
          onSelect={(selectedItem, index) => {
            setAskedReqList(true)
            locationFilter(selectedItem)
          }}
          rowTextStyle={{ fontSize: 15 }}
          renderCustomizedButtonChild={selectedItem => {
            return (
              <View style={[styles.row, { alignItems: 'center', justifyContent: 'center' }]}>
                <TouchableOpacity onPress={() => { setAskedReqList(true); locationFilter("כל הארץ") }}>
                  {filterRequest.FilterBy.some(x => x.Type == "City" || x.Type == "Coords")
                    ? <MaterialIcons name="cancel" size={17} color="black" />
                    : <AntDesign name="filter" size={17} color="black" />}
                </TouchableOpacity>
                <Text style={styles.btnTextDropDown}>
                  {
                    filterRequest.FilterBy.some(x => x.Type == "City") ? "בעיר שלי"
                      : filterRequest.FilterBy.some(x => x.Type == "Coords") ? "באיזור שלי"
                        : "כל הארץ"
                  }
                </Text>
              </View>);
          }}
          rowTextForSelection={(item, index) => {
            return item
          }}
          buttonStyle={{
            width: "30%",
            height: "100%",
            backgroundColor: '#e7e5e5',
          }}
        />
        <SelectDropdown
          data={typeList}
          defaultValue="לפי תחום עניין"
          defaultButtonText="לפי תחום עניין"
          onSelect={(selectedItem, index) => {
            setAskedReqList(true);
            typeFilter(selectedItem)
          }}
          rowTextForSelection={(item, index) => {
            return item
          }}
          buttonStyle={{
            width: "40%",
            height: "100%",
            backgroundColor: '#e7e5e5',
          }}
          rowTextStyle={{ fontSize: 15 }}
          renderCustomizedButtonChild={selectedItem => {
            return (
              <View style={[styles.row, { alignItems: 'center', justifyContent: 'center' }]}>
                <TouchableOpacity onPress={() => { setAskedReqList(true); typeFilter("כל התחומים"); }}>
                  {filterRequest.FilterBy.some(x => x.Type == "Volunteer") ? <MaterialIcons name="cancel" size={17} color="black" />
                    : <AntDesign name="filter" size={17} color="black" />}
                </TouchableOpacity>
                <Text style={styles.btnTextDropDown}>
                  {
                    filterRequest.FilterBy.some(x => x.Type == "Volunteer") ? filterRequest.FilterBy.find(x => x.Type == "Volunteer").VolunteerName : "כל התחומים"
                  }
                </Text>
              </View>);
          }}
        />

        <View style={{ width: "30%", alignItems: 'center', justifyContent: 'center', backgroundColor: '#e7e5e5', height: "100%", flexDirection: 'row', }}>

          <TouchableOpacity onPress={() => {
            let temp = filterRequest.FilterBy.filter(x => x.Type != "Link");
            setAskedReqList(true);
            setFilterRequest({
              ID: user.ID,
              FilterBy: temp
            })
          }}>
            {filterRequest.FilterBy.some(x => x.Type == "Link") ? <MaterialIcons name="cancel" size={17} color="black" /> : null}

          </TouchableOpacity>
          <TouchableOpacity style={{
            alignItems: 'center', justifyContent: 'center', flexDirection: 'row',
          }}
            onPress={() => {
              setModalPriavteReq(true);
              setPriaveReqText("");
            }}
          >
            {filterRequest.FilterBy.some(x => x.Type == "Link") ? null
              : <AntDesign name="pluscircleo" size={17} color="black" />
            }
            <Text style={{ fontSize: 13, marginLeft: 2 }}>בקשה אישית</Text>
          </TouchableOpacity>
        </View>
      </View>
      <ModalCustom setClose={setModalPriavteReq} visible={modalPriavteReq} content={

        <View>
          <Text style={styles.textTitle}>הכנס קוד משימה אישית:</Text>
          <TextInput style={styles.input}
            onChangeText={(text) => setPriaveReqText(text)}
            placeholder=" קוד משימה"
          />
          <View style={[styles.row, styles.center]}>
            <TouchableOpacity style={styles.btnModal} onPress={() => setModalPriavteReq(false)}>
              <Text style={styles.btnModalText}> סגור </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnModal}
              onPress={() => {
                linkFilter(priaveReqText)
                setModalPriavteReq(false)
                setAskedReqList(true)
              }}>
              <Text style={styles.btnModalText}> חפש </Text>
            </TouchableOpacity>
          </View>
        </View>
      } />
      {askedReqList ? <ActivityIndicator /> :
        <List.Section>
          <FlatList
            style={{ width: screenWidth, height: screenHeigth * 0.62 }}
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps="handled"
            contentInsetAdjustmentBehavior="always"
            scrollEnabled={true}
            data={request}
            renderItem={renderItem}
            keyExtractor={item => item.RequestCode}
            listKey={"list1s"}
            ListEmptyComponent={() => {
              return (
                <View>
                  {!filterRequest.FilterBy.length ? <ActivityIndicator /> : <Text> לא נמצאו תוצאות </Text>}
                </View>
              );
            }}
          />
        </List.Section>
      }
      <CustomPopUp dialog={dialog} setDialog={setDialog} />

    </View>

  )
}

const styles = StyleSheet.create({
  img: {
    borderRadius: 40,
    height: 50,
    width: 50,
    alignSelf: 'center'
  },
  title: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 13,
    color: 'grey',
  },
  textTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 3
  },
  btnStyle: {
    marginTop: 12,
    width: "40%",
    alignSelf: 'center',
    padding: 5,
    borderRadius: 20,
    borderColor: '#52B69A',
    borderWidth: 1,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.5,
    shadowRadius: 1.8,
    elevation: 4,
    marginBottom: 5
  },
  row: {
    flexDirection: 'row',
  },
  center: {
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: 'white',
    position: 'absolute',
    top: "15%",
    width: "95%",
    alignSelf: 'center',
    padding: 5,
    borderRadius: 10,
    alignItems: 'center',
    borderColor: 'black',
    borderWidth: 1,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.5,
    shadowRadius: 1.8,
    elevation: 4,
  },
  input: {
    color: 'black',
    marginLeft: 10,
    flex: 1,
    textAlign: 'right',
    borderWidth: 1,
    padding: 8,
    borderColor: 'black',
    borderRadius: 10,
    width: '100%',
    margin: 10,
    marginBottom: 15,
    alignSelf: 'center'
  },
  btnModal: {
    width: "30%",
    marginBottom: 5
  },
  btnModalText: {
    color: "#52B69A",
    textAlign: 'center',
    fontWeight: 'bold',
  },
  btnTextDropDown: {
    fontSize: 13,
    padding: 2
  },
  ModalBackGround: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    activeOpacity: 1
  },
  shadow: {
    elevation: 10,
    shadowOpacity: 0.2,
    shadowRadius: 3,
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 5,
    marginVertical: 5,
  }

})

export default HomePage;
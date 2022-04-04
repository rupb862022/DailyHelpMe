import { StyleSheet, TextInput, Text, View, SafeAreaView, FlatList, TouchableOpacity, ScrollView } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import InputStyle from '../ComponentStyle/InputStyle'
import ToggleStyle from '../ComponentStyle/ToggleStyle';
import { List } from 'react-native-paper';
import ButtonCustom from '../ComponentStyle/ButtonCustom';
import CubeType from '../ComponentStyle/CubeType';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import CalendarBoard from '../Components/CalendarBoard';
import { Ionicons, Feather } from '@expo/vector-icons';
import moment from 'moment';
import DateTimePicker from "@react-native-community/datetimepicker";
import TimePicker from "react-native-super-timepicker";
import { addRequest, getTypes, AddCity } from '../FetchCalls/addRequestAPI'
//import {UserContext} from '../../App'

const AddRequest = ({ navigation }) => {

  //const user = useContext(UserContext);
  const GOOGLE_PLACES_API_KEY = 'AIzaSyD_GGypBzDabu8UYars4z1DTFG8PLRsvY4';

  const [listOfTypes, setlistOfTypes] = useState([])
  const [listOfTypesChose, setlistOfTypesChose] = useState()

  const [request, setRequest] = useState()

  const [taskList, setTaskList] = useState([])

  const [adress, setAdress] = useState({
    name: '',
    lat: '',
    lng: '',
  });

  const [errorList, setErrorList] = useState([{
    listOfTypesChoseError: false,
    requestNameError: false,
    adressError: false,
    taskNameError: false,
    taskDisError: false,
    startDateError: false,
    endDateError: false,
    numOfVulError: false,
  }]);

  const [confirmation, setConfirmation] = useState(false)

  const [requestName, setRequestName] = useState(null);
  const [privateRequest, setPrivateRequest] = useState(false);
  const [taskName, setTaskName] = useState('שם המשימה');
  const [taskDis, setTaskDis] = useState();

  const [numOfVul, setNumOfVul] = useState(1)

  const [openCalendarStart, setOpenCalendarStart] = useState(false);
  const [openCalendarEnd, setOpenCalendarEnd] = useState(false);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [time, setTime] = useState(moment().format('hh:mm'))
  const [open, setTimeOpen] = useState(false)

  const [changeToReqButton, setChangeToReqButton] = useState(false);

  const addReq = async () => {
    await setRequest({
      ID: "316112930",
      RequestName: requestName,
      PrivateRequest: privateRequest,
      Task: taskList
    });

    console.log(request)
    addRequest(request)
      .then(
        (result) => {
          console.log("add request res = ", result)
          if (result == "OK") {
            navigation.navigate('Home')
          }
        },
        (error) => {
          console.log("Could not add Request", error);
        });
  }

  const addTask = () => {

    var CityCode;
    AddCity(adress.name).then(
      (result) => {
        console.log("add request get city code: ", result)
        CityCode = result;
      },
      (error) => {
        console.log("Could not get the city code in addRequest", error);
      });

    setTaskList([...taskList, {
      TaskName: taskName,
      TaskDescription: taskDis,
      TaskHour: time,
      StartDate: startDate,
      EndDate: endDate,
      Confirmation: confirmation,
      NumOfVulRequired: numOfVul,
      Lat: adress.lat,
      Lng: adress.lng,
      CityCode: CityCode,
    }])

    setChangeToReqButton(true)
  }

  const checkRequestName = () => {
    if (requestName == null) {
      setErrorList({ ...errorList, requestNameError: true })
      return;
    }
  }

  const checkAdress = () => {
    if (adress == null) {
      setErrorList({ ...errorList, adressError: true })
      return;
    }
  }
  const checkStartDate = () => {
    if (startDate == null) {
      setErrorList({ ...errorList, startDateError: true })
      return;
    }
  }

  const checkEndDate = () => {
    if (startDate == null) {
      setErrorList({ ...errorList, endDateError: true })
      return;
    }
  }

  const checkTaskName = () => {
    if (taskName == null) {
      setErrorList({ ...errorList, taskNameError: true })
      return;
    }
  }
  const checkTaskDiscripthion = () => {
    if (taskDis == null) {
      setErrorList({ ...errorList, taskDisError: true })
      return;
    }
  }

  const addTypeToList = (type) => {
    if (listOfTypesChose != null) {
      let temp = listOfTypesChose.filter(t => t != type)
      temp.length == listOfTypesChose.length ? setlistOfTypesChose([...listOfTypesChose, type]) : setlistOfTypesChose(temp);
    }
    else {
      setlistOfTypesChose([type]);
    }
  }


  useEffect(() => {
    getTypes({
    }).then(
      (result) => {
        console.log("GetTypes in add request: ", result)
        setlistOfTypes(result)
      },
      (error) => {
        console.log("Could not get the types in addRequest", error);
      });

  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.accordionsBox}>
        <View style={styles.inputBox}>
          <TextInput style={styles.input} placeholder="שם הבקשה" onChangeText={(text) => setRequestName(text)}
            onEndEditing={() => checkRequestName()} />
        </View>
        <View style={{ width: "70%", justifyContent: 'center', alignItems: 'center' }}>
          <ToggleStyle state={privateRequest} text=" הפוך בקשה לאישית" func={setPrivateRequest} />
        </View>
        <View style={styles.inputBox} >
          <GooglePlacesAutocomplete
            suppressDefaultStyles={true}
            listUnderlayColor='#52B69A'
            numberOfLines={3}
            textInputProps={{
              color: 'black',
              textAlign: 'right',
              width: '100%',
            }}
            styles={{
              listView: {
                width: '100%',
              },
              separator: {
                height: 1,
                backgroundColor: '#52B69A',
              },
              poweredContainer: {
                backgroundColor: '#52B69A',
              },
            }}
            placeholder='כתובת'
            onPress={(data, details = null) => {
              console.log(`name:${data.description} lat:${details.geometry.location.lat} lng: ${details.geometry.location.lng} `)
              setAdress({
                name: data.description,
                lat: details.geometry.location.lat,
                lng: details.geometry.location.lng,
              })

            }}
            fetchDetails={true}
            query={{
              key: GOOGLE_PLACES_API_KEY,
              language: 'iw',
              region: 'il',
              types: '(cities)'
            }}

          />

        </View>
        <ScrollView nestedScrollEnabled={true}>
          <View style={{ borderTopColor: "#F8B11C", borderTopWidth: 2, marginTop: 15, marginBottom: 10, width: '80%', alignSelf: 'center' }} />
          <View style={{ width: '100%', justifyContent: 'center' }}>
            <Text style={styles.title}> פרטי משימה </Text>
            <View style={styles.inputBox}>
              <TextInput style={styles.input} placeholder='שם משימה' onChangeText={(text) => setTaskName(text)} onEndEditing={checkTaskName} />
            </View>
            <View style={styles.inputBox}>
              <TextInput style={styles.input} placeholder="תיאור משימה" onChangeText={(text) => setTaskDis(text)} onEndEditing={checkTaskDiscripthion} />
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '73%' }}>
              <Text> מספר מתנדבים רצוי </Text>
              <View style={[styles.inputBox, { width: "20%", padding: 8 }]}>
                <TextInput style={styles.input} onChangeText={(text) => setNumOfVul(text)} />
              </View>
            </View>
            <View style={{ width: "81%", justifyContent: 'center', alignItems: 'center', marginTop: 2 }}>
              <ToggleStyle state={confirmation} text=" אני רוצה לאשר משתבצים" func={setConfirmation} />
            </View>
          </View>
          <View style={{ borderTopColor: "#F8B11C", borderTopWidth: 2, marginTop: 15, marginBottom: 10, width: '80%', alignSelf: 'center' }} />

          <Text style={styles.title}>  פרטי מיקום, תאריך ושעה  </Text>


          <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '80%', alignSelf: 'center' }}>
            <TouchableOpacity style={styles.datesStyle} onPress={() => { openCalendarStart ? setOpenCalendarStart(false) : setOpenCalendarStart(true) }}>
              <Text>  תאריך התחלה </Text>
              <Ionicons name="calendar" size={25} color="#F8B11C" />
              {startDate != null ? <Text> {moment(startDate).format("DD-MM-YYYY")}  </Text> : null}
            </TouchableOpacity>

            <TouchableOpacity style={styles.datesStyle} onPress={() => { openCalendarEnd ? setOpenCalendarEnd(false) : setOpenCalendarEnd(true) }}>
              <Text>  תאריך סיום </Text>
              <Ionicons name="calendar" size={25} color="#F8B11C" />
              {endDate != null ? <Text> {moment(endDate).format("DD-MM-YYYY")}</Text> : null}
            </TouchableOpacity>
          </View>

          {openCalendarStart && <CalendarBoard
            setDate={setStartDate}
            setOpen={setOpenCalendarStart}
            minDate={new Date().toDateString()}
            maxDate={endDate == null ? moment(new Date()).add(1, 'year').calendar() : endDate}
          />}
          {openCalendarEnd && <CalendarBoard
            setDate={setEndDate}
            setOpen={setOpenCalendarEnd}
            minDate={startDate == null ? new Date() : startDate}
            maxDate={moment(new Date()).add(1, 'year').calendar()}
          />}

          <TouchableOpacity style={styles.datesStyle} onPress={() => setTimeOpen(true)}>
            <Text>  שעת התחלה </Text>
            <Ionicons name="time" size={25} color="#F8B11C" />
            {time != null ? <Text> {time}</Text> : null}
          </TouchableOpacity>
          {/* 
          {open &&  <TimePicker
          ref={(ref) => {
            TimePicker = ref;
          }}
          onCancel={() => setTimeOpen(false)}
          onConfirm={(hour, minute) => {
            setTime(time,(`${hour}:${minute}`))
            setTimeOpen(false)
          }}
        />
          } */}
          <View style={{ borderTopColor: "#F8B11C", borderTopWidth: 2, marginTop: 15, marginBottom: 10, width: '80%', alignSelf: 'center' }} />

          <Text style={styles.title}>  תחומי המשימה </Text>
          <View style={styles.list}>
            {
              listOfTypes.map((item, index) => {
                return (
                  <CubeType key={index} type={item} typeChose={addTypeToList} />)
              })
            }
          </View>
          <View style={{ borderTopColor: "#F8B11C", borderTopWidth: 2, marginTop: 15, marginBottom: 10, width: '80%', alignSelf: 'center' }} />

          {changeToReqButton ? <ButtonCustom textInBtn=" הוסף בקשה" func={addReq} /> : <ButtonCustom textInBtn="הוסף משימה" func={addTask} />}

        </ScrollView>
      </View>
    </SafeAreaView >
  )
}

export default AddRequest

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    alignItems: 'center',
    width: '100%',
    height: "80%"
  },
  accordionsBox: {
    width: '100%',
    marginTop: 20,
    height: "100%",
    direction: 'rtl',
    writingDirection: 'rtl'
  },
  list: {
    width: "100%",
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  input: {
    color: 'black',
    marginRight: 5,
    flex: 1,
    textAlign: 'right',
  },
  inputBox: {
    flexDirection: "row",
    borderWidth: 1,
    padding: 12,
    borderColor: 'black',
    borderRadius: 20,
    width: '80%',
    writingDirection: 'rtl',
    margin: 10,
    alignSelf: 'center'
  },
  title: {
    fontSize: 18,
    color: '#52B69A',
    alignSelf: 'center',
    fontWeight: 'bold',
    margin: 2
  },
  datesStyle: {
    justifyContent: 'center',
    alignItems: 'center'
  }
})
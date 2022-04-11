import { StyleSheet, TextInput, Text, View, SafeAreaView, TouchableOpacity, ScrollView, Dimensions, FlatList, Modal, Alert, Platform } from 'react-native'
import React, { useState, useEffect, useContext, useCallback } from 'react'
import ToggleStyle from '../ComponentStyle/ToggleStyle';
import ButtonCustom from '../ComponentStyle/ButtonCustom';
import CubeType from '../ComponentStyle/CubeType';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import CalendarBoard from '../Components/CalendarBoard';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import moment from 'moment';
import { addRequest, getTypes, addCity } from '../FetchCalls/addRequestAPI';
import DateTimePicker from '@react-native-community/datetimepicker';
import ErrorText from '../ComponentStyle/ErrorText'
import { userContext } from '../General/userContext';
import { TimePickerModal } from 'react-native-paper-dates'

const GOOGLE_PLACES_API_KEY = 'AIzaSyD_GGypBzDabu8UYars4z1DTFG8PLRsvY4';

const AddRequest = ({ navigation }) => {

  const { user } = useContext(userContext);

  const [listOfTypes, setListOfTypes] = useState([])

  //props of request:
  const [request, setRequest] = useState({
    Task: [],
    RequestName: null,
    PrivateRequest: false,
  })

  //props of task:
  const [task, setTask] = useState({
    TaskName: null,
    confirmation: false,
    TaskDescription: null,
    TaskHour: null,
    StartDate: null,
    EndDate: null,
    Confirmation: false,
    NumOfVulRequired: "1",
    Lat: null,
    Lng: null,
    CityCode: null,
    TypesList: null,
  });

  const [adress, setAdress] = useState({
    name: null,
    lat: null,
    lng: null
  });

  const [errorList, setErrorList] = useState({
    listOfTypesChoseError: false,
    requestNameError: false,
    adressError: false,
    taskNameError: false,
    taskDisError: false,
    startDateError: false,
    endDateError: false,
    numOfVulError: false,
    timeSetError: false,
  });

  const [openCalendarStart, setOpenCalendarStart] = useState(false);
  const [openCalendarEnd, setOpenCalendarEnd] = useState(false);

  const screenWidth = Dimensions.get('screen').width;
  const screenHeight = Dimensions.get('screen').height;

  const [finish, setFinish] = useState(false);
  const [reset, setReset] = useState(false)
  const [showRequestButton, setShowRequestButton] = useState(false)

  useEffect(() => {
    navigation.addListener('focus', () => {
      setReset(false);
      setShowRequestButton(false);
      setFinish(false);
      setRequest({
        Task: [],
        RequestName: null,
        PrivateRequest: false,
      });
    })

  }, [navigation])

  const resetTask =()=>{
    setTask({
      TaskName: null,
      confirmation: false,
      TaskDescription: null,
      TaskHour: null,
      StartDate: null,
      EndDate: null,
      Confirmation: false,
      NumOfVulRequired: "1",
      Lat: null,
      Lng: null,
      CityCode: null,
    })
    setAdress({
      name: null,
      lat: null,
      lng: null
    })

  }

  useEffect(() => {
    if (reset) {
      resetTask();
      setReset(false)
    }
  }, [request, reset])

  useEffect(() => {
    if (finish) {
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
          })
    }
  }, [request, finish])

  const addReq = () => {
    if (!checkRequestName() && request.Task.length != 0) {
      console.log("taskList before we add to req: ", request.Task)
      setRequest({
        RequestStatus: "פעיל",
        ID: user.ID,
        RequestName: request.RequestName,
        PrivateRequest: request.PrivateRequest,
        Task: request.Task,
      });
      setFinish(true)
    }
  }

  useEffect(() => {
    if (adress.name != null && adress.lat != null && adress.lng != null) {
      addCity(adress.name).then(
        (result) => {
          console.log("add request get city code: ", result)
          setTask({
            ...task,
            CityCode: result,
            Lat: adress.lat,
            Lng: adress.lng
          });
        },
        (error) => {
          console.log("Could not get the city code in addRequest", error);
        });
    }
  }, [adress])


  const addTaskToList = () => {
    if (addTask()) {
      setShowRequestButton(true)
      setReset(true)
    }
    else {
      Alert.alert(
        "משימה לא נשמרה",
        "אחד או יותר מהנתונים חסרים",
        [
          {
            text: "סגור",
            style: "cancel"
          },
          { text: "אוקיי" }
        ]
      )
    }
  }

  const checkTypeList = () => {
    if (task.TypesList == null) {
      setErrorList({ ...errorList, listOfTypesChoseError: "סעיף זה חובה" })
      return true;
    }
    setErrorList({ ...errorList, listOfTypesChoseError: false })
    return false;
  }

  const addTask = () => {
    if (!errorList.taskNameError && !errorList.numOfVulError) {
      console.log("con", !checkStartDate())
      if (!checkTaskName() && !checkNumOfVulRequired() && !checkAdress() && !checkTimeSet() && !checkStartDate() && !checkEndDate() && !checkTypeList()) {
        if (request.Task.length == 0) {
          console.log("taskk empty?! YES")
          setRequest({ ...request, Task: [task] })
          Alert.alert(
            " משימה נשמרה בהצלחה",
            "ניתן להוסיף עוד משימות לבקשה או לסיים את העלאת הבקשה",
            [
              {
                text: "סגור",
                style: "cancel"
              },
              { text: "אוקיי" }
            ]
          )
          return true;
        }
        else {
          console.log("taskk empty?! NO!")
          setRequest({ ...request, Task: [...request.Task, task] })
          return true;
        }
      }
    }
  }

  const checkNumOfVulRequired = () => {
    if (task.NumOfVulRequired == null) {
      setErrorList({ ...errorList, numOfVulError: "סעיף זה חובה" })
      return true;
    }
    if (Number(task.NumOfVulRequired) > 20) {
      setErrorList({ ...errorList, numOfVulError: "אין אפשרות לבקש יותר מ20 מתנדבים" })
      return true;
    }
    setErrorList({ ...errorList, numOfVulError: false })
    return false;
  }

  const checkRequestName = () => {
    if (request.RequestName == null) {
      setErrorList({ ...errorList, requestNameError: "סעיף זה חובה" })
      return true;
    }
    setErrorList({ ...errorList, requestNameError: false })
    return false;
  }

  const checkAdress = () => {
    if (adress == null) {
      setErrorList({ ...errorList, adressError: "סעיף זה חובה" })
      return true;
    }
    setErrorList({ ...errorList, adressError: false })
    return false;
  }

  const checkStartDate = () => {
    if (task.StartDate == null) {
      setErrorList({ ...errorList, startDateError: "סעיף זה חובה" })
      return true;
    }
    setErrorList({ ...errorList, startDateError: false })
    return false;
  }

  const checkEndDate = () => {
    if (task.EndDate == null) {
      setErrorList({ ...errorList, endDateError: "סעיף זה חובה" })
      return true;
    }
    setErrorList({ ...errorList, endDateError: false })
    return false;
  }

  const checkTaskName = () => {
    if (task.TaskName == null) {
      setErrorList({ ...errorList, taskNameError: "סעיף זה חובה" })
      return true;
    }
    setErrorList({ ...errorList, taskNameError: false })
    return false;
  }

  const checkTimeSet = () => {
    console.log("time")
    if (task.TaskHour == null) {
      setErrorList({ ...errorList, timeSetError: "סעיף זה חובה" })
      return true;
    }
    setErrorList({ ...errorList, timeSetError: false })
    return false;
  }

  const checkTaskDiscripthion = () => {
    if (task.TaskDescription == null) {
      setErrorList({ ...errorList, taskDisError: true })
      return;
    }
    setErrorList({ ...errorList, taskDisError: false })
  }

  const addTypeToList = (type) => {

    if (task.TypesList != null) {
      console.log(task.TypesList)
      let temp = task.TypesList.filter(t => t != type)
      temp.length == task.TypesList.length ? setTask({ ...task, TypesList: [...task.TypesList, type] })
        : setTask({ ...task, TypesList: temp })
    }
    else {
      setTask({ ...task, TypesList: [type] })
    }
  }

  useEffect(() => {
    getTypes().then(
      (result) => {
        console.log("GetTypes in add request")
        setListOfTypes(result)
      },
      (error) => {
        console.log("Could not get the types in addRequest", error);
      });
  }, [])


  const showMode = () => {
    setShow(true);
  };

  const setIsPrivateRequest = (bool) => { setRequest({ ...request, PrivateRequest: bool }) }

  const setWantToConfirm = (bool) => { setTask({ ...task, Confirmation: bool }) }

  const setStartDay = (date) => {
    setErrorList({ ...errorList, startDateError: false })
    setTask({ ...task, StartDate: date })
  }

  const setEndDay = (date) => {
    setErrorList({ ...errorList, endDateError: false })
    setTask({ ...task, EndDate: date })
  }

  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    setErrorList({ ...errorList, timeSetError: false })
    setTask({ ...task, TaskHour: new Date(currentDate).toLocaleTimeString() });
  };


  const onDismiss = () => { setShow(false) }

  const onConfirm = ({ hours, minutes }) => {
    setShow(false);
    var time = new Date()
    time.setMinutes(minutes)
    time.setHours(hours)
    setErrorList({ ...errorList, timeSetError: false })
    setTask({ ...task, TaskHour: new Date(time).toLocaleTimeString() })
  }

  const [adressModalVisiable, setAdressModalVisiable] = useState(false)

  return (
    <SafeAreaView style={[styles.container, { height: screenHeight * 0.68, width: screenWidth }]}>
      <View style={[styles.accordionsBox, { borderBottomWidth: 2, borderBottomColor: "#F8B11C", height: screenHeight * 0.13 }]}>
        <View style={styles.inputBox}>
          <TextInput style={styles.input} value={request.RequestName} placeholder="שם הבקשה" onChangeText={(text) => setRequest({ ...request, RequestName: text })}
            onEndEditing={() => checkRequestName()} />
        </View>
        {errorList.requestNameError != false ? <ErrorText text={errorList.requestNameError} /> : null}
        <View style={{ width: "70%", justifyContent: 'center', alignItems: 'center', marginBottom: 5, flexDirection: 'row' }}>
          <TouchableOpacity onPress={() => {
            Alert.alert(
              "בקשה אישית",
              "אנו לא נפרסם את בקשתך בעמוד הבקשות ותוכל לקבל לינק לשלוח למי שתרצה",
              [
                {
                  text: "סגור",
                  onPress: () => console.log("Cancel Pressed"),
                  style: "cancel"
                },
                { text: "אוקיי", onPress: () => console.log("OK Pressed") }
              ]
            )
          }}>
            <FontAwesome name="question-circle" size={24} color="black" />
          </TouchableOpacity>
          <ToggleStyle state={request.PrivateRequest} text=" הפוך בקשה לאישית" func={setIsPrivateRequest} />
        </View>
      </View>
      <ScrollView
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        contentInsetAdjustmentBehavior="always"
        nestedScrollEnable={false}
        scrollEnabled={true}
        style={{ width: screenWidth, height: screenHeight * 0.6 }}
        contentContainerStyle={{ alignItems: 'center' }}
      >
        <View style={{ width: '80%', }}>
          <Text style={styles.title}> פרטי משימה </Text>
          <View style={styles.inputBox}>
            <TextInput style={styles.input} value={task.TaskName} placeholder='שם משימה' onChangeText={(text) => setTask({ ...task, TaskName: text })} onEndEditing={() => checkTaskName()} />
          </View>
          {errorList.taskNameError != false ? <ErrorText text={errorList.taskNameError} /> : null}

          <View style={styles.inputBox}>
            <TextInput style={styles.input} value={task.TaskDescription} placeholder="תיאור משימה" onChangeText={(text) => setTask({ ...task, TaskDescription: text })} onEndEditing={() => checkTaskDiscripthion()} />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '73%' }}>
            <Text> מספר מתנדבים רצוי </Text>
            <View style={[styles.inputBox, { width: "20%", padding: 5 }]}>
              <TextInput style={styles.input} value={task.NumOfVulRequired} onChangeText={(text) => setTask({ ...task, NumOfVulRequired: text })} onEndEditing={() => checkNumOfVulRequired()} keyboardType='numeric' />
            </View>
          </View>
          {errorList.numOfVulError != false ? <ErrorText text={errorList.numOfVulError} /> : null}
          <View style={{ width: "81%", justifyContent: 'center', alignItems: 'center', marginTop: 2 }}>
            <ToggleStyle state={task.Confirmation} text=" אני רוצה לאשר משתבצים" func={setWantToConfirm} />
          </View>
        </View>
        <View style={{ borderTopColor: "#F8B11C", borderTopWidth: 2, marginTop: 15, marginBottom: 10, width: '80%', alignSelf: 'center' }} />

        <Text style={styles.title}>  פרטי מיקום, תאריך ושעה  </Text>
        <Modal visible={adressModalVisiable}
          transparent
          style={styles.modalBox}
        >
          <View style={[styles.modal, styles.middle]}>
            <View style={styles.top} />
            <GooglePlacesAutocomplete
              suppressDefaultStyles={true}
              listUnderlayColor='#52B69A'

              textInputProps={{
                color: 'black',
                textAlign: 'right',
                padding: 0,
                borderColor: 'black',
                borderBottomWidth: 1,
                paddingTop: 15
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
              placeholder='הכנס את עיר המשימה'
              onPress={(data, details = null) => {
                console.log(`name:${data.description} lat:${details.geometry.location.lat} lng: ${details.geometry.location.lng} `)
                setAdress({
                  name: data.description,
                  lat: details.geometry.location.lat,
                  lng: details.geometry.location.lng,
                })
                setAdressModalVisiable(false)
              }}
              fetchDetails={true}
              query={{
                key: GOOGLE_PLACES_API_KEY,
                language: 'iw',
                region: 'il',
                types: '(cities)'
              }}
            />
            <TouchableOpacity style={styles.btnClose} onPress={() => setAdressModalVisiable(false)}>
              <Text style={styles.txtBtn}> סגור </Text>
            </TouchableOpacity>
          </View>

        </Modal>
        <View style={[styles.row, { justifyContent: 'space-between' }]}>
          <TouchableOpacity style={styles.datesStyle} onPress={() => { adressModalVisiable ? setAdressModalVisiable(false) : setAdressModalVisiable(true) }}>
            <View style={styles.row}>
              <Ionicons name="location" size={25} color="#F8B11C" />
              <Text style={styles.selectedTxt}> כתובת </Text>
            </View>
            <View>
              <Text style={styles.txt}>  {adress.name != null ? adress.name : null}  </Text>
              {errorList.adressError != false ? <ErrorText text={errorList.adressError} /> : null}
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.datesStyle} onPress={() => showMode(true)}>
            <View style={styles.row}>
              <Ionicons name="time" size={25} color="#F8B11C" />
              <Text style={styles.selectedTxt}>  שעת התחלה </Text>
            </View>
            <Text style={styles.txt}>  {task.TaskHour != null ? task.TaskHour : null}  </Text>
            {errorList.timeSetError != false ? <ErrorText text={errorList.timeSetError} /> : null}
          </TouchableOpacity>
        </View>
        {errorList.adressError != false ? <ErrorText text={errorList.adressError} /> : null}

        <View style={[styles.row, { justifyContent: 'space-between' }]}>
          <TouchableOpacity style={styles.datesStyle} onPress={() => { openCalendarStart ? setOpenCalendarStart(false) : setOpenCalendarStart(true) }}>
            <View style={styles.row}>
              <Ionicons name="calendar" size={25} color="#F8B11C" />
              <Text style={styles.selectedTxt}>  תאריך התחלה </Text>
            </View>
            <View>
              <Text style={styles.txt}>  {task.StartDate != null ? moment(task.StartDate).format('DD/MM/YYYY') : null}  </Text>
              {errorList.startDateError != false ? <ErrorText text={errorList.startDateError} /> : null}
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.datesStyle} onPress={() => { openCalendarEnd ? setOpenCalendarEnd(false) : setOpenCalendarEnd(true) }}>
            <View style={styles.row}>
              <Ionicons name="calendar" size={25} color="#F8B11C" />
              <Text style={styles.selectedTxt}>  תאריך סיום </Text>
            </View>
            <View>
              <Text style={styles.txt}>  {task.EndDate != null ? moment(task.EndDate).format('DD/MM/YYYY') : null}  </Text>
              {errorList.endDateError != false ? <ErrorText text={errorList.endDateError} /> : null}
            </View>
          </TouchableOpacity>
        </View>
        {openCalendarStart &&
          <Modal transparent onDismiss={() => setOpenCalendarStart(true)} >
            <View style={styles.middle}>
              <CalendarBoard
                startOrEnd='start'
                setDate={setStartDay}
                setOpen={setOpenCalendarStart}
                minDate={new Date()}
                maxDate={task.EndDate == null ? new Date().setFullYear(new Date().getFullYear() + 1) : new Date(task.EndDate)}
              />
            </View>
          </Modal>
        }
        {openCalendarEnd &&
          <Modal transparent>
            <View style={styles.middle}>
              <CalendarBoard
                startOrEnd='end'
                setDate={setEndDay}
                setOpen={setOpenCalendarEnd}
                minDate={task.StartDate == null ? new Date() : new Date(task.StartDate)}
                maxDate={task.StartDate == null ? new Date().setFullYear(new Date().getFullYear() + 1) : new Date().setDate(new Date(task.StartDate).getDate() + 10)}
              />
            </View>
          </Modal>
        }
        <View>

          {show ? Platform.OS === 'android' ? (
            <DateTimePicker
              style={{ backgroundColor: 'green' }}
              testID="dateTimePicker"
              value={new Date()}
              mode='time'
              is24Hour={true}
              onChange={onChange}
              display="clock"
            />
          ) :
            <TimePickerModal
              visible={show}
              onDismiss={onDismiss}
              onConfirm={onConfirm}
              hours={12}
              minutes={14}
              label="בחר שעה"
              cancelLabel="סגור"
              confirmLabel="בחר"
              animationType="fade"
              locale="en"
            /> : null}
        </View>

        <View style={{ borderTopColor: "#F8B11C", borderTopWidth: 2, marginTop: 5, marginBottom: 10, width: '80%', alignSelf: 'center' }} />

        <Text style={styles.title}>  תחומי המשימה </Text>
        <View style={styles.list}>
          {
            listOfTypes.map((item, index) => {
              if (item != "כל התחומים") {
                return (
                  <CubeType key={index} type={item} typeChose={addTypeToList} />)
              }
            })
          }
        </View>
        {errorList.listOfTypesChoseError != false ? <ErrorText text={errorList.listOfTypesChoseError} /> : null}

        <View style={{ borderTopColor: "#F8B11C", borderTopWidth: 2, marginTop: 15, width: '80%', alignSelf: 'center' }} />
        <TouchableOpacity style={styles.btnStyle} onPress={() => addTaskToList()}>
          <Text style={styles.txtBtn}> הוסף משימה </Text>
        </TouchableOpacity>
        {showRequestButton ? <ButtonCustom textInBtn=" הוסף בקשה" func={addReq} /> : null}
      </ScrollView>
    </SafeAreaView >
  )
}

export default AddRequest

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    alignItems: 'center',
  },
  accordionsBox: {
    marginTop: 5,
    direction: 'rtl',
    width: "80%"
  },
  list: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 5
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
    padding: 10,
    borderColor: 'black',
    borderRadius: 20,
    width: '100%',
    writingDirection: 'rtl',
    margin: 5,
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
    alignItems: 'center',

  },
  btnStyle: {
    width: '30%',
    backgroundColor: '#F8B11C',
    margin: 2,
    borderRadius: 20,
    padding: 5,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'black',
  },
  txtBtn: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  modal: {
    height: 240,
    backgroundColor: 'white',

    width: "90%",
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 20,
    padding: 10,
  },
  modalBox: {
    height: "100%",
    width: "100%",
  },
  top: {
    height: 40,
    backgroundColor: '#52B69A',
    margin: -10,
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
  },
  btnClose: {
    bottom: 3,
    position: 'absolute',
    alignSelf: 'center',
  },
  row: {
    flexDirection: 'row',
    width: "85%",
    alignSelf: 'center'
  },
  txt: {
    marginBottom: 20
  },
  selectedTxt: {
    fontSize: 14,
    fontWeight: 'bold'
  },
  middle: {
    position: 'absolute',
    top: "30%",
    alignSelf: 'center',
  },
  cube: {
    margin: 5,
    borderRadius: 15,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#52B69A',
  },
  cubePressed: {
    margin: 5,
    borderRadius: 15,
    backgroundColor: '#52B69A',
    borderWidth: 1,
    borderColor: 'white',
  },
  text: {
    color: '#52B69A',
    width: '100%',
    padding: 10,
  },
  textPressed: {
    color: 'white',
    width: '100%',
    padding: 10,
  }

})
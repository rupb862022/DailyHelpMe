import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Modal, Dimensions, FlatList, Platform, ActivityIndicator } from 'react-native'
import React, { useState, useEffect, useRef, useContext } from 'react'
import ToggleStyle from '../ComponentStyle/ToggleStyle';
import CubeTypeCopy from '../ComponentStyle/CubeTypeCopy';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Ionicons, Entypo, FontAwesome5, Feather, FontAwesome } from '@expo/vector-icons';
import { addRequest, getTypes, addCity, addType } from '../FetchCalls/addRequestAPI';
import CalendarBoard from '../Components/CalendarBoard';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TimePickerModal } from 'react-native-paper-dates'
import ModalCustom from '../ComponentStyle/ModalCustom';
import Carousel from 'react-native-snap-carousel';
import moment from 'moment';
import ToggleSwitch from 'toggle-switch-react-native';
import CustomDialog from '../ComponentStyle/CustomDialog';
import CustomPopUp from '../ComponentStyle/CustomPopUp';
import { userContext } from '../General/userContext';


const GOOGLE_PLACES_API_KEY = 'AIzaSyDzzNIGn4Vdk_Ui5WWtQWMnP_gvTqPk7K4';

const EditRequest = ({ requestSent, moveBack }) => {


  const [loading, setLoading] = useState(false);
  const { user } = useContext(userContext);

  const [request, setRequest] = useState(requestSent);
  const [listOfTypes, setListOfTypes] = useState([])
  const [tasksToRemove, setTasksToRemove] = useState([]);

  const [modalDialog, setModalDialog] = useState(false);

  const [currentTask, setCurrentTask] = useState(requestSent.Task[0]);

  const [dialogUpload, setDialogUpload] = useState(false);

  const carouselRef = useRef();

  const addTypeToList = (taskNumber, type) => {
    let task = request.Task.find(tasky => tasky.TaskNumber == taskNumber);
    let temp = [type];
    if (task.TypesList != null) {
      if (task.TypesList.length != 0) {
        console.log(task.TypesList)
        temp = task.TypesList.filter(t => t != type)
        if (temp.length == task.TypesList.length) {
          temp.push(type);
        }
      }
    }
    setTask(taskNumber, "TypesList", temp)
  }

  useEffect(() => {
    setRequest({ ...request, ID: user.ID })
    getTypes().then(
      (result) => {
        setListOfTypes(result)
      },
      (error) => {
        console.log("Could not get the types in addRequest", error);
      });
  }, [])


  const closeAndSave = () => {
    let check = checkIfFInish();
    if (check.error != false) {
   
      setDialog({
        visible: true,
        textBody: check.error,
        textTitle: request.RequestNew ? "העלאת בקשה נכשלה" : "עריכת הבקשה נכשלה",
        color: 'red'
      });

      carouselRef.current.snapToItem((request.Task.length - check.index));
    
      return;
    }

    let body = {
      request: request,
      NewTasks: request.Task.filter(task => task.New),
      TaskToRemove: tasksToRemove
    }

    addRequest(body)
      .then(
        (result) => {
          if (result.Status == "OK") {
            setDialogUpload(true);
            return;
          }
        },
        (error) => {
          console.log("Could not add Request", error);
        })
  }

  const checkIfFInish = () => {
    let result = {
      index: false,
      error: false
    }

    for (let index = 0; index < request.Task.length; index++) {
      let error = false;
      const task = request.Task[index];
      console.log("task =", task)
      if (task.TaskName == null || task.TaskName == "")
        error = "שם משימה לא יכול להיות ריק"
      else if (task.TaskHour == null || task.TaskHour == "")
        error = "המשימה חייבת להתקיים בשעה מסוימת";
      else if (task.DatesForTask == null || task.DatesForTask.length == 0)
        error = "המשימה חייבת להתקיים בתאריך אחד לפחות";
      else if (task.NumOfVulRequired == null || task.NumOfVulRequired == "")
        setTask(task.TaskNumber, "NumOfVulRequired", "1");
      else if (task.CityName == null || task.CityName == "")
        error = "המשימה חייבת להתקיים ביעד מסוים";
      else if (task.TypesList == null || task.TypesList.length == 0)
        error = "המשימה צריכה להיות בתחום אחד לפחות";

      if (error != false) {
        setLoading(false)
        result = {
          index: index,
          error: error
        }
        return result;
      }

    }
    return result;
  }

  const setTask = (taskNumber, field, value) => {
    let temp = request.Task.find(x => x.TaskNumber == taskNumber);
    let restOfTasks = request.Task.filter(x => x.TaskNumber != taskNumber);

    console.log(taskNumber, field, value)

    switch (field) {
      case "TaskName":
        temp.TaskName = value;
        break;
      case "Confirmation":
        temp.Confirmation = value;
        break;
      case "TaskDescription":
        temp.TaskDescription = value;
        break;
      case "TaskHour":
        temp.TaskHour = value;
        break;
      case "DatesForTask":
        temp.DatesForTask = value;
        break;
      case "NumOfVulRequired":
        temp.NumOfVulRequired = value;
        break;
      case "Lat":
        temp.Lat = value;
        break;
      case "Lng":
        temp.Lng = value;
        break;
      case "CityCode":
        temp.CityCode = value;
        break;
      case "CityName":
        temp.CityName = value;
        break;
      case "TypesList":
        temp.TypesList = value;
        break;
      default:
        return;
    }

    restOfTasks.push(temp);
    setRequest({ ...request, Task: sortList(restOfTasks) })
  }

  const setAdress = (name, lat, lng) => {
    addCity(name).then(
      (result) => {
        console.log("add request get city code: ", result)
        setTask(currentTask.TaskNumber, "CityCode", result)
      },
      (error) => {
        console.log("Could not get the city code in addRequest", error);
      });
    setTask(currentTask.TaskNumber, "CityName", name)
    setTask(currentTask.TaskNumber, "Lat", lat)
    setTask(currentTask.TaskNumber, "Lng", lng)
  }

  const [dialog, setDialog] = useState({
    visible: false,
    textBody: "",
    textTitle: "",
  });


  const [openCalendar, setOpenCalendar] = useState(false);

  const screenWidth = Dimensions.get('screen').width;
  const screenHeight = Dimensions.get('screen').height;

  const setPriavteRequest = (bool) => setRequest({ ...request, PrivateRequest: bool })

  const showTimeModal = () => {
    setTimeModal(true);
  };

  const removeTask = (task) => {
    if (currentTask.TaskDateStatus != null) {
      if (currentTask.TaskDateStatus.some(tasky => tasky.Status == "signed")) {
        console.log("cant be removed because someone is signed to the task!!")
        return;
      }
    }

    if (request.Task.length == 1) {
      setDialog({
        visible: true,
        textBody: "בקשה חייבת להכיל לפחות משימה אחת",
        textTitle: "לא ניתן לבצע את הפעולה",
        color: 'red'
      });
    }
    let temp = request.Task.filter(x => x.TaskNumber != currentTask.TaskNumber);

    setRequest({ ...request, Task: temp })

    currentTask.New ? null : setTasksToRemove([...task]);
  }

  const setDates = (date) => {
    setTask(currentTask.TaskNumber, "DatesForTask", date)
  }

  const isSomeoneSigned = (task, date) => {
    if (task.TaskDateStatus.some(tasky => tasky.TaskDate == date)) {
      let tempy = task.TaskDateStatus.find(tasky => tasky.TaskDate == date)
      if (tempy.Status == "signed") {
        return true;
      }
    }
    return false;
  }

  const RemoveDate = (task, date) => {
    if (isSomeoneSigned(task, date)) {
      console.log("Removing the date isnt possible!!!!")
      return;
    }

    let temp = task.DatesForTask.filter(x => x != date)
    setTask(task.TaskNumber, "DatesForTask", temp)
  }

  const [TimeModal, setTimeModal] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setTimeModal(false);
    setTask(currentTask.TaskNumber, "TaskHour", new Date(currentDate).toLocaleTimeString())
    return;
  };

  const onDismiss = () => { setTimeModal(false) }

  const onConfirm = ({ hours, minutes }) => {
    setTimeModal(false);
    var time = new Date()
    time.setMinutes(minutes)
    time.setHours(hours)
    setTask(currentTask.TaskNumber, "TaskHour", new Date(time).toLocaleTimeString())
  }

  const addTask = (copyOrNew) => {
    let taskNum = 0;
    let arrayLength = request.Task.length;
    if (arrayLength != 0) {
      taskNum = request.Task[arrayLength - 1].TaskNumber + 1;
    }
    let temp;
    if (copyOrNew == "new") {
      temp = {
        RequestCode: request.requestNew ? null : request.RequestCode,
        TaskNumber: taskNum,
        TaskName: null,
        confirmation: false,
        TaskDescription: null,
        TaskHour: null,
        DatesForTask: null,
        Confirmation: false,
        NumOfVulRequired: "1",
        Lat: null,
        Lng: null,
        CityCode: null,
        CityName: null,
        TypesList: null,
        TaskDateStatus: [],
        New: true
      };
    }
    else {
      temp = {
        RequestCode: request.requestNew ? null : request.RequestCode,
        TaskNumber: taskNum,
        TaskName: null,
        confirmation: currentTask.confirmation,
        TaskDescription: currentTask.TaskDescription,
        TaskHour: currentTask.TaskHour,
        DatesForTask: currentTask.DatesForTask,
        Confirmation: currentTask.Confirmation,
        NumOfVulRequired: currentTask.NumOfVulRequired,
        Lat: currentTask.Lat,
        Lng: currentTask.Lng,
        CityName: currentTask.CityName,
        CityCode: currentTask.CityCode,
        TypesList: currentTask.TypesList,
        TaskDateStatus: [],
        New: true
      };
    }

    let newTaskList = [temp, ...request.Task]

    newTaskList = sortList(newTaskList);

    carouselRef.current.snapToItem(0);
    setCurrentTask(temp)
    setRequest({ ...request, Task: newTaskList })

  }

  const sortList = (newTaskList) => {
    newTaskList.sort(function (x, y) {
      return x.TaskNumber - y.TaskNumber;
    });
    return newTaskList;
  }

  const [adressModalVisiable, setAdressModalVisiable] = useState(false)

  const [datesModalVisiable, setDatesModalVisiable] = useState(false)


  const [dialogCopyOrNew, setDialogCopyOrNew] = useState(false);

  const addNewType = () => {
    let newType = newTypeText.newType;
    setNewTypeText({ ...newTypeText, submit: true })

    addType(newType).then(
      (result) => {
        if (result == "OK") {
          setListOfTypes([...listOfTypes, newType])
        }
      },
      (error) => {
        console.log("Could not get the types in addRequest", error);
      });
  }

  const [addNewTypeDialog, setAddNewTypeDialog] = useState(false);

  const [newTypeText, setNewTypeText] = useState({
    submit: false,
    newType: "",
  });

  const renderItem = ({ item, index }) => {

    return (
      <ScrollView
        scrollEnabled={true}
        style={{ alignSelf: 'center', width: "100%", height: screenHeight * 0.5, }}
        contentContainerStyle={{ alignItems: 'center', borderColor: 'black', borderWidth: 3, }}
      >
        <View style={styles.iconsBox}>
          <TouchableOpacity onPress={() => setDialogCopyOrNew(true)}>
            <Entypo style={styles.icons} name="circle-with-plus" size={20} color="#F8B11C" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setModalDialog(true)}>
            <FontAwesome5 style={styles.icons} name="trash" size={17} color="#F8B11C" />
          </TouchableOpacity>
        </View>
        <View style={{ width: '80%', }}>
          <Text style={styles.title}>פרטי משימה</Text>
          <TextInput style={styles.input}
            value={item.TaskName}
            placeholder='שם משימה'
            onChangeText={(text) => setTask(item.TaskNumber, "TaskName", text)}
            maxLength={30}
          />
          {item.TaskName == "" ? <Text style={styles.errorText}>לא ניתן להשאיר ריק</Text> : null}

          <TextInput style={[styles.input, { textAlignVertical: 'top' }]}
            value={item.TaskDescription}
            placeholder="תיאור משימה"
            onChangeText={(text) => setTask(item.TaskNumber, "TaskDescription", text)}
            multiline={true}
            numberOfLines={2}
            maxLength={100}
          />
          {item.TaskDescription == "" ? <Text style={styles.errorText}>לא ניתן להשאיר ריק</Text> : null}

          <View style={{ flexDirection: 'row', alignItems: 'center', width: '90%' }}>
            <Text style={{ textAlign: 'left', width: '72%', }}>מספר מתנדבים רצוי</Text>
            <View style={{ width: "25%" }}>
              <TextInput
                style={[styles.input, { alignSelf: 'flex-start', padding: 3, textAlign: 'center' }]}
                value={(item.NumOfVulRequired).toString()}
                onChangeText={(text) => setTask(item.TaskNumber, "NumOfVulRequired", text)}
                keyboardType='numeric'
                maxLength={2}
              />
            </View>
          </View>
          {item.NumOfVulRequired == "" ? <Text style={styles.errorText}> לא ניתן להשאיר ריק </Text> : null}

          <View style={{ width: "100%", justifyContent: 'center', alignItems: 'center', marginTop: 2 }}>

            <ToggleSwitch
              isOn={item.Confirmation}
              onColor="#52B69A"
              offColor="black"
              label="אני רוצה לאשר משתבצים"
              labelStyle={{ color: "black", fontWeight: "400" }}
              size="medium"
              onToggle={(bool) => {
                setTask(item.TaskNumber, "Confirmation", bool)
              }}
              icon={item.Confirmation ?
                <Ionicons name="checkmark" size={15} color="#52B69A" />
                : <Feather name="x" size={15} color="black" />
              }
            />

          </View>
        </View>
        <View style={{ borderTopColor: "#F8B11C", borderTopWidth: 2, marginTop: 15, marginBottom: 10, width: '80%', alignSelf: 'center' }} />

        <Text style={styles.title}>פרטי מיקום, תאריך ושעה</Text>


        <View style={[styles.row, { justifyContent: 'space-between' }]}>
          <TouchableOpacity style={styles.datesStyle} onPress={() => setAdressModalVisiable(true)}>
            <View style={styles.row}>
              <Ionicons name="location" size={25} color="#F8B11C" />
              <Text style={styles.selectedTxt}> כתובת </Text>
            </View>
            <View>
              <Text style={styles.txt}>  {item.CityName != "" ? item.CityName : <Text style={styles.errorText}>לא ניתן להשאיר ריק</Text>}  </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.datesStyle} onPress={() => {
            showTimeModal(true)
            setCurrentTask(item)
          }}>
            <View style={styles.row}>
              <Ionicons name="time" size={25} color="#F8B11C" />
              <Text style={styles.selectedTxt}>  שעת התחלה </Text>
            </View>
            <Text style={styles.txt}>  {item.TaskHour != null ? item.TaskHour.substring(0, 5) : null}  </Text>
            {item.TaskHour == "" ? <Text style={styles.errorText}>לא ניתן להשאיר ריק</Text> : null}
          </TouchableOpacity>
        </View>

        <View>
          <TouchableOpacity style={styles.datesStyle} onPress={() => {
            setOpenCalendar(true)
            setCurrentTask(item)

          }}>
            <View style={styles.row}>
              <Ionicons name="calendar" size={25} color="#F8B11C" />
              <Text style={styles.selectedTxt}> בחירת תאריכים </Text>
            </View>
            <View>
              <ModalCustom setClose={setDatesModalVisiable} visible={datesModalVisiable} content={
                <View>
                  <FlatList
                    data={currentTask == null ? [] : currentTask.DatesForTask}
                    keyExtractor={((item, index) => index)}
                    renderItem={({ item }) => {
                      return (
                        <View style={{
                          backgroundColor: 'white',
                          borderBottomColor: 'black',
                          borderBottomWidth: 1,
                          padding: 10,
                          flexDirection: 'row',
                          width: "80%", alignSelf: 'center'
                        }}>
                          <TouchableOpacity onPress={() => RemoveDate(currentTask, item)}
                            style={{
                              justifyContent: 'center',
                              alignItems: 'center',
                              width: '20%',
                            }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 12 }}> הסר </Text>
                          </TouchableOpacity>
                          <Text style={{ width: "80%" }}> {moment(item).format("DD/MM/YYYY")} </Text>

                        </View>
                      )
                    }}

                  />
                  <TouchableOpacity onPress={() => setDatesModalVisiable(false)}>
                    <Text style={{ textAlign: 'center', fontWeight: 'bold', marginTop: 20 }}> סגור </Text>
                  </TouchableOpacity>
                </View>

              } />

            </View>
          </TouchableOpacity>
          {item.DatesForTask == null ? null : item.DatesForTask.length == 0 ? <Text style={styles.errorText}>המשימה צריכה להתקיים בתאריך אחד לפחות</Text> :
            <TouchableOpacity onPress={() => {
              setDatesModalVisiable(true)
              setCurrentTask(item)
            }
            }>
              <Text> צפייה בתאריכים נבחרים</Text>
            </TouchableOpacity>
          }
        </View>

        {currentTask != null &&
          <ModalCustom setClose={setOpenCalendar} visible={openCalendar} content={
            <CalendarBoard
              dates={currentTask.DatesForTask}
              setDate={setDates}
              setOpen={setOpenCalendar}
              cantCancelDates={currentTask.TaskDateStatus}
            />
          } />
        }
        <View>

          {TimeModal ? Platform.OS === 'android' ?
            <DateTimePicker
              style={{ backgroundColor: 'green' }}
              value={new Date()}
              mode='time'
              is24Hour={true}
              onChange={onChange}
              display="clock"
            />
            :
            <TimePickerModal
              visible={showTimeModal}
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

        <Text style={styles.title}>תחומי המשימה</Text>
        <View style={{ width: "100%" }}>
          <View style={styles.list}>
          
            {
              listOfTypes.map((type, index) => {
                let bool = false;
                if (item.TypesList != null) {
                  bool = item.TypesList.some(x => x == type)
                }
                if (type != "כל התחומים") {
                  return (
                    <CubeTypeCopy key={index} type={type} taskNumber={item.TaskNumber} typeChose={addTypeToList} color={bool} />)
                }
              })
            }
            <Entypo name="circle-with-plus" size={20} color="#52B69A" onPress={() => setAddNewTypeDialog(true)} />
          </View>

          {item.TypesList == null ? null : item.TypesList.length == 0 ? <Text style={styles.errorText}>המשימה צריכה להשתייך לתחום אחד לפחות</Text> : null}

        </View>

      </ScrollView>

    )

  }


  return (
    <View style={{ width: screenWidth, height: screenHeight * 0.70 }}>
      <CustomDialog setClose={setModalDialog} visible={modalDialog} title="נא לשים לב" content={
        <View style={{ height: 300 }}>
          <Text style={styles.ModalText}>לאחר המחיקה לא יהיה ניתן לשחזר את המשימה</Text>
          <View style={[styles.row, { justifyContent: 'space-around', height: "30%", alignItems: 'flex-end' }]}>
            <TouchableOpacity style={styles.btnModal} onPress={() => setModalDialog(false)}>
              <Text style={styles.textBtnModal}>חזור</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnModal} onPress={() => {
              removeTask(currentTask);
              setModalDialog(false)
            }}>
              <Text style={styles.textBtnModal}>אשר</Text>
            </TouchableOpacity>
          </View>
        </View>
      } />

      <CustomDialog setClose={setDialogUpload} visible={dialogUpload} title={request.RequestNew? "המשימה נוספה בהצלחה" : "המשימה נערכה בהצלחה"} content={
        <View style={{ height: 200 }}>
          <Text style={styles.ModalText}>ניתן לצפות בבקשות שלך באיזור האישי.</Text>
          <View style={[styles.row, { justifyContent: 'space-around', height: "30%", alignItems: 'flex-end' }]}>
            <TouchableOpacity style={styles.btnModal} onPress={() => {
              setDialogUpload(false)
              moveBack(false)
            }}>
              <Text style={styles.textBtnModal}> הבנתי </Text>
            </TouchableOpacity>
          </View>
        </View>
      } />

      <CustomDialog setClose={setAddNewTypeDialog} visible={addNewTypeDialog} title="הוספת תחום עניין חדש" content={
        <View style={{ height: 250 }}>
          {newTypeText.submit ?
            <Text style={styles.ModalText}>הבקשה נשלחה, במידה ותאושר תחום זה יופיע למשתמשים האחרים</Text>
            : <View>
              <Text style={styles.ModalText}>אנא וודא שלא קיים תחום עניין דומה</Text>
              <TextInput style={[styles.input, { alignSelf: 'center' }]} onChangeText={(text) => setNewTypeText({ ...newTypeText, newType: text })} />
            </View>
          }
          <View style={[styles.row, { justifyContent: 'space-around', height: "20%", alignItems: 'flex-end' }]}>
            <TouchableOpacity style={styles.btnModal} onPress={() => {
              setAddNewTypeDialog(false)
              setNewTypeText({ ...newTypeText, submit: false })
            }}>
              <Text style={styles.textBtnModal}> חזור </Text>
            </TouchableOpacity>
            {newTypeText.submit ? null :
              <TouchableOpacity style={styles.btnModal} onPress={() => {
                addNewType()
              }}>
                <Text style={styles.textBtnModal}> שליחה </Text>
              </TouchableOpacity>
            }
          </View>
        </View>
      } />

      <CustomDialog setClose={setDialogCopyOrNew} visible={dialogCopyOrNew} title="הוספה או העתקה" content={
        <View style={{  }}>
          <Text style={styles.ModalText}>האם תרצו להעתיק את המשימה הנוכחית או לייצר משימה חדשה?</Text>
          <View style={[styles.row, { justifyContent: 'space-around', alignItems: 'flex-end' }]}>
            <TouchableOpacity style={styles.btnModal} onPress={() => {
              addTask("copy")
              setDialogCopyOrNew(false)
            }}>
              <Text style={styles.textBtnModal}> להעתיק </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnModal} onPress={() => {
              addTask("new")
              setDialogCopyOrNew(false)
            }}>
              <Text style={styles.textBtnModal}> חדשה </Text>
            </TouchableOpacity>
          </View>
        </View>
      } />

      <ModalCustom setClose={setAdressModalVisiable} visible={adressModalVisiable} content={
        <View style={{ height: 200 }}>
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
              setAdress(
                data.description,
                details.geometry.location.lat,
                details.geometry.location.lng,
              )
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
      } />
      <View style={[styles.accordionsBox]}>
        <TextInput
          style={styles.input}
          value={request.RequestName}
          placeholder="שם הבקשה"
          onChangeText={(text) => setRequest({ ...request, RequestName: text })}
          maxLength={30}
        />
        {request.RequestName == "" ? <Text style={styles.errorText}> לא ניתן להשאיר ריק </Text> : null}

        <View style={{ width: "100%", justifyContent: 'center', alignItems: 'center', marginBottom: 5, flexDirection: 'row' }}>

          <CustomPopUp dialog={dialog} setDialog={setDialog} />
          <TouchableOpacity onPress={() => {
            setDialog({
              visible: true,
              textBody: "אנו לא נפרסם את בקשתך בעמוד הבקשות. יהיה ניתן להפיץ את הבקשה באמצעות לינק אישי.",
              textTitle: "בקשה אישית",
            });
          }}>
            <FontAwesome name="question-circle" size={24} color="black" />
          </TouchableOpacity>
          <ToggleStyle text="הפוך בקשה לאישית" state={request.PrivateRequest} func={setPriavteRequest} />
        </View>

        <View style={{ borderTopColor: "#F8B11C", borderTopWidth: 2, marginTop: 5, marginBottom: 10, width: '80%', alignSelf: 'center' }} />

      </View>
      <Carousel
        data={request.Task}
        renderItem={renderItem}
        sliderWidth={screenWidth * 0.97}
        itemWidth={screenWidth * 0.83}
        style={{ alignself: 'center', alignItems: 'center' }}
        onSnapToItem={(index) => {
          setCurrentTask(request.Task[request.Task.length - 1 - index])
          carouselRef.current.snapToItem(index);
        }}
        ref={carouselRef}
        activeSlideAlignment='center'
      />
      <TouchableOpacity disabled={false} onPress={() => { closeAndSave(); setLoading(true) }} style={styles.btn}>
        <Text style={styles.btntext}>שמור</Text>
      </TouchableOpacity>
    </View>
  )
}

export default EditRequest

const styles = StyleSheet.create({
  input: {
    color: 'black',
    borderColor: 'black',
    borderWidth: 1,
    padding: 5,
    borderRadius: 10,
    //marginLeft: 10,
    textAlign: 'right',
    margin: 5,
    width: "90%",

  },
  accordionsBox: {
    marginTop: 0,
    width: "90%",
    alignSelf: 'center',
  },
  row: {
    flexDirection: 'row',
    width: "85%",
    alignSelf: 'center'
  },
  datesStyle: {
    justifyContent: 'center',
    alignItems: 'center',

  },
  title: {
    fontSize: 18,
    color: '#52B69A',
    alignSelf: 'center',
    fontWeight: 'bold',
    margin: 2
  },
  list: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 5
  },
  errorText: {
    color: 'red',
    fontSize: 12
  },
  txt: {
    marginBottom: 20
  },
  middle: {
    position: 'absolute',
    top: "30%",
    alignSelf: 'center',
    width: "90%",
  },
  txtBtn: {
    fontWeight: 'bold',
    fontSize: 12,

  },
  btnClose: {
    bottom: 3,
    position: 'absolute',
    alignSelf: 'center',
  },
  selectedTxt: {
    fontSize: 14,
    fontWeight: 'bold'
  },
  iconsBox: {
    position: 'absolute',
    flexDirection: 'row',
    right: 5,
    alignItems: 'center',
  },
  icons: {
    margin: 5
  },
  ModalText: {
    margin: 10,
    fontSize: 15
  },
  btnModal: {
    paddingTop: 20,
    paddingBottom:10
  },
  textBtnModal: {
    fontSize: 14,
    fontWeight: 'bold'
  },
  btn: {
    marginTop: 20,
    width: "50%",
    backgroundColor: "#52B69A",
    color: "black",
    alignSelf: 'center',
    padding: 7,
    borderRadius: 20,
    fontSize: 18,
    borderColor: "#52B69A",
    borderWidth: 1,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.5,
    shadowRadius: 1.8,
    elevation: 5
  },
  btntext: {
    textAlign: 'center',
    fontSize: 14,
    color: 'white',
  }


})
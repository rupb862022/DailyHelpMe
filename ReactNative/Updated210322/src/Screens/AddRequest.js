import { StyleSheet, TextInput, Text, View, SafeAreaView, FlatList, TouchableOpacity, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react'
import InputStyle from '../ComponentStyle/InputStyle'
import { Ionicons, Feather } from '@expo/vector-icons';
import ToggleStyle from '../ComponentStyle/ToggleStyle';
import { List } from 'react-native-paper';
import ButtonCustom from '../ComponentStyle/ButtonCustom';
import CubeType from '../ComponentStyle/CubeType';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import CalendarBoard from '../Components/CalendarBoard';


const AddRequest = () => {

  const GOOGLE_PLACES_API_KEY = 'AIzaSyD_GGypBzDabu8UYars4z1DTFG8PLRsvY4';

  const [birthdate, setBirthdate] = useState(new Date());
  const [listOfTypes, setlistOfTypes] = useState([])
  const [adress, setAdress] = useState();

  const [confirmation, setConfirmation] = useState(false)
  const [expanded, setExpanded] = useState(true);
  const [adressOk, setAdressOk] = useState(true);
  const [birthdateOk, setBirthdateOk] = useState(true);
  const [taskNameOk, setTasNamekOk] = useState(true);
  const [taskDisOk, setTasDisOk] = useState(true);


  const [requestName, setRequestName] = useState(null);
  const [privateRequest, setPrivateRequest] = useState(true);
  const [taskName, setTaskName] = useState('שם המשימה');
  const [taskDis, setTaskDis] = useState();

  const [numOfVul, setNumOfVul] = useState(1)

  const [openCalendarStart,setOpenCalendarStart]= useState();
  const [openCalendarEnd,setOpenCalendarEnd] = useState();

  const [startDate, setStartDate] = useState(true);
  const [EndDate, setEndDate] = useState(true);

  const handlePress = () => setExpanded(!expanded);


  const checkRequestName = () => {
    if (requestName == null) {
      setAdressOk(false)
      return;
    }
  }

  const checkAdress = () => {
    if (adress == null) {
      setAdressOk(false)
      return;
    }
  }
  const checkBirthday = () => {
    if (birthdate == null) {
      setBirthdateOk(false)
      return;
    }
  }
  const checkTaskName = () => {
    if (taskName == null) {
      setTasNamekOk(false)
      return;
    }
  }
  const checkTaskDiscripthion = () => {
    if (taskDis == null) {
      setTasDisOk(false)
      return;
    }
  }

  useEffect(() => {
    const apiUrl = 'https://proj.ruppin.ac.il/bgroup86/prod/api/Types';

    fetch(apiUrl, {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json; charset=UTF-8',
        'Accept': 'application/json; charset=UTF-8',
      })
    })
      .then(res => {
        return res.json()
      })
      .then(
        (result) => {
          setlistOfTypes(result)
          console.log("res", result)
        },
        (error) => {
          console.log("err post=", error);
        });
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <TextInput style={styles.inputStyle} placeholder="שם הבקשה" onChangeText={(text) => setRequestName(text)} onEndEditing={checkRequestName} />
      <ToggleStyle state={privateRequest} text=" הפוך בקשה לאישית" func={setPrivateRequest} />
      <ScrollView style={styles.container1}>
        <List.Section  >
          <List.Accordion
            title={taskName}
            left={props => <List.Icon {...props} icon="folder" />}>
            <List.Item
              description={
                <View style={styles.list}>
                  <TextInput style={styles.inputStyle} placeholder='שם משימה' onChangeText={(text) => setTaskName(text)} onEndEditing={checkTaskName} />
                  <TextInput style={styles.inputStyle} placeholder="תיאור משימה" onChangeText={(text) => setTaskDis(text)} onEndEditing={checkTaskDiscripthion} />
                  <Text> מספר מתנדבים רצוי </Text>
                  <TextInput style={styles.inputStyle} value={numOfVul} onChangeText={(text) => setNumOfVul(text)} />
                  <ToggleStyle state={confirmation} text=" אני רוצה לאשר משתבצים" func={setConfirmation} />
                </View>
              } />
          </List.Accordion>
          <List.Accordion
            title="בחירת תחומים"
            left={props => <List.Icon {...props} icon="folder" />}>
            <List.Item description={<View style={styles.list}>
              <FlatList
                columnWrapperStyle={true}
                contentContainerStyle={{
                  margin: 5,
                  alignItems: 'flex-end',
                }}
                numColumns={3}
                data={listOfTypes}
                keyExtractor={(item) => item}
                renderItem={({ item }) => {
                  return (
                    <CubeType type={item} />)
                }}
              />
            </View>} />
          </List.Accordion>

          <List.Accordion
            title="זמן המשימה"
            left={props => <List.Icon {...props} icon="folder" />}>
            <List.Item description={<View style={styles.list}>
              <View style={styles.inputBox} >
                <GooglePlacesAutocomplete
                  suppressDefaultStyles={true}
                  listUnderlayColor='#52B69A'
                  numberOfLines={3}
                  textInputProps={{
                    color: 'black',
                    textAlign: 'right'
                  }}
                  styles={{
                    listView: {
                      width: '100%',
                      right: -25
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
                    // 'details' is provided when fetchDetails = true
                    func(data, details);

                  }}
                  query={{
                    key: GOOGLE_PLACES_API_KEY,
                    language: 'iw',
                    region: 'il'
                  }}

                />


              </View>

              <TouchableOpacity onPress={() => setOpenCalendarStart(true)}>
                <InputStyle placeHolderText="תאריך לידה" icon="Ionicons" nameOfIcon="calendar" func={setBirthdate} funcForCheck={checkBirthday}
                />
              </TouchableOpacity>
               {openCalendarStart ? <CalendarBoard setDate={setStartDate}/> : null}     
              

              
               <TouchableOpacity onPress={() => setOpenCalendarStart(true)}>
                <InputStyle placeHolderText="תאריך לידה" icon="Ionicons" nameOfIcon="calendar" func={setBirthdate} funcForCheck={checkBirthday}
                />
              </TouchableOpacity>
               {openCalendarStart ? <CalendarBoard setDate={setStartDate}/> : null}     
            </View>}
            />
          </List.Accordion>


        </List.Section>
      </ScrollView>
    </SafeAreaView>
  )
}

export default AddRequest

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    alignItems: 'flex-end',
  },
  container1: {
    marginTop: 20,
    width: "100%",
    direction: 'rtl',
  },
  accordionsBox: {
    width: '100%',
  },
  input: {
    color: 'black',
    marginRight: 5,
    flex: 1,
    textAlign: 'right',
  },
  list: {
    width: "100%",
    alignItems: 'flex-start',
  },
  inputBox: {
    flexDirection: "row",
    borderWidth: 1,
    padding: 12,
    borderColor: 'black',
    borderRadius: 20,
    width: '80%',
    justifyContent: 'flex-end',
    margin: 10,
  },
  inputStyle: {
    borderColor: 'black',
    borderWidth: 1,
    padding: 10,
    borderRadius: 20,
    width: '80%'
  }
})
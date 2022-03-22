import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Modal, SafeAreaView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Entypo } from '@expo/vector-icons';
import { Checkbox } from 'react-native-paper';
import CalendarBoard from './CalendarBoard';
import ButtonCustom from '../ComponentStyle/ButtonCustom';
import InputStyle from '../ComponentStyle/InputStyle'

const StageTwoRegi = () => {

  const [date, setDate] = useState();
  const [open, openCalendar] = useState(false)

  const [checkedM, setCheckedM] = useState(true);
  const [checkedW, setCheckedW] = useState(false);

  const [email, setEmail] = useState();
  const [birthdate, setBirthdate] = useState();
  const [adress, setAdress] = useState();
  const [iD, setID] = useState();

  const [Gender, setGender] = useState("M")

  useEffect(() => {
    openCalendar(false)
  }, [date])

  const checkEmails = () => {

  }

  const checkId = () => {

  }

  const checkAdress=()=>{

  }

  const checkBirthday=()=>{
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.checkBoxBox}>
        <Text> גבר </Text>
        <Checkbox
          status={checkedM ? 'checked' : 'unchecked'}
          color='#52B69A'
          onPress={() => {
            if (checkedM) {
              setCheckedM(false)
              setCheckedW(true)
            }
            else {
              setCheckedM(true)
              setCheckedW(false)
            }
          }
          } />

        <Text> אישה </Text>
        <Checkbox
          status={checkedW ? 'checked' : 'unchecked'}
          color='#52B69A'
          onPress={() => {
            if (checkedW) {
              setCheckedW(false)
              setCheckedM(true)
            }
            else {
              setCheckedW(true)
              setCheckedM(false)
            }
          }
          } />

      </View>


      <InputStyle placeHolderText="כתובת" icon="Ionicons" nameOfIcon="location" func={setAdress} funcForCheck={checkAdress} />
      {true ? null : <Text> נא להקליד שנית </Text>}


      <InputStyle placeHolderText="אימייל" icon="MaterialIcons" nameOfIcon="email" func={setEmail} funcForCheck={checkEmails} max={30} />
      {true ? null : <Text> נא להקליד שנית </Text>}

      <TouchableOpacity onPress={() => openCalendar(true)}>
        <InputStyle placeHolderText="תאריך לידה" icon="Ionicons" nameOfIcon="calendar" func={setBirthdate} funcForCheck={checkBirthday} />
        {true ? null : <Text> נא לבחור תאריך </Text>}
      </TouchableOpacity>
      <Modal
        animationType="slide"
        visible={open}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          openCalendar(false);
        }}
      >
        <TouchableOpacity style={styles.modalS} onPressOut={() => {
          openCalendar(false);
        }}>
          <CalendarBoard setDate={setDate} />
        </TouchableOpacity >
      </Modal>

      <InputStyle placeHolderText="תעודת זהות" icon="FontAwesome" nameOfIcon="id-card" func={checkId} funcForCheck={checkId}  max={9}/>
      {true ? null : <Text> נא להקליד שנית </Text>}


      <View style={styles.btnBox}>
        <TouchableOpacity style={styles.btnStyle} >
          <Text> העלאת תמונה </Text>
          <Entypo name="upload" size={18} color="#F8B11C" />
        </TouchableOpacity>
      </View>

      <ButtonCustom textInBtn="המשך" />

    </SafeAreaView>

  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: 'center',
    width: '100%',
    marginTop: 20
  },
  btnStyle: {
    width: '55%',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    backgroundColor: 'lightgrey',
    borderRadius: 15,
    padding: 12,
    borderColor: 'black',
    borderWidth: 1,
    flexDirection: 'row',
    fontSize: 12
  },
  btnBox: {
    width: '80%',
    marginTop: 10,

  },
  checkBoxBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },

  modalS: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
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
  input: {
    color: 'black',
    marginRight: 5,
    flex: 1,
    textAlign: 'right',
  },

})


export default StageTwoRegi;
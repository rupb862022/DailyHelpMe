import { ScrollView, Button, StyleSheet, Text, View, TouchableOpacity, Modal, SafeAreaView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Entypo } from '@expo/vector-icons';
import { Checkbox } from 'react-native-paper';
import CalendarBoard from './CalendarBoard';
import ButtonCustom from '../ComponentStyle/ButtonCustom'
import InputStyle from '../ComponentStyle/InputStyle'
//import DateTimePicker from '@react-native-community/datetimepicker';
import { DatePicker } from "react-native-common-date-picker";

const StageTwoRegi = ({ checkAndMove, setOpenCamera }) => {

  const [date, setDate] = useState({
      dateChose:'',
      visible:false
  });
 
  const [birthdate, setBirthdate] = useState(new Date());
  const [openCalendarP, setOpenCalendar] = useState(false)


  const [checkedM, setCheckedM] = useState(true);

  const [email, setEmail] = useState();

  // const [openCamera,setOpenCamera] = useState(false)

  var maxDate = new Date();
  maxDate.setFullYear((new Date().getFullYear() - 18))


  const [adress, setAdress] = useState();
  const [iD, setID] = useState();

  const [emailOk, setEmailOk] = useState();
  const [idOk, setIdOk] = useState();


  const checkEmails = () => {
    if (email == null) {
      setEmailOk(false)
      return;
    }
  }

  const checkId = () => {
    if (iD == null) {
      setIdOk(false)
      return;
    }
    (iD.length == 9) ? setIdOk(true) : setIdOk(false)
  }

  const checkAdress = () => {

  }

  const checkBirthday = () => {

  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.checkBoxBox}>
        <Text> גבר </Text>
        <Checkbox
          status={checkedM ? 'checked' : 'unchecked'}
          color='#52B69A'
          onPress={() => {
            checkedM ? setCheckedM(false) : setCheckedM(true)
          }}
        />
        <Text> אישה </Text>
        <Checkbox
          status={checkedM ? 'unchecked' : 'checked'}
          color='#52B69A'
          onPress={() => {
            checkedM ? setCheckedM(false) : setCheckedM(true)
          }}
        />
      </View>


      <InputStyle placeHolderText="כתובת" icon="Ionicons" nameOfIcon="location" func={setAdress} funcForCheck={checkAdress} />
      {true ? null : <Text> נא להקליד שנית </Text>}


      <InputStyle placeHolderText="אימייל" icon="MaterialIcons" nameOfIcon="email" func={setEmail} funcForCheck={checkEmails} max={30} />
      {true ? null : <Text> נא להקליד שנית </Text>}

      {/* <Button title="Open" onPress={() => setOpenCalendar(true)} /> 
      <DateTimePicker 
      value={new Date()}
      onChange={setBirthdate} 
      dateFormat="dayofweek day month"
      style={{backgroundColor: "black"}}
      dayOfWeekFormat={'{dayofweek.full}'}
      onTouchCancel={() => setOpenCalendar(false)}
      /> */}



      <TouchableOpacity onPress={() => setDate({visible:true})}>
        <InputStyle placeHolderText="תאריך לידה" icon="Ionicons" nameOfIcon="calendar" func={null} funcForCheck={checkBirthday}
          value={date.dateChose} />
        {true ? null : <Text> נא לבחור תאריך </Text>}
      </TouchableOpacity>

      <Modal visible={date.visible}>
        <View style={styles.modalContainer}>
          <View style={styles.boxModal}>
            <DatePicker    
              confirm={date => {             
                setDate({
                  dateChose:date,
                  visible:false
                })
                console.warn(date)
              }}
              cancel={()=> setDate({visible:false})}
              type='DD-MM-YYYY'
              minDate='1925-01-01'
              maxDate={maxDate}
              toolBarPosition='bottom'
              toolBarStyle={{
                width: '60%',
                alignSelf: 'center',
                borderWidth: 0,
                
              }}
              toolBarCancelStyle={{
                color: '#52B69A',
                fontWeight: 'bold'
              }}
              toolBarConfirmStyle={{
                color: '#52B69A',
                fontWeight: 'bold'
              }}
              confirmText='אישור'
              cancelText='חזור'
              selectedTextColor='#52B69A'
              selectedBorderLineColor='#52B69A'
            />
          </View>
        </View>
      </Modal>


      {/* {open ? (
        <View style={styles.boxModal} >
          <TouchableOpacity styles={styles.modalS} onPressOut={() => openCalendar(false)}>
            <CalendarBoard setDate={setDate} />
          </TouchableOpacity >
        </View>
      ) : null} */}


      <InputStyle placeHolderText="תעודת זהות" icon="FontAwesome" nameOfIcon="id-card" func={checkId} funcForCheck={checkId} max={9} />
      {true ? null : <Text> נא להקליד שנית </Text>}


      <View style={styles.btnBox}>
        <TouchableOpacity style={styles.btnStyle} onPress={() => {
          {
            setOpenCamera(true)
          }
        }}>
          <Text> העלאת תמונה </Text>
          <Entypo name="upload" size={18} color="#F8B11C" />
        </TouchableOpacity>
      </View>



      <ButtonCustom textInBtn="המשך" func={checkAndMove} />

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
  boxModal: {
    position: "absolute",
    zIndex: 1,
    borderColor: 'black',
    borderWidth: 1,
    padding:5,

  },
  modalContainer:{
    height: '100%',
    width: '100%',
    justifyContent: 'center',
  }



})


export default StageTwoRegi;
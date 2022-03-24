import { ScrollView, Button, StyleSheet, Text, View, TouchableOpacity, Modal, SafeAreaView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Entypo } from '@expo/vector-icons';
import { Checkbox } from 'react-native-paper';
import CalendarBoard from './CalendarBoard';
import ButtonCustom from '../ComponentStyle/ButtonCustom'
import InputStyle from '../ComponentStyle/InputStyle'
//import DateTimePicker from '@react-native-community/datetimepicker';

const StageTwoRegi = ({ checkAndMove ,openCameraStageTwo}) => {

  const [date, setDate] = useState();
  const [open, openCalendar] = useState(false)

  const [birthdate, setBirthdate] = useState(new Date());
  const [openCalendarP, setOpenCalendar] = useState(false)

  const [checkedM, setCheckedM] = useState(true);

  const [email, setEmail] = useState();

  const [openCamera,setOpenCamera] = useState(false)

  const [adress, setAdress] = useState();
  const [iD, setID] = useState();

  const [emailOk, setEmailOk] = useState();
  const [idOk, setIdOk] = useState();

  useEffect(() => {
    openCalendar(false)
  }, [date])

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


  // let photo = await this.camera.takePictureAsync({
  //   quality: 0.1,
  //   base64: true,
  // });
  // this.setState({
  //   pic64base: photo.base64,
  //   picName64base: 'image1_' + new Date().getTime() + '.jpg',
  //   picUri: `data:image/gif;base64,${photo.base64}`,
  // });

  // uploadBase64ToASMX = () => {
  //   this.setState({ animate: true });
  //   let urlAPI =
  //     'http://ruppinmobile.tempdomain.co.il/site01/webservice.asmx/ImgUpload';
  //   fetch(urlAPI, {
  //     method: 'POST',
  //     body: JSON.stringify({
  //       base64img: this.state.pic64base,
  //       base64imgName: this.state.picName64base,
  //     }

  //     )
  //   }
  //   let photo = await this.camera.takePictureAsync({ quality: 0.7 });

  //   const config = {
  //     method: 'POST',
  //     body: dataI,
  //   }

  //   fetch(urlAPI, config)
  //     .then((res) => {
  //       if (res.status == 201) { return res.json(); }
  //       else { return "err"; }
  //     })
  //     .then((responseData) => {
  //       if (responseData != "err") {
  //         let picNameWOExt = picName.substring(0, picName.indexOf("."));
  //         let imageNameWithGUID = responseData.substring(responseData.indexOf(picNameWOExt),
  //           responseData.indexOf(".jpg") + 4);
  //         this.setState({
  //           uplodedPicUri: { uri: this.uplodedPicPath + imageNameWithGUID },
  //         });
  //         console.log("img uploaded successfully!");
  //       }
  //       else { alert('error uploding ...'); }
  //     })
  //     .catch(err => { alert('err upload= ' + err); });


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



      <TouchableOpacity onPress={() => openCalendar(true)}>
        <InputStyle placeHolderText="תאריך לידה" icon="Ionicons" nameOfIcon="calendar" func={setBirthdate} funcForCheck={checkBirthday}
          value={date} />
        {true ? null : <Text> נא לבחור תאריך </Text>}
      </TouchableOpacity>

      {open ? (
        <View style={styles.boxModal} >
          <TouchableOpacity styles={styles.modalS} onPressOut={() => openCalendar(false)}>
            <CalendarBoard setDate={setDate} />
          </TouchableOpacity >
        </View>
      ) : null}


      <InputStyle placeHolderText="תעודת זהות" icon="FontAwesome" nameOfIcon="id-card" func={checkId} funcForCheck={checkId} max={9} />
      {true ? null : <Text> נא להקליד שנית </Text>}


      <View style={styles.btnBox}>
        <TouchableOpacity style={styles.btnStyle} onPress={()=> {{  
                openCameraStageTwo()
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
  modalS: {
    margin: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1,

  },
  boxModal: {
    position: "absolute",
    zIndex: 1,
  },



})


export default StageTwoRegi;
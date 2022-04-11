import { Image, StyleSheet, Text, View, TouchableOpacity, Modal, SafeAreaView,Platform } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Entypo } from '@expo/vector-icons';
import { Checkbox,IconButton } from 'react-native-paper';
import ButtonCustom from '../ComponentStyle/ButtonCustom'
import InputStyle from '../ComponentStyle/InputStyle'
import { DatePicker } from "react-native-common-date-picker";
import ErrorText from "../ComponentStyle/ErrorText";
import moment from 'moment';
import { validateEmail } from '../General/utils';
import { checkIfEmailUsed, checkIfIDValidOrUsed } from '../FetchCalls/signUpAPI';

const StageTwoRegi = ({ checkAndMove, setOpenCamera, photoUploaded, setGalleryOpen }) => {

  const [date, setDate] = useState({
    dateChose: null,
    visible: false,
  });
  const [email, setEmail] = useState();
  const [checkedM, setCheckedM] = useState(true);
  const [adress, setAdress] = useState();
  const [iD, setID] = useState();

  const [errorsList, setErrors] = useState({
    emailError: false,
    idError: false,
    adressError: false,
    dateError: false,
  });

  const [openFabGroup, setOpenFabGroup] = useState(false);

  var maxDate = new Date();
  maxDate.setFullYear((new Date().getFullYear() - 18))
  
  const movieToStageThree = () => {
    if (!errorsList.emailError && !errorsList.idError && !errorsList.adressError && !errorsList.dateError) {
      if (email != null && adress != null && date != null && iD != null) {
        checkAndMove('2', {
          Email: email,
          CityName: adress,
          DateOfBirth: date.dateChose,
          ID: iD,
          Gender: checkedM ? 'M' : 'F',          
        });
      }
    }
  }

  useEffect(() => {
    setOpenFabGroup(false)
  }, [photoUploaded])
 
  const checkEmails = () => {
    if (!validateEmail(email)) {
      setErrors({ ...errorsList, emailError: "מייל לא תקין " });
      return;
    }
    checkIfEmailUsed(email).then(
      (result) => {
        console.log("email checked successfully: ", result)
        setErrors({ ...errorsList, emailError: result });
      },
      (error) => {
        console.log("check email Failed=", error);
        setErrors({ ...errorsList, emailError: "אנא נסה שנית" });

      });
  }

  const checkId = () => {
    if (iD == null) {
      setErrors({ ...errorsList, idError: "סעיף זה חובה" })
      return;
    }
    if (iD.length != 9) {
      setErrors({ ...errorsList, idError: "תז צריכה להיות באורך 9 ספרות" })
      return;
    }

    checkIfIDValidOrUsed(iD).then(
      (result) => {
        console.log("id checked successfully: ", result)
        setErrors({ ...errorsList, idError: result });
      },
      (error) => {
        console.log("check id Failed=", error);
        setErrors({ ...errorsList, idError: "אנא נסה שנית" });

      });
  }

  const checkBirthday = () => {
    if (date.dateChose == null) {
      setErrors({ ...errorsList, dateError: "סעיף זה חובה" });
      return;
    }
    setErrors({ ...errorsList, dateError: false });
  }

  const checkAdress = () => {
    if (adress == null) {
      setErrors({ ...errorsList, adressError: "סעיף זה חובה" });
      return;
    }
    setErrors({ ...errorsList, adressError: false });
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

      <InputStyle placeHolderText="עיר מגורים" icon="Ionicons" nameOfIcon="location" func={setAdress} funcForCheck={checkAdress} />
      {errorsList.adressError != false ? <ErrorText text={errorsList.adressError} /> : null}

      <InputStyle placeHolderText="אימייל" icon="MaterialIcons" nameOfIcon="email" func={setEmail} funcForCheck={checkEmails} max={30} />
      {errorsList.emailError != false ? <ErrorText text={errorsList.emailError} /> : null}

      <InputStyle placeHolderText="תעודת זהות" icon="FontAwesome" nameOfIcon="id-card" func={setID} funcForCheck={checkId} max={9} />
      {errorsList.idError != false ? <ErrorText text={errorsList.idError} /> : null}

      <TouchableOpacity onPress={() => setDate({ visible: true })}>
        <InputStyle placeHolderText="תאריך לידה" icon="Ionicons" nameOfIcon="calendar" func={null} funcForCheck={checkBirthday}
          value={date.dateChose == null ? null : moment(date.dateChose).format("DD/MM/YYYY")} />
      </TouchableOpacity>
      {errorsList.dateError != false ? <ErrorText text={errorsList.dateError} /> : null}

      <Modal visible={date.visible}>
        <View style={styles.modalContainer}>
          <View style={styles.boxModal}>
            <DatePicker
              confirm={date => { setDate({ dateChose: date, visible: false }) }}
              cancel={() => setDate({ visible: false })}
              type='DD-MM-YYYY'
              minDate='1925-01-01'
              maxDate={maxDate}
              toolBarPosition='bottom'
              toolBarStyle={{ width: '60%', alignSelf: 'center', borderWidth: 0, }}
              toolBarCancelStyle={{ color: '#52B69A', fontWeight: 'bold' }}
              toolBarConfirmStyle={{ color: '#52B69A', fontWeight: 'bold' }}
              confirmText='אישור'
              cancelText='חזור'
              selectedTextColor='#52B69A'
              selectedBorderLineColor='#52B69A'
            />
          </View>
        </View>
      </Modal>

      <View style={styles.btnBox}>
        <TouchableOpacity style={styles.btnStyle} onPress={() => {
          openFabGroup ? setOpenFabGroup(false) : setOpenFabGroup(true)
        }}>
          <Text> העלאת תמונה </Text>
          <Entypo name="upload" size={18} color="#F8B11C" />
        </TouchableOpacity>
        {photoUploaded == null ? null : <View>     
          <Image style={styles.imageS} source={{ uri: photoUploaded }} />
        </View>
        }
        {openFabGroup &&
          <View style={styles.fabS}>
            <IconButton
              style={styles.buttonIcon}
              size={30}
              icon="camera"
              visible={openFabGroup}
              onPress={() => setOpenCamera(true)}
            />
            <IconButton
              style={styles.buttonIcon}
              size={30}
              icon='image-album'
              visible={openFabGroup}
              onPress={() => setGalleryOpen(true)}
            />
          </View>
        }
      </View>
      <ButtonCustom textInBtn="המשך" func={movieToStageThree} />
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
  labelStyle: {
    width: 100,
  },
  fabS: {
    position: 'absolute',
    bottom: 30,
    left: 10,
    flexDirection: 'row',
  },
  buttonIcon: {
    backgroundColor: '#52B69A'
  },
  btnStyle: {
    width: '55%',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
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
    flexDirection: 'row',
    alignItems: 'center'
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
    padding: 5,

  },
  modalContainer: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
  },
  imageS: {
    width: 50,
    height: 50,
    borderRadius: 30,
    alignSelf: 'center',
    marginLeft: 10
  },
})


export default StageTwoRegi;
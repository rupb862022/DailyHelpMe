import { StyleSheet, Text, SafeAreaView } from 'react-native';
import React, { useState } from 'react';
import ButtonCustom from '../ComponentStyle/ButtonCustom'
import InputStyle from '../ComponentStyle/InputStyle'


const StageOneRegi = ({ nextStage }) => {

  const [phone, setPhone] = useState();
  const [password, setPassword] = useState();
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();

  const [firstNameOk, setFirstNameOk] = useState(true);
  const [lastNameOk, setLastNameOk] = useState(true);
  const [passwordOk, setPasswordOk] = useState(true);
  const [phoneOk, setPhoneOk] = useState(true);

  const checkValuesAndNext = () => {
    ///פונקציה לבדוק תקינות ואז להעביר לעמוד הבא
    console.log(phone, password, firstName, lastName)
    if(firstNameError && lastNameError && passwordError && phoneError)
      { 
          if(phone != null &&  password != null &&  firstName!=null && lastName!=null)
          {
            //nextStage()
          }
      }
  }

  const checkFirstName = () => {
    
    if(firstName==null)
      {
        setFirstNameOk(false)
        return;
      }
    
    for (let index = 0; index < firstName.length; index++) {
      if (firstName[index] == 32 || firstName[index] == 45) {
        setFirstNameOk(true)
      }
      else if (firstName[index] < 65 || 122 < firstName[index]) {
        setFirstNameOk(false)
        return;
      }
      else if (firstName[index] > 90 && 97 > firstName[index]) {
        setFirstNameOk(false)
        return;
      }
      else {
        setFirstNameOk(true)
      }

    }
  
  }

  const checkLastName = () => {

  }

  const checkPhoneNumber = () => {

  }

  const checkPassword = () => {

  }

  return (
    <SafeAreaView style={styles.container}>
      <InputStyle placeHolderText="שם פרטי" icon="Ionicons" nameOfIcon="person" func={setFirstName} funcForCheck={checkFirstName} max={10}/>
      {firstNameOk ? null : <Text style={styles.textError}> חייב להכיל אותיות בלבד </Text>}
      <InputStyle placeHolderText="שם משפחה" icon="Ionicons" nameOfIcon="person" func={setLastName} funcForCheck={checkLastName}  max={15} />
      {lastNameOk ? null : <Text style={styles.textError}> נא להקליד שנית </Text>}
      <InputStyle placeHolderText="סיסמא" icon="Entypo" nameOfIcon="lock" func={setPassword} funcForCheck={checkPhoneNumber}  max={8}/>
      {passwordOk ? null : <Text style={styles.textError}> נא להקליד שנית </Text>}
      <InputStyle placeHolderText="טלפון" icon="Entypo" nameOfIcon="phone" func={setPhone} funcForCheck={checkPassword} max={10} />
      {phoneOk ? null : <Text style={styles.textError}> נא להקליד שנית </Text>}
      <ButtonCustom textInBtn="המשך" func={checkValuesAndNext} />
    </SafeAreaView>
  )
}

export default StageOneRegi;

const styles = StyleSheet.create({
  input: {
    color: 'black',
    marginRight: 5,
    flex: 1,
    textAlign: 'right',
  },
  inputBox: {
    flexDirection: "row",
    borderWidth: 1,
    padding: 15,
    borderColor: 'black',
    borderRadius: 20,
    width: '80%',
    justifyContent: 'flex-end',
    margin: 10,
  },
  container: {
    justifyContent: "center",
    alignItems: 'center',
    width: '100%',
    marginTop: 20
  },
  problemText: {
    color: 'red',
  },
  textError:{
      color:'red',
      textAlign:'right',
      width: '80%'
  },
})
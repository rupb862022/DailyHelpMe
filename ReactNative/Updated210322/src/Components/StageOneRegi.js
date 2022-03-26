import { StyleSheet, Text, SafeAreaView } from 'react-native';
import React, { useState } from 'react';
import ButtonCustom from '../ComponentStyle/ButtonCustom'
import InputStyle from '../ComponentStyle/InputStyle'
import ErrorText from '../ComponentStyle/ErrorText'

const StageOneRegi = ({ checkAndMove }) => {

  const [phone, setPhone] = useState();
  const [password, setPassword] = useState();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState();

  const [firstNameOk, setFirstNameOk] = useState(true);
  const [lastNameOk, setLastNameOk] = useState(true);
  const [passwordOk, setPasswordOk] = useState(true);
  const [phoneOk, setPhoneOk] = useState(true);

  const MoveToPageTwo = () => {
    ///פונקציה לבדוק תקינות ואז להעביר לעמוד הבא
    console.log(phone, password, firstName, lastName)
    if (firstNameOk && lastNameOk && passwordOk && phoneOk) {
      if (phone != null && password != null && firstName != null && lastName != null) {
        console.log("yy")
        checkAndMove('1', {
          FirstName: firstName,
          LastName: lastName,
          Passwords: password,
          MobilePhone: phone,
        });
       
      }
    }
  }

  const checkNames = (name) => {

    var input;
    if (name == "שם פרטי") {
      if (firstName == "") {
        setFirstNameOk(false)
        return;
      }
      input = firstName;
    }
    else {
      if (lastName == null) {
        setLastNameOk(false)
        return;
      }
      input = lastName;
    }

    for (let index = 0; index < input.length; index++) {
      if (input[index] == 32 || input[index] == 45) {
        name == "שם פרטי" ? setFirstNameOk(true) : setLastNameOk(true)
      }
      else if (input[index] < 65 || 122 < input[index]) {
        console.log("yo")
        name == "שם פרטי" ? setFirstNameOk(false) : setLastNameOk(false)
        return;
      }
      else if (input[index] > 90 && 97 > input[index]) {
        name == "שם פרטי" ? setFirstNameOk(false) : setLastNameOk(false)
        console.log("yoyoyo")
        return;
      }
      else {
        name == "שם פרטי" ? setFirstNameOk(true) : setLastNameOk(true)
      }
    }
  }

  const checkPhoneNumber = () => {
    if (phone == null) {
      setPhoneOk(false)
      return;
    }
    (phone.length == 10) ? setPhoneOk(true) : setPhoneOk(false)
  }

  const checkPassword = () => {
    if (password == null) {
      setPasswordOk(false)
      return;
    }
    else if (password.length < 6) {
      setPasswordOk(false)
      return;
    }
    setPasswordOk(true)
  }

  return (
    <SafeAreaView style={styles.container}>
      <InputStyle placeHolderText="שם פרטי" icon="Ionicons" nameOfIcon="person" func={setFirstName} funcForCheck={checkNames} max={10} />
      {firstNameOk ? null : firstName != "" ? <ErrorText text=" חייב להכיל אותיות בלבד" /> : <ErrorText text="סעיף זה חובה" />}
      <InputStyle placeHolderText="שם משפחה" icon="Ionicons" nameOfIcon="person" func={setLastName} funcForCheck={checkNames} max={15} />
      {lastNameOk ? null : lastName != "" ? <ErrorText text=" חייב להכיל אותיות בלבד" /> : <ErrorText text="סעיף זה חובה" />}
      <InputStyle placeHolderText="סיסמא" icon="Entypo" nameOfIcon="lock" func={setPassword} funcForCheck={checkPassword} max={10} />
      {passwordOk ? null : <Text style={styles.textError}> נא להקליד שנית </Text>}
      <InputStyle placeHolderText="טלפון" icon="Entypo" nameOfIcon="phone" func={setPhone} funcForCheck={checkPhoneNumber} max={10} />
      {phoneOk ? null : <Text style={styles.textError}> נא להקליד שנית </Text>}
     <ButtonCustom textInBtn="המשך" func={MoveToPageTwo} />
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
  textError: {
    color: 'red',
    textAlign: 'right',
    width: '80%'
  },

})
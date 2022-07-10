import { StyleSheet,ScrollView } from 'react-native';
import React, { useState } from 'react';
import ButtonCustom from '../ComponentStyle/ButtonCustom'
import InputStyle from '../ComponentStyle/InputStyle'
import ErrorText from '../ComponentStyle/ErrorText'
import {checkIfPhoneUsed} from '../FetchCalls/signUpAPI'

const StageOneRegi = ({ checkAndMove }) => {

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [errorsList,setErrors]= useState({ 
    firstNameError: false,
     lastNameError:false, 
     passwordError:false,
     phoneError:false 
  })

  const MoveToPageTwo = () => {
    if (!errorsList.firstNameError && !errorsList.lastNameError && !errorsList.passwordError && !errorsList.phoneError) {
      if (phone != null && password != null && firstName != null && lastName != null) {
      
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
        setErrors({...errorsList,firstNameError:"סעיף זה חובה"})
        return;
      }
      input = firstName;
    }
    else {
      if (lastName == "") {
        setErrors({...errorsList,lastNameError:"סעיף זה חובה"})
        return;
      }
      input = lastName;
    }

    for (let index = 0; index < input.length; index++) {
      if (input[index] == 32 || input[index] == 45) {
        name == "שם פרטי" ? setErrors({...errorsList,firstNameError:false}) : setErrors({...errorsList,lastNameError:false})
      }
      else if (input[index] < 65 || 122 < input[index]) {
        name == "שם פרטי" ? setErrors({...errorsList,firstNameError:"שם חייב להכיל אותיות בלבד"}) : setErrors({...errorsList,lastNameError:"שם חייב להכיל אותיות בלבד"})
        return;
      }
      else if (input[index] > 90 && 97 > input[index]) {
        name == "שם פרטי" ?  setErrors({...errorsList,firstNameError:"שם חייב להכיל אותיות בלבד"}) : setErrors({...errorsList,lastNameError:"שם חייב להכיל אותיות בלבד"})
        return;
      }
      else {
        name == "שם פרטי" ?  setErrors({...errorsList,firstNameError:false}) : setErrors({...errorsList,lastNameError:false})
      }
    }
  }

  const checkPhoneNumber = () => {
    if (phone == null) {
      setErrors({...errorsList,phoneError:"סעיף זה חובה"})
      return;
    }
    if(phone.length != 10){
      setErrors({...errorsList,phoneError:"מספר חייב להיות לפחות 10 ספרות"})
      return;
    }
  
    checkIfPhoneUsed(phone).then(
      (result) => {
        if(result)
        {
          console.log("Phone checked successfully: ", result)
          setErrors({...errorsList,phoneError:result})
        }
        else{
          console.log("Phone checked not successfully: ", result)
          setErrors({...errorsList,phoneError:result})
        }     
    
      },
      (error) => {
        setErrors({...errorsList,phoneError:"אנא נסה שנית"}) 
        console.log("checkPhoneFailed=", error);
      });
  }

  const checkPassword = () => {
    if (password == null) {
      setErrors({...errorsList,passwordError:"סעיף זה חובה"})
      return;
    }
    else if (password.length < 6) {
      setErrors({...errorsList,passwordError:" סיסמא צריכה להיות לפחות 6 ספרות "})
      return;
    }
    setErrors({...errorsList,passwordError:false});
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <InputStyle placeHolderText="שם פרטי" icon="Ionicons" nameOfIcon="person" func={setFirstName} funcForCheck={checkNames} max={10} />
      {errorsList.firstNameError != false? <ErrorText text={errorsList.firstNameError}/> : null}
      <InputStyle placeHolderText="שם משפחה" icon="Ionicons" nameOfIcon="person" func={setLastName} funcForCheck={checkNames} max={15} />
      {errorsList.lastNameError != false? <ErrorText text={errorsList.lastNameError}/> : null}
      <InputStyle placeHolderText="סיסמא" icon="Entypo" nameOfIcon="lock" func={setPassword} funcForCheck={checkPassword} max={10} />
      {errorsList.passwordError != false? <ErrorText text={errorsList.passwordError}/> : null}
      <InputStyle placeHolderText="טלפון" icon="Entypo" nameOfIcon="phone" func={setPhone} funcForCheck={checkPhoneNumber} max={10} />
      {errorsList.phoneError != false? <ErrorText text={errorsList.phoneError}/> : null}
      <ButtonCustom textInBtn="המשך" func={MoveToPageTwo} />
    </ScrollView>
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
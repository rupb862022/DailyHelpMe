import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, ScrollView } from 'react-native'
import React, { useRef, useState, useEffect } from 'react';
import { sendMail, setNewPassword } from '../FetchCalls/logInAPI';
import CustomPopUp from '../ComponentStyle/CustomPopUp';

const ForgotPassword = ({ navigation }) => {

  const [pageNum, setPageNum] = useState(1);
  const [codeGot, setCodeGot] = useState()
  const [idNumber, setIdNumber] = useState(null)

  const FirstPage = () => {

    const [sending,setSending]=useState(false)
    const [id, setId] = useState(null)

    const checkNumber = async () => {
      sendMail(id).then(
        (result) => {
          if (result != "NO") {
            setPageNum(2);
            setIdNumber(id);
            setCodeGot(result)
          }
          else {
            setSending(false)
            setCodeGot(false)
          }
        },
        (error) => {
          setSending(false)
          setCodeGot(false)
        });
    }

    return (
      <View style={styles.container}>
        <Image style={styles.img} source={require("../../assets/openLock.png")} />
        <Text style={styles.title}>שכחת את</Text>
        <Text style={styles.title}>הסיסמה?</Text>
        <Text style={styles.text}>הכנס את מספר תעודת הזהות לצורך אימות</Text>
        <TextInput value={id} placeholder="תעודת זהות" keyboardType='phone-pad' style={styles.input} maxLength={9} onChangeText={(text) => setId(text)} />
        {codeGot == false ? <Text>לא נמצא משתמש עם תעודת זהות זו</Text> : null}
        <TouchableOpacity style={styles.btn}
         onPress={() =>{
           checkNumber()
           setSending(true)
        }} disabled={sending}>
          <Text style={styles.txtBtn}>{sending?"אנא המתן":"המשך"}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const SecondPage = () => {

    const [code, setCode] = useState({
      firstCode: '',
      secondCode: '',
      thirdCode: '',
      forthCode: '',
      correct: null,
    })

    const firstInput = useRef();
    const secondInput = useRef();
    const thirdInput = useRef();
    const forthInput = useRef();

    const [countDown, setCountDown] = useState({ count: 30 });

    const SendTheMail = () => {
      sendMail(idNumber).then(
        (result) => {
          if (result != "NO") {
            setCodeGot(result);
            setCountDown({ count: 30 })
          }
          else setCodeGot(false)
        },
        (error) => {
          console.log("getUserEmail not successful: ", error);
        });
    }

    useEffect(() => {
      const timer = setTimeout(() => {
        if (countDown.count > 0) {
          setCountDown(prev => ({ ...prev, count: prev.count - 1 }));
        }
      }, 1000)
      return () => clearTimeout(timer);
    }, [countDown])

    const finishCode = () => {
      let fullcode = code.firstCode + code.secondCode + code.thirdCode + code.forthCode
      if (fullcode == codeGot) {
        setCode({ ...code, correct: true })
        setPageNum(3)
      }
      else {
        setCode({ ...code, correct: false })
      }
    }

    return (
      <View style={styles.container}>
        <Image style={styles.img} source={require("../../assets/sendEmail.png")} />
        <Text style={styles.title}> אימות </Text>
        <Text style={styles.text}>אנא הכנס את הקוד שקיבלת למייל</Text>
        <View style={styles.row}>
          <TextInput
            keyboardType='phone-pad'
            returnKeyType="next"
            onSubmitEditing={() => {
              finishCode();
            }}
            ref={forthInput}
            style={[styles.input, styles.codeInput]}
            blurOnSubmit={false}
            value={code.forthCode}
            onChangeText={(text) => setCode({ ...code, forthCode: text })}
            maxLength={1}
          />
          <TextInput
            keyboardType='phone-pad'
            returnKeyType="next"
            ref={thirdInput}
            onSubmitEditing={() => {
              forthInput.current.focus();
            }}
            style={[styles.input, styles.codeInput]}
            blurOnSubmit={false}
            value={code.thirdCode}
            onChangeText={(text) => {
              forthInput.current.focus();
              setCode({ ...code, thirdCode: text })
            }}
            maxLength={1}
          />
          <TextInput
            keyboardType='phone-pad'
            returnKeyType="next"
            onSubmitEditing={() => {
              thirdInput.current.focus();
            }}
            ref={secondInput}
            value={code.secondCode}
            blurOnSubmit={false}
            style={[styles.input, styles.codeInput]}
            onChangeText={(text) => {
              thirdInput.current.focus();
              setCode({ ...code, secondCode: text })
            }}
            maxLength={1}
          />
          <TextInput
            ref={firstInput}
            keyboardType='phone-pad'
            returnKeyType="next"
            onSubmitEditing={() => {
              secondInput.current.focus();
            }}
            blurOnSubmit={false}
            value={code.firstCode}
            style={[styles.input, styles.codeInput]}
            onChangeText={(text) => {
              secondInput.current.focus();
              setCode({ ...code, firstCode: text })
            }}
            maxLength={1}
            autoFocus={true}
          />
        </View>
        {code.correct == false ? <Text style={{ marginTop: 10, fontWeight: 'bold' }}>הקוד שהכנסת שגוי</Text> : <Text style={{ marginTop: 10 }}></Text>}
        <View style={{ marginTop: "10%", width: "100%", alignItems: "center" }}>
          <TouchableOpacity
            disabled={countDown.count == 0 ? false : true}
            onPress={() => {
              setCountDown({ count: 30 })
              SendTheMail()
            }}>
            <Text style={{ fontSize: 12, fontWeight: "bold", color: "white" }}>
              לא קיבלת את הקוד?
              {countDown.count == 0 ? <Text style={{ color: '#F8B11C' }}> שלח שוב </Text> :
                <Text style={{ color: '#F8B11C' }}> שלח שוב בעוד {countDown.count} שניות </Text>}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btn} onPress={() => finishCode()}>
            <Text style={styles.txtBtn}> אמת </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  const ThirdPage = () => {

    const [dialog, setDialog] = useState({
      visible: false,
      textBody: "",
      textTitle: "",
    });

    const [finish, setFinish] = useState(false);

    useEffect(() => {
      if (finish && !dialog.visible) {
        navigation.navigate('LogIn');
      }
    }, [finish,dialog])

    const finishPasswordsChange = () => {
      checkPassword1();
      checkPassword2();

      if (errors.password2Error == false && errors.password2Error == false) {
        setNewPassword({ ID: idNumber, Passwords: password1 }).then(
          (result) => {
            console.log("result=", result)
            if (result == "OK") {
              setDialog({
                visible: true,
                textTitle: "הסיסמה שונתה בהצלחה",
                textBody: "באפשרותך להתחבר למשתמש באמצעות הסיסמה החדשה",
              });  
            }
            setFinish(true);
          },
          (error) => {
            console.log("password didnt change successfully ", error);
          });
      }
    }

    const checkPassword1 = () => {
      if (password1 == null) {
        setErrors({ ...errors, password1Error: "סעיף זה חובה" })
        return;
      }

      if (password1.length < 6) {
        setErrors({ ...errors, password1Error: "סיסמה צריכה להיות לפחות 6 ספרות" })
        return;
      }
      setErrors({ ...errors, password1Error: false });
    }

    const checkPassword2 = () => {
      if (password1 != password2) {
        setErrors({ ...errors, password2Error: "הסיסמאות לא זהות" })
      }
      else if (password2 == null) {
        setErrors({ ...errors, password2Error: "נא לוודא את הסיסמה" })
      }
      else {
        setErrors({ ...errors, password2Error: false })
      }

    }
    const [password1, setPassword1] = useState(null);
    const [password2, setPassword2] = useState(null);

    const [errors, setErrors] = useState({
      password1Error: null,
      password2Error: null,
    })

    return (
      <ScrollView contentContainerStyle={styles.container}
        style={{      
          width: "100%",
          backgroundColor: "#52B69A",
        }}>
        <CustomPopUp dialog={dialog} setDialog={setDialog} />
        <Image style={styles.img} source={require("../../assets/lock.png")} />
        <View style={{ backgroundColor: 'white', width: '100%', height: '70%', borderTopRightRadius: 30, borderTopLeftRadius: 30, alignItems:'center'}}>
          <Text style={[styles.title, { color: 'black', fontSize: 26 }]}> צור סיסמה חדשה </Text>
          <View style={{ width: "80%", alignSelf: 'center' }}>
            <Text style={[styles.text, { color: 'black',marginTop:10 }]}>הסיסמא החדשה צריכה להיות שונה מהסיסמה הקודמת</Text>
          </View>
          <ScrollView style={{ width: "80%", marginTop: 5 ,height:"40%"}}  > 
            <Text style={styles.textPage3}> הכנס סיסמה חדשה </Text>
            <TextInput
              secureTextEntry
              style={[styles.inputPage3, styles.inputShadow]}
              onEndEditing={() => checkPassword1()}
              onChangeText={(text) => setPassword1(text)}
              maxLength={10}
            />
            {errors.password1Error == null ? null : errors.password1Error != false ? <Text style={styles.txtError}> {errors.password1Error} </Text> : null}

            <Text style={styles.textPage3}> הכנס את הסיסמה שוב  </Text>
            <TextInput
              secureTextEntry
              style={[styles.inputPage3, styles.inputShadow]}
              onEndEditing={() => checkPassword2()}
              onChangeText={(text) => setPassword2(text)}
              maxLength={10}
            />
            {errors.password2Error == null ? null : errors.password2Error != false ? <Text style={styles.txtError}> {errors.password2Error} </Text> : null}

            <TouchableOpacity style={styles.btn} onPress={() => finishPasswordsChange()}>
              <Text style={styles.txtBtn}> סיים </Text>
            </TouchableOpacity>
        
          </ScrollView>
         </View>
      </ScrollView>
    )
  }

  return (
    <View style={styles.container}>
      {pageNum == 1 ? <FirstPage /> : pageNum == 2 ? <SecondPage /> : <ThirdPage />}
    </View>
  )
}

export default ForgotPassword

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    backgroundColor: "#52B69A",
    alignItems: "center",
  },
  img: {
    height: 120,
    width: 120,
    marginTop: "30%"
  },
  title: {
    marginTop: 5,
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
    textAlign: 'center'
  },
  text: {
    marginTop: 20,
    color: "white",
    fontSize: 16,
  },
  textPage3: {
    textAlign: "left",
    marginTop: 10,
    fontWeight: 'bold'
  },
  inputShadow: {
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.5,
    shadowRadius: 1.8,
    elevation: -5
  },
  inputPage3: {
    width: "100%",
    padding: 10,
    textAlign: 'right',
    borderRadius: 10,
    borderColor: "black",
    borderWidth: 1,
    backgroundColor: "#eaeaea"
  },
  input: {
    width: "70%",
    marginTop: 20,
    backgroundColor: 'white',
    padding: 10,
    textAlign: 'right',
    borderRadius: 10,
  },
  btn: {
    marginTop: 30,
    backgroundColor: '#F8B11C',
    width: '40%',
    padding: 10,
    borderRadius: 5,
    alignSelf: 'center',
    alignItems: 'center',
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.5,
    shadowRadius: 1.8,
    elevation: 5
  },
  txtBtn: {
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '80%',
  },
  codeInput: {
    width: "15%",
    textAlign: 'center',
  },
  txtError: {
    color: 'red'
  }


})
import { StyleSheet, Modal, Text, View, TouchableOpacity, SafeAreaView } from 'react-native'
import React, { useEffect, useState } from 'react';
import StageOneRegi from '../Components/StageOneRegi';
import StageTwoRegi from '../Components/StageTwoRegi';
import StageThreeRegi from '../Components/StageThreeRegi';
import { useFocusEffect } from '@react-navigation/native';
import CameraUpload from '../Components/CameraUpload';
import { addUser } from '../FetchCalls/signUpAPi'
import registerForPushNotificationsAsync from '../PushNotificatons/registerForPushNotificationsAsync'

const SignUp = ({ navigation }) => {

  useFocusEffect(() => {
    navigation.setOptions({ tabBarStyle: { display: 'none' } });
  })

  const [stageOne, setStageOne] = useState(true);
  const [stageTwo, setStageTwo] = useState(false);
  const [stageThree, setStageThree] = useState(false);

  const [formNum, setformNum] = useState(1);
  const [stage, setStage] = useState(<StageOneRegi />);

  const [user, setUser] = useState({
    FirstName: '',
    LastName: '',
    MobilePhone: '',
    Passwords: '',
    ID: '',
    DateOfBirth: '',
    Photo: null,
    Gender: '',
    CityName: '',
    VolunteerTypes: '',
    TokenID:null,
  });
  const [picture, setPicture] = useState()

  const [modalVisible, setModalVisible] = useState(false);

  const styleBtn1 = {
    style: stageOne ? styles.textBtnBold : styles.textInBtn,
    disabled: stageOne ? true : false
  }
  const styleBtn2 = {
    style: stageTwo ? styles.textBtnBold : styles.textInBtn,
    disabled: stageTwo ? true : false,
  }
  const styleBtn3 = {
    style: stageThree ? styles.textBtnBold : styles.textInBtn,
    disabled: stageThree ? true : false,
  }

  useEffect(async() => {

    console.log("user: ", user)
    if (stageThree) {
     
      addUser(user).then(
        (result) => {
          if(result=="OK")
          {
            navigation.navigate('Home')
            console.log("add user successfully: ", result)
          }
          console.log("add user nottt successfully: ", result)
          return
        },
        (error) => {
          console.log("add user Failed=", error);
          return;
        });
    }

  }, [user, stageThree])

  const checkAndMove = async (numOfStage, json) => {
    console.log(json)
    switch (numOfStage) {
      case '1':
        let token = await registerForPushNotificationsAsync();
        console.log("token: ", token)
        setUser({
          ...user,
          TokenID:token,
          FirstName: json.FirstName,
          LastName: json.LastName,
          MobilePhone: json.MobilePhone,
          Passwords: json.Passwords,
        })
        setformNum(2);
        return;
      case '2':
        setUser({
          ...user,
          ID: json.ID,
          DateOfBirth: json.DateOfBirth,
          Photo: json.Photo,
          Gender: json.Gender,
          CityName: json.CityName,
        })
        setformNum(3);
        return;
      case '3':
        console.log("stage3: ", json)
        setUser({
          ...user,
          VolunteerTypes: json.VolunteerTypes
        })
        setStageThree(true)

        return;
      default:
        return;
    }
  }

  useEffect(() => {
    switch (formNum) {
      case 1:
        setStage(<StageOneRegi checkAndMove={checkAndMove} />)
        return;
      case 2:
        setStage(<StageTwoRegi checkAndMove={checkAndMove} setOpenCamera={setModalVisible} photoUploaded={picture} />)

        return;
      case 3:
        setStage(<StageThreeRegi checkAndMove={checkAndMove} />)

        return;
      default:
        return;
    }
  }, [formNum, picture])



  return (
    <SafeAreaView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
        style={{ width: 100, height: '100%' }}
      >
        <View style={styles.ModalBox}>
          <CameraUpload setPicture={setPicture} setOpen={setModalVisible} />
        </View>
      </Modal>
      <View style={styles.container}>
        <View style={styles.btnBox}>
          <TouchableOpacity
            onPress={() => {
              setformNum(1)
            }}
            style={styles.btn}
          >
            <Text  {...styleBtn1}>  שלב 1</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setformNum(2)
            }}
            style={styles.btn}
          >
            <Text  {...styleBtn2}>  שלב 2</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setformNum(3)
            }}
            style={styles.btn}
          >
            <Text  {...styleBtn3}>  שלב 3</Text>
          </TouchableOpacity>
        </View>

        {stage}
      </View>

    </SafeAreaView>
  )
}

export default SignUp

const styles = StyleSheet.create({
  flexbox: {
    width: '100%',
  },
  btnBox: {
    flexDirection: 'row',
    marginTop: '15%',
    justifyContent: 'space-around',
    alignSelf: 'center',
    alignItems: 'center',
    width: '70%',
  },
  btn: {
    borderColor: 'white',
    borderWidth: 1,
    shadowColor: '#7F5DF0',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5
  },
  textBtnBold: {
    backgroundColor: '#52B99C',
    padding: 10,
    width: '100%',
    fontSize: 14,
  },
  textInBtn: {
    fontSize: 14,
    backgroundColor: '#7BC9B3',
    padding: 10,
    width: '100%',
  },
  ModalBox: {
    width: '100%',
    height: '100%',
  }

})
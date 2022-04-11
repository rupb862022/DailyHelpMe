import { StyleSheet, Modal, Text, View, TouchableOpacity, SafeAreaView } from 'react-native'
import React, { useEffect, useState, useLayoutEffect, useContext } from 'react';
import StageOneRegi from '../Components/StageOneRegi';
import StageTwoRegi from '../Components/StageTwoRegi';
import StageThreeRegi from '../Components/StageThreeRegi';
import { useFocusEffect } from '@react-navigation/native';
import CameraUpload from '../Components/CameraUpload';
import { addUser } from '../FetchCalls/signUpAPI'
import registerForPushNotificationsAsync from '../General/registerForPushNotificationsAsync'
import * as ImagePicker from 'expo-image-picker';
import { Paragraph, Dialog, Portal, Provider } from 'react-native-paper';
import { userContext } from '../General/userContext';

const SignUp = ({ navigation }) => {

  const { setUser } = useContext(userContext);

  const [formNum, setformNum] = useState(1);
  const [stage, setStage] = useState(<StageOneRegi />);

  const [userToAdd, setUserToAdd] = useState({
    VolunteerTypes: "empty",
  });

  const [photo, setPhoto] = useState("none")
  const [modalVisible, setModalVisible] = useState(false);
  const [dailogVisiable, setDailogVisiable] = useState(false);

  btnOpenGalery = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [3, 3],
      quality: 0.7,
      mediaTypes: ImagePicker.MediaTypeOptions.All,
    });
    if (!result.cancelled) {
      setPhoto(result.uri);
    }
  };

  useEffect(() => {
    if(userToAdd.VolunteerTypes != "empty" ){
      addUser(userToAdd).then(
        (result) => {
          if (result == "OK") {
            setUser(userToAdd);
            setDailogVisiable(true)
            setStage(null)
            setTimeout(() => {
              setDailogVisiable(false)
              navigation.navigate('TabNav');
            }, 10000)
            console.log("add user successfully");
          }
          else {
            console.log("add user not successfully", result)
            setformNum(1)
          }
        },
        (error) => {
          console.log("add user failed:", error);
        });
    }
  },[userToAdd])


  const checkAndMove = async (numOfStage, json) => {

    switch (numOfStage) {
      case '1':
        let token = await registerForPushNotificationsAsync();
        setUserToAdd({
          ...userToAdd,
          TokenID: token,
          FirstName: json.FirstName,
          LastName: json.LastName,
          MobilePhone: json.MobilePhone,
          Passwords: json.Passwords,
        })
        setformNum(2);
        return;
      case '2':
        const photoInit = await upload();
        setUserToAdd({
          ...userToAdd,
          ID: json.ID,
          DateOfBirth: json.DateOfBirth,
          Email: json.Email,
          Gender: json.Gender,
          Photo: photoInit,
          CityName: json.CityName,
        })
        setformNum(3);
        return;
      case '3':
        if (json != "none") {
          setUserToAdd({
            ...userToAdd,
            VolunteerTypes: json.VolunteerTypes
          })
        }
        else {
          setUserToAdd({
            ...userToAdd,
            VolunteerTypes: null
          })
        }
        return;
      default:
        return;
    }
  }

  const upload = () => {
    if (photo != "none") {
      let urlAPI = 'https://proj.ruppin.ac.il/bgroup86/prod/uploadpicture';
      let picture = new FormData();
      let picName = "user"

      picture.append('picture', {
        uri: photo,
        name: "user.jpg",
        type: 'image/jpg'
      });

      const config = {
        method: 'POST',
        body: picture,
      }
      return new Promise(resolve => {
        fetch(urlAPI, config)
          .then((res) => {
            if (res.status == 201) { return res.json(); }
            else { return "err"; }
          })
          .then((responseData) => {
            if (responseData != "err") {
              let picNameWOExt = picName.substring(0, picName.indexOf("."));
              var imageNameWithGUID = responseData.substring(responseData.indexOf(picNameWOExt),
                responseData.indexOf(".jpg") + 4);
              console.log("image: ", imageNameWithGUID.toString());
              console.log("img uploaded successfully!");
              resolve(imageNameWithGUID);
            }
            else { console.log('error uploding  :(...'); }
          })
          .catch(err => { console.log('err upload= ' + err); });
      });
    } else {
      return "https://freesvg.org/img/abstract-user-flat-4.png"
    }
  }

  useEffect(() => {
    switch (formNum) {
      case 1:
        setStage(<StageOneRegi checkAndMove={checkAndMove} />)
        return;
      case 2:

        setStage(<StageTwoRegi checkAndMove={checkAndMove}
          setOpenCamera={setModalVisible}
          photoUploaded={photo}
          setGalleryOpen={btnOpenGalery}
        />)
        return;
      case 3:
        console.log(userToAdd)
        setStage(<StageThreeRegi checkAndMove={checkAndMove} />)
        return;
      default:
        return;
    }
  }, [formNum, photo])


  return (
    <SafeAreaView>
      <Modal
        animationType="slide"
        transparent={true}
        onDismiss={() => setModalVisible(false)}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
        style={{ width: 100, height: '100%' }}
      >
        <View style={styles.ModalBox}>
          <CameraUpload setPicture={setPhoto} setOpen={setModalVisible} />
        </View>
      </Modal>
      <Modal
        animationType="slide"
        backgroundColor="black"
        visible={dailogVisiable}
        style={{ width: 100, height: '100%', justifyContent: 'center', alignItems: 'center' }}
      >
        <View style={[styles.ModalBox, styles.absolute]}>
          <Provider>
            <Portal>
              <Dialog visible={true}>
                <Dialog.Title> הרשמה בוצעה בהצלחה </Dialog.Title>
                <Dialog.Content>
                  <Paragraph> ברוכ/ה הבא/ה לקהילה שלנו :)  </Paragraph>
                  <Paragraph> מיד נעביר אותך לעמוד הבית </Paragraph>
                </Dialog.Content>
              </Dialog>
            </Portal>
          </Provider>
        </View>
      </Modal>

      <View style={styles.btnBox}>
        <TouchableOpacity
          disabled={true}
          onPress={() => {
            setformNum(1)
          }}
          style={styles.btn}
        >
          <Text style={formNum == 1 ? styles.textBtnBold : styles.textInBtn}> שלב 1 </Text>
        </TouchableOpacity>

        <TouchableOpacity
          disabled={true}
          onPress={() => {
            setformNum(2)
          }}
          style={styles.btn}
        >
          <Text style={formNum == 2 ? styles.textBtnBold : styles.textInBtn}> שלב 2 </Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={true}
          onPress={() => {
            setformNum(3)
          }}
          style={styles.btn}
        >
          <Text style={formNum == 3 ? styles.textBtnBold : styles.textInBtn}> שלב 3 </Text>
        </TouchableOpacity>
      </View>
      {stage}
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
    fontSize: 16,
    fontWeight: 'bold'
  },
  textInBtn: {
    fontSize: 14,
    backgroundColor: '#7BC9B3',
    padding: 8,
    width: '100%',
  },
  ModalBox: {
    width: '100%',
    height: '100%',
  },
  absolute: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center'
  }
})
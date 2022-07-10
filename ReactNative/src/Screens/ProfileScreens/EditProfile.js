import { StyleSheet, Text, View, Image, TouchableOpacity, SafeAreaView, ScrollView, Dimensions, Modal, TextInput, ActivityIndicator } from 'react-native'
import React, { useContext, useLayoutEffect, useState, useEffect } from 'react'
import ButtonCustom from '../../ComponentStyle/ButtonCustom'
import ErrorText from '../../ComponentStyle/ErrorText'
import { Entypo, Ionicons } from '@expo/vector-icons';
import { userContext } from '../../General/userContext';
import { changeUserInfo, checkIfPhoneUsed } from '../../FetchCalls/profileAPI';
import CameraUpload from '../../Components/CameraUpload';
import * as ImagePicker from 'expo-image-picker';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Dialog, Portal, Provider, IconButton } from 'react-native-paper';
import { storeData, getData } from '../../General/asyncStoreUser';

const GOOGLE_PLACES_API_KEY = 'AIzaSyDzzNIGn4Vdk_Ui5WWtQWMnP_gvTqPk7K4';

const EditProfile = ({ route, navigation }) => {

  const [loading, setLoading] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: user != 0 ? user.FirstName + " " + user.LastName : null,
    });
  }, [navigation, user]);

  const { user, setUser } = useContext(userContext);

  const [phone, setPhone] = useState(user.MobilePhone);
  const [description, setDescription] = useState(user.UserDescription);
  const [firstName, setFirstName] = useState(user.FirstName);
  const [lastName, setLastName] = useState(user.LastName);
  const [adress, setAdress] = useState(user.CityName);
  const [userPhoto, setUserPhoto] = useState(user.Photo);

  const [openFabGroup, setOpenFabGroup] = useState(false);

  const screenWidth = Dimensions.get('screen').width;
  const screenHeight = Dimensions.get('screen').height;

  useEffect(() => {
    setOpenFabGroup(false)
  }, [userPhoto])

  const [adressModalVisiable, setAdressModalVisiable] = useState(false)

  const [errorsList, setErrors] = useState({
    firstNameError: false,
    lastNameError: false,
    phoneError: false,
    adressError: false
  })

  const checkNames = (name) => {
    var input;
    if (name == "שם פרטי") {
      if (firstName == "") {
        setErrors({ ...errorsList, firstNameError: "סעיף זה חובה" })
        return;
      }
      input = firstName;
    }
    else {
      if (lastName == "") {
        setErrors({ ...errorsList, lastNameError: "סעיף זה חובה" })
        return;
      }
      input = lastName;
    }

    for (let index = 0; index < input.length; index++) {
      if (input[index] == 32 || input[index] == 45) {
        name == "שם פרטי" ? setErrors({ ...errorsList, firstNameError: false }) : setErrors({ ...errorsList, lastNameError: false })
      }
      else if (input[index] < 65 || 122 < input[index]) {
        name == "שם פרטי" ? setErrors({ ...errorsList, firstNameError: "שם חייב להכיל אותיות בלבד" }) : setErrors({ ...errorsList, lastNameError: "שם חייב להכיל אותיות בלבד" })
        return;
      }
      else if (input[index] > 90 && 97 > input[index]) {
        name == "שם פרטי" ? setErrors({ ...errorsList, firstNameError: "שם חייב להכיל אותיות בלבד" }) : setErrors({ ...errorsList, lastNameError: "שם חייב להכיל אותיות בלבד" })
        return;
      }
      else {
        name == "שם פרטי" ? setErrors({ ...errorsList, firstNameError: false }) : setErrors({ ...errorsList, lastNameError: false })
      }
    }
  }

  const checkPhoneNumber = () => { 
    if (phone == null) {
      setErrors({ ...errorsList, phoneError: "סעיף זה חובה" })
      return;
    }
    if (phone.length != 10) {
      setErrors({ ...errorsList, phoneError: "מספר חייב להיות לפחות 10 ספרות" })
      return;
    }

    checkIfPhoneUsed(phone).then(
      (result) => {
        if (result) {
          setErrors({ ...errorsList, phoneError: result })
        }
        setErrors({ ...errorsList, phoneError: result })
      },
      (error) => {
        setErrors({ ...errorsList, phoneError: "אנא נסה שנית" })
      });
  }

  const checkAdress = () => {
    if (adress == null) {
      setErrors({ ...errorsList, adressError: "סעיף זה חובה" });
      return;
    }
    setErrors({ ...errorsList, adressError: false });
  }

  const btnOpenGalery = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [3, 3],
      quality: 0.7,
      mediaTypes: ImagePicker.MediaTypeOptions.All,
    });
    if (!result.cancelled) {
      setUserPhoto(result.uri);
    }
  };

  const upload = () => {
    if (userPhoto != "none") {
      let urlAPI = 'https://proj.ruppin.ac.il/bgroup86/prod/uploadpicture';
      let picture = new FormData();
      let picName = user.FirstName

      picture.append('picture', {
        uri: userPhoto,
        name: `user${phone}.jpg`,
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
    if (getData != false) {
      storeData(user);
    }
  }, [user])

  const saveAndGoBack = async () => {
    checkAdress();
    console.log(phone, firstName, lastName, adress)
    if (!errorsList.firstNameError && !errorsList.lastNameError && !errorsList.phoneError && !errorsList.adressError) {
      if (phone != null && firstName != null && lastName != null && adress != null) {

        var newPhoto = user.Photo;
        if (userPhoto !== newPhoto) {
          newPhoto = await upload();
          setUserPhoto(newPhoto)
        }

        setUser({
          ...user,
          UserDescription: description,
          FirstName: firstName,
          LastName: lastName,
          MobilePhone: phone,
          Photo: newPhoto,
        })

        changeUserInfo({
          UserDescription: description,
          FirstName: firstName,
          LastName: lastName,
          MobilePhone: phone,
          CityName: adress,
          Photo: newPhoto,
          ID: user.ID
        }).then(
          (result) => {
            if (result == "OK") {
              console.log(result,user)
              navigation.navigate("Profile")
            }
            else {
              console.log("changes not saved : ", result)
              navigation.navigate("Profile")
            }

          },
          (error) => {
            console.log("changes in user ERROR: ", error);
          });

      }
    }
    {

    }
  }

  const [showCamera, setShowCamera] = useState(false);

  if (loading) {
    <ActivityIndicator />
  }
  else {
    return (
      <View style={{ height: screenHeight * 0.85 }}>
        <Modal
          animationType="slide"
          transparent
          onDismiss={() => setShowCamera(false)}
          visible={showCamera}
          onRequestClose={() => {
            setShowCamera(false);
          }}
          style={{ width: 100, height: '100%' }}
        >
          <View style={styles.ModalBox}>
            <CameraUpload setPicture={setUserPhoto} setOpen={setShowCamera} />
          </View>
        </Modal>
        <View style={{ height: "20%" }}>
          <View style={styles.btnBox}>
            <TouchableOpacity style={styles.btnStyle} onPress={() => {
              openFabGroup ? setOpenFabGroup(false) : setOpenFabGroup(true)
            }}>
              <Entypo name="upload" size={18} color="#F8B11C" />
            </TouchableOpacity>
            {openFabGroup &&
              <View style={styles.fabS}>
                <IconButton
                  style={styles.buttonIcon}
                  size={25}
                  icon="camera"
                  visible={openFabGroup}
                  onPress={() => setShowCamera(true)}
                />
                <IconButton
                  style={styles.buttonIcon}
                  size={25}
                  icon='image-album'
                  visible={openFabGroup}
                  onPress={() => btnOpenGalery(true)}
                />
              </View>
            }
          </View>
          <Image style={styles.imgStyle} source={{ uri: userPhoto }} />
        </View>
        <View style={[styles.container, { height: "60%" }]}>
          <View style={styles.inputBox}>
            <TextInput style={styles.input}
              value={description}
              placeholder={user != 0 ? description == null ? "הכנס תיאור" : description : null}
              onChangeText={(text) => setDescription(text)}
              maxLength={50}
              multiline={true}
            />
          </View>


          <View style={styles.inputBox}>
            <Ionicons name="person" size={25} color="#F8B11C" />
            <TextInput style={styles.input}
              value={firstName}
              onChangeText={(text) => setFirstName(text)}
              onEndEditing={() => checkNames("שם פרטי")}
              maxLength={15}
            />
          </View>
          {errorsList.firstNameError != false ? <ErrorText text={errorsList.firstNameError} /> : null}

          <View style={styles.inputBox}>
            <Ionicons name="person" size={25} color="#F8B11C" />
            <TextInput style={styles.input}
              value={lastName}
              onChangeText={(text) => setLastName(text)}
              onEndEditing={() => checkNames("שם משפחה")}
              maxLength={15}
            />
          </View>
          {errorsList.lastNameError != false ? <ErrorText text={errorsList.lastNameError} /> : null}

          <View style={styles.inputBox}>
            <Entypo name="phone" size={25} color="#F8B11C" />
            <TextInput style={styles.input}
              value={phone}
              onChangeText={(text) => setPhone(text)}
              onEndEditing={() => checkPhoneNumber()}
              maxLength={10}
              keyboardType='phone-pad'
            />
          </View>
          {errorsList.phoneError != false ? <ErrorText text={errorsList.phoneError} /> : null}

          <TouchableOpacity style={styles.inputBox} onPress={() => setAdressModalVisiable(true)}>
            <Ionicons name="location" size={25} color="#F8B11C" />
            <TextInput style={styles.input}
              editable={false}
              value={adress}
              placeholder="עיר מגורים"
            />
          </TouchableOpacity>
          {errorsList.adressError != false ? <ErrorText text={errorsList.adressError} /> : null}

          <ButtonCustom textInBtn="שמור וסיים עריכה" func={saveAndGoBack} />
        </View>
        <Provider>
          <Portal >
            <Dialog visible={adressModalVisiable} onDismiss={() => setAdressModalVisiable(false)}
              style={styles.dialog}
            >
              <Dialog.Content style={{ height: '100%' }} >
                <GooglePlacesAutocomplete
                  suppressDefaultStyles={true}
                  listUnderlayColor='#52B69A'
                  textInputProps={{
                    color: 'black',
                    textAlign: 'right',
                    padding: 0,
                    borderColor: 'black',
                    borderBottomWidth: 1,
                    paddingTop: 15
                  }}
                  styles={{
                    listView: {
                      width: '100%',

                    },
                    separator: {
                      height: 1,
                      backgroundColor: '#52B69A',
                    },
                    poweredContainer: {
                      backgroundColor: '#52B69A',
                    },
                  }}
                  placeholder='הכנס את עיר המשימה'
                  onPress={(data, details = null) => {
                    setAdress(data.description)
                    setAdressModalVisiable(false)
                  }}
                  fetchDetails={true}
                  query={{
                    key: GOOGLE_PLACES_API_KEY,
                    language: 'iw',
                    region: 'il',
                    types: '(cities)'
                  }}
                />
                <TouchableOpacity style={styles.btnClose} onPress={() => setAdressModalVisiable(false)}>
                  <Text style={styles.txtBtn}> סגור </Text>
                </TouchableOpacity>

              </Dialog.Content>
            </Dialog>
          </Portal>
        </Provider>
      </View>
    )
  }
}

export default EditProfile;

const styles = StyleSheet.create({
  imgStyle: {
    borderRadius: 50,
    height: 80,
    width: 80,
    marginTop: 20,
    alignSelf: 'center',
    padding: 40,
  },
  container: {
    justifyContent: "center",
    alignItems: 'center',
    width: '100%',
  },
  labelStyle: {
    width: 100,
  },
  fabS: {
    position: 'absolute',
    bottom: 20,
    right: 100,
    flexDirection: 'row',
    zIndex:1
  },
  buttonIcon: {
    backgroundColor: '#52B69A'
  },
  btnStyle: {
    width: '30%',
    alignItems: 'center',
    alignSelf: 'center',
    marginRight: 100,
  },
  input: {
    color: 'black',
    marginLeft: 10,
    flex: 1,
    textAlign: 'right',
  },
  inputBox: {
    flexDirection: "row",
    borderWidth: 1,
    padding: 12,
    borderColor: 'black',
    borderRadius: 20,
    width: '80%',
    justifyContent: 'flex-start',
    margin: 10,
  },
  txtBtn: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  btnClose: {
    bottom: 8,
    position: 'absolute',
    alignSelf: 'center',
  },
  dialog: {
    width: '90%',
    height: '40%',
    position: 'absolute',
    top: 0,
    alignSelf: 'center',
    borderWidth: 5,
    borderColor: '#52B69A',
  },
  btnBox: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: "30%"

  },ModalBox: {
    width: '100%',
    height: '100%',
  },
})
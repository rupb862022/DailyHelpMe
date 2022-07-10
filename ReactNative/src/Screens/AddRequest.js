import { StyleSheet, SafeAreaView, Dimensions, } from 'react-native'
import React, { useState, useEffect } from 'react'
import EditRequest from '../Components/EditRequest';

const AddRequest = ({ navigation }) => {

  const [request, setRequest] = useState({
    Task: [{
      TaskNumber: 1,
      TaskName: null,
      confirmation: false,
      TaskDescription: null,
      TaskHour: null,
      DatesForTask: null,
      Confirmation: false,
      NumOfVulRequired: "1",
      Lat: null,
      Lng: null,
      CityCode: null,
      TypesList: null,
      TaskDateStatus: [],
      New: true
    }],
    RequestNew: true,
    RequestName: null,
    PrivateRequest: false,
  })

  

  const screenWidth = Dimensions.get('screen').width;
  const screenHeight = Dimensions.get('screen').height;

  useEffect(() => {
    const whenFocus =navigation.addListener('focus', () => {
      setRequest({
        Task: [{
          TaskNumber: 1,
          TaskName: null,
          confirmation: false,
          TaskDescription: null,
          TaskHour: null,
          DatesForTask: null,
          Confirmation: false,
          NumOfVulRequired: "1",
          Lat: null,
          Lng: null,
          CityCode: null,
          TypesList: null,
          TaskDateStatus: [],
          New: true
        }],
        RequestNew: true,
        RequestName: null,
        PrivateRequest: false,
      });
    })
    return whenFocus;
  }, [navigation])

  const [moveToHomePage, setMoveToHomePage] = useState(true);

  useEffect(() => {
    if (!moveToHomePage) {
      navigation.navigate('Home')
    }
  }, [moveToHomePage])

  return (
    <SafeAreaView style={[styles.container, { height: screenHeight * 0.68, width: screenWidth }]}>
      <EditRequest requestSent={request} moveBack={setMoveToHomePage} />
    </SafeAreaView >
  )
}

export default AddRequest

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    alignItems: 'center',
  },
  accordionsBox: {
    marginTop: 5,
    direction: 'rtl',
    width: "80%"
  },
  list: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 5
  },
  input: {
    color: 'black',
    marginRight: 5,
    flex: 1,
    textAlign: 'right',
  },
  inputBox: {
    flexDirection: "row",
    borderWidth: 1,
    padding: 10,
    borderColor: 'black',
    borderRadius: 20,
    width: '100%',
    writingDirection: 'rtl',
    margin: 5,
    alignSelf: 'center'
  },
  title: {
    fontSize: 18,
    color: '#52B69A',
    alignSelf: 'center',
    fontWeight: 'bold',
    margin: 2
  },
  datesStyle: {
    justifyContent: 'center',
    alignItems: 'center',

  },
  btnStyle: {
    width: '30%',
    backgroundColor: '#F8B11C',
    margin: 2,
    borderRadius: 20,
    padding: 5,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'black',
  },
  txtBtn: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  modal: {
    height: 240,
    backgroundColor: 'white',
    width: "90%",
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 20,
    padding: 10,
  },
  modalBox: {
    height: "100%",
    width: "100%",
  },
  top: {
    height: 40,
    backgroundColor: '#52B69A',
    margin: -10,
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
  },
  btnClose: {
    bottom: 3,
    position: 'absolute',
    alignSelf: 'center',
  },
  row: {
    flexDirection: 'row',
    width: "85%",
    alignSelf: 'center'
  },
  txt: {
    marginBottom: 20
  },
  selectedTxt: {
    fontSize: 14,
    fontWeight: 'bold'
  },
  middle: {
    position: 'absolute',
    top: "30%",
    alignSelf: 'center',
    width: "90%",
  },
  cube: {
    margin: 5,
    borderRadius: 15,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#52B69A',
  },
  cubePressed: {
    margin: 5,
    borderRadius: 15,
    backgroundColor: '#52B69A',
    borderWidth: 1,
    borderColor: 'white',
  },
  text: {
    color: '#52B69A',
    width: '100%',
    padding: 10,
  },
  textPressed: {
    color: 'white',
    width: '100%',
    padding: 10,
  }

})
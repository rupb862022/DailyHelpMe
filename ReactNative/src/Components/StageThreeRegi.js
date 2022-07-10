import { StyleSheet, Text, View, SafeAreaView, Modal, TouchableOpacity, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react';
import CubeType from '../ComponentStyle/CubeType';
import ToggleStyle from '../ComponentStyle/ToggleStyle';
import ButtonCustom from '../ComponentStyle/ButtonCustom';
import { getTypes } from '../FetchCalls/signUpAPI'
import { Checkbox } from 'react-native-paper';
import ErrorText from '../ComponentStyle/ErrorText';
import Policy from './Policy';

const StageThreeRegi = ({ checkAndMove }) => {

  const [wantToVul, setwantToVul] = useState(true);
  const [listOfTypes, setlistOfTypes] = useState([])
  const [agreedToTerms, setAgreedToTerms] = useState({
    error: false,
    value: false
  });

  const [listOfTypesChose, setlistOfTypesChose] = useState([])

  const checkThenMove = () => {
    if (agreedToTerms.value == false) {
      setAgreedToTerms({ ...agreedToTerms, error: true })
    }
    else {
      if (listOfTypesChose.length == 0) {
        checkAndMove('3', "none");
      }
      else {
        checkAndMove('3', {
          VolunteerTypes: listOfTypesChose.some(x => x == 'כל התחומים') ? listOfTypes : listOfTypesChose
        })
      }
    }
  }

  const addTypeToList = (type) => {
    if (listOfTypesChose != null) {
      let temp = listOfTypesChose.filter(t => t != type)
      temp.length == listOfTypesChose.length ? setlistOfTypesChose([...listOfTypesChose, type]) : setlistOfTypesChose(temp);
    }
    else {
      setlistOfTypesChose([type]);
    }
  }

  useEffect(() => {
    getTypes().then(
      (result) => {
        console.log("get types successfully: ", result)
        setlistOfTypes(result)
      },
      (error) => {
        console.log("get types Failed=", error);
      });
  }, [])

  const [policyShow, setShowPolicy] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <Modal
        transparent
        visible={policyShow}
        onRequestClose={() => { setShowPolicy(false) }}
      >
        <View style={styles.modal}>
          <Policy />
          <TouchableOpacity onPress={() => setShowPolicy(false)}>
            <Text style={{fontWeight: 'bold',marginTop:5}}>סגור</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <ToggleStyle state={wantToVul} text=" מעוניינים להתנדב" func={setwantToVul} />
      {!wantToVul
        ? null
        : <View>
          <Text style={styles.title}> תחומים שאשמח להתנדב בהם </Text>

          <View style={styles.list}>
            {
              listOfTypes.map((type, index) => {
                return (
                  <CubeType key={index} type={type} typeChose={addTypeToList} />)
              })
            }
          </View>
        </View>
      }
      <View style={styles.checkBoxBox}>
        <Checkbox
          status={agreedToTerms.value ? 'checked' : 'unchecked'}
          color='#52B69A'
          onPress={() => {
            agreedToTerms.value ? setAgreedToTerms({ ...agreedToTerms, value: false }) : setAgreedToTerms({ ...agreedToTerms, value: true })
          }}
        />
        <View style={{ flexDirection: 'row' }}>
          <Text> אני מסכימ/ה </Text>
          <TouchableOpacity onPress={() => setShowPolicy(true)}>
            <Text style={{ textDecorationLine: 'underline' }}>לתקנון</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.center}>
        {agreedToTerms.error && <ErrorText text="כדי להרשם עלייך לאשר את הסכמתך לתקנון" />}
      </View>
      <ButtonCustom textInBtn="לסיום" func={checkThenMove} />
    </SafeAreaView>
  )
}

export default StageThreeRegi

const styles = StyleSheet.create({
  container: {
    marginTop: '5%',
    justifyContent: 'center',
  },
  title: {
    margin: 20,
    color: '#52B69A',
    fontSize: 20,
    fontWeight: 'bold'
  },
  toggleBox: {
    alignItems: 'flex-end',
    marginRight: '9%',
  },
  checkBoxBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  center: {
    alignSelf: 'center',
  },
  list: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 5
  },
  ModalBackGround: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    activeOpacity: 1
  },
  modal: {
    backgroundColor: 'white',
    position: 'absolute',
    top: "10%",
    width: "95%",
    height: "80%",
    alignSelf: 'center',
    padding: 5,
    borderRadius: 10,
    alignItems: 'center',
    borderColor: 'black',
    borderWidth: 1,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.5,
    shadowRadius: 1.8,
    elevation: 4,
  },
})
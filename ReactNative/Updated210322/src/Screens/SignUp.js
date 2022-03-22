import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView } from 'react-native'
import React, { useEffect, useState } from 'react';
import StageOneRegi from '../Components/StageOneRegi';
import StageTwoRegi from '../Components/StageTwoRegi';
import StageThreeRegi from '../Components/StageThreeRegi';
import { useFocusEffect } from '@react-navigation/native';


const SignUp = ({ navigation }) => {

  const [stageOne, setStageOne] = useState(true);
  const [stageTwo, setStageTwo] = useState(false);
  const [stageThree, setStageThree] = useState(false);

  const [formNum, setformNum] = useState(1);
  const [stage, setStage] = useState(<StageOneRegi />);

  useFocusEffect(() => {
    navigation.setOptions({ tabBarStyle: { display: 'none' } });
  })

  const styleBtn1 = {
    style: stageOne ? styles.textBtnBold : styles.textInBtn,
    disabled :stageOne ? true : false
  }
  const styleBtn2 = {
    style: stageTwo ? styles.textBtnBold : styles.textInBtn,
    disabled: stageTwo ? true : false,
  }
  const styleBtn3 = {
    style: stageThree ? styles.textBtnBold : styles.textInBtn,
    disabled:stageThree ? true : false,
  }

  useEffect(() => {
    switch (formNum) {
      case 1:
        setStage(<StageOneRegi />)
        return;
      case 2:
        setStage(<StageTwoRegi />)
        setStageTwo(true)
        return;
      case 3:
        setStage(<StageThreeRegi />)
        setStageThree(true)
        return;
      default:
        return;
    }
  }, [formNum])

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View style={styles.btnBox}>
          <TouchableOpacity 
            onPress={() => {
              setformNum(3)
            }}
            style={styles.btn}
          >
            <Text  {...styleBtn3}>  שלב 3</Text>
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
              setformNum(1)
            }}
            style={styles.btn}
          >
            <Text  {...styleBtn1}>  שלב 1</Text>
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

  }

})
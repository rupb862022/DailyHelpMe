import { StyleSheet, Text, View, FlatList, SafeAreaView } from 'react-native'
import React, { useState, useEffect } from 'react';
import CubeType from '../ComponentStyle/CubeType';
import ToggleStyle from '../ComponentStyle/ToggleStyle';
import ButtonCustom from '../ComponentStyle/ButtonCustom';
import { getTypes } from '../FetchCalls/signUpAPI'
import { Checkbox } from 'react-native-paper';
import ErrorText from '../ComponentStyle/ErrorText';

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
      if(listOfTypesChose.length == 0){
        checkAndMove('3',"none");
      }
      else{ 
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

  return (
    <SafeAreaView style={styles.container}>
      <ToggleStyle state={wantToVul} text=" מעוניינים להתנדב" func={setwantToVul} />
      {!wantToVul
        ? null
        : <View>
          <Text style={styles.title}> תחומים שאשמח להתנדב בהם </Text>
          <View>
            <FlatList
              columnWrapperStyle={true}
              contentContainerStyle={{
                margin: 5,
                alignItems: 'flex-end',

              }}
              numColumns={3}
              data={listOfTypes}
              keyExtractor={(item) => item}
              renderItem={({ item }) => {
                return (
                  <CubeType type={item} typeChose={addTypeToList} />)
              }}
            />
          </View>
        </View>
      }
       <View style={styles.checkBoxBox}>     
        <Checkbox
          status={agreedToTerms.value ? 'checked' : 'unchecked'}
          color='#52B69A'
          onPress={() => {
            agreedToTerms.value ? setAgreedToTerms({...agreedToTerms,value:false}):setAgreedToTerms({...agreedToTerms,value:true})
          }}
        />
         <Text> אני מסכימ/ה לתקנון </Text>     
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
    marginTop: '10%',
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
  checkBoxBox:{
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  center:{
    alignSelf:'center',
  }
})
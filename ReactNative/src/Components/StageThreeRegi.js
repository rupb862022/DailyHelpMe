import { StyleSheet, Text, View, FlatList, SafeAreaView } from 'react-native'
import React, { useState, useEffect } from 'react';
import CubeType from '../ComponentStyle/CubeType';
import ToggleStyle from '../ComponentStyle/ToggleStyle';
import ButtonCustom from '../ComponentStyle/ButtonCustom';
import {getTypes} from '../FetchCalls/signUpAPi'

const StageThreeRegi = ({ checkAndMove }) => {

  const [wantToVul, setwantToVul] = useState(true);
  const [listOfTypes, setlistOfTypes] = useState([])

  const [listOfTypesChose, setlistOfTypesChose] = useState([])

  const checkThenMove=()=>{
    checkAndMove('3',{
      VolunteerTypes: listOfTypesChose.some(x=> x == 'כל התחומים')? listOfTypes : listOfTypesChose
    })
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
      <ButtonCustom textInBtn="לסיום" func={checkThenMove} />

    </SafeAreaView>
  )
}

export default StageThreeRegi

const styles = StyleSheet.create({
  container: {
    marginTop: '10%'
  },
  title: {
    margin: 20,
    color: '#52B69A',
    fontSize: 20,
    fontWeight: 'bold'
  },
  wrap: {
    flexWrap: "wrap",
  },
  toggleBox: {
    alignItems: 'flex-end',
    marginRight: '9%',
  },

})
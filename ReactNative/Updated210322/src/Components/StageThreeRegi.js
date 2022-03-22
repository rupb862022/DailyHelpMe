import { StyleSheet, Text, View, FlatList, SafeAreaView } from 'react-native'
import React, { useState, useEffect } from 'react';
import CubeType from '../ComponentStyle/CubeType';
import ToggleStyle from '../ComponentStyle/ToggleStyle';
import ButtonCustom from '../ComponentStyle/ButtonCustom';

const StageThreeRegi = ({checkValuesAndNext}) => {

  const [wantToVul, setwantToVul] = useState(true);
  const [listOfTypes, setlistOfTypes] = useState([])

  const apiUrl = 'https://proj.ruppin.ac.il/bgroup86/prod/api/Types';

  useEffect(() => {
    fetch(apiUrl, {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json; charset=UTF-8',
        'Accept': 'application/json; charset=UTF-8',
      })
    })
      .then(res => {
        return res.json()
      })
      .then(
        (result) => {
         setlistOfTypes(result)
         console.log("res",result)
        },
        (error) => {
          console.log("err post=", error);
        });
  }, [])

  return (
    <SafeAreaView style={styles.container}>

      <ToggleStyle state={wantToVul} text=" מעוניינים להתנדב" func={setwantToVul} />

      {!wantToVul
        ? null
        : <View>
          <Text style={styles.title}> תחומים שאשמח להתנדב בהם </Text>
          <View >
            <FlatList
              columnWrapperStyle={styles.wrap}
              numColumns={3}
              data={listOfTypes}
              keyExtractor={(item) => item}
              renderItem={({ item }) => {
                return (
                  <CubeType type={item} />)
              }}
            />
          </View>
        </View>
      }
      <ButtonCustom textInBtn="לסיום" func={checkValuesAndNext} />

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
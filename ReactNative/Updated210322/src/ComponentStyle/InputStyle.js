import { StyleSheet, Text, View, TextInput } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Ionicons, Feather, Entypo, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const GOOGLE_PLACES_API_KEY = 'AIzaSyD_GGypBzDabu8UYars4z1DTFG8PLRsvY4';

const InputStyle = ({ placeHolderText, icon, nameOfIcon, func, funcForCheck, max, value }) => {

  const [iconChose, setIcon] = useState();

  const textInpotProp = {
    style: styles.input,
    placeholder: placeHolderText,
    autoCorrect: false,
    secureTextEntry: (placeHolderText == "סיסמא") ? true : false,
    keyboardType: (placeHolderText == "טלפון" || placeHolderText == "תעודת זהות") ? "numeric" : null,
    maxLength: (placeHolderText == "כתובת" || placeHolderText == "תאריך לידה") ? null : max,
    editable: (placeHolderText == "תאריך לידה") ? false : true,
  }

  useEffect(() => {

    switch (icon) {
      case "Ionicons":
        setIcon(<Ionicons name={nameOfIcon} size={25} color="#F8B11C" />)
        return;
      case "Entypo":
        setIcon(<Entypo name={nameOfIcon} size={25} color="#F8B11C" />)
        return;
      case "FontAwesome":
        setIcon(<FontAwesome name={nameOfIcon} size={25} color="#F8B11C" />)
        return;
      case "MaterialIcons":
        setIcon(<MaterialIcons name={nameOfIcon} size={25} color="#F8B11C" />)
        return;
      default:
        return;
    }

  }, [])

  if (placeHolderText == "כתובת") {
    return (
      <View style={styles.inputBox} >
        <GooglePlacesAutocomplete
          suppressDefaultStyles={true}
          listUnderlayColor='#52B69A'
          numberOfLines={3}
          textInputProps={{
            color: 'black',
            textAlign: 'right'
          }}
          styles={{
            listView: {
              width: '100%',
              right: -25
            },
            separator: {
              height: 1,
              backgroundColor: '#52B69A',
            },
            poweredContainer: {
              backgroundColor: '#52B69A',
            },
          }}
          placeholder='כתובת'
          onPress={(data, details = null) => {
            // 'details' is provided when fetchDetails = true
            func(data, details);

          }}
          query={{
            key: GOOGLE_PLACES_API_KEY,
            language: 'iw',
            region: 'il'
          }}

        />
        {iconChose}
      </View>
    )
  }

  return (
    <View style={styles.inputBox}>
      <TextInput
        {...textInpotProp}
        onChangeText={text => func(text)}
        onEndEditing={() => funcForCheck(placeHolderText)}
        value={(placeHolderText == "תאריך לידה") ? value : null}
      />
      {iconChose}
    </View>
  )
}

export default InputStyle

const styles = StyleSheet.create({
  input: {
    color: 'black',
    marginRight: 5,
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
    justifyContent: 'flex-end',
    margin: 10,
  },
})
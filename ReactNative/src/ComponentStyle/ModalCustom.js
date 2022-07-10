import { StyleSheet, View,TouchableOpacity,Modal } from 'react-native'
import React from 'react'

const ModalCustom = ({setClose,visible,content}) => {
  return (
  <Modal visible={visible}
   transparent 
   onRequestClose={()=> setClose(false)}>
    <TouchableOpacity style={styles.ModalBackGround} 
      activeOpacity={0}
     onPress={()=> setClose(false)}>
      <View style={styles.modal}>
        <View>
          {content}
        </View>
      </View>
    </TouchableOpacity>
  </Modal>
  )
}

export default ModalCustom

const styles = StyleSheet.create({
  modal: {
    backgroundColor: 'white',
    position: 'absolute',
    top: "20%",
    width: "90%",
    alignSelf: 'center',
    padding: 5,
    borderRadius: 10,
    alignItems: 'center',
    borderColor: '#52B69A',
    borderWidth: 5,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.5,
    shadowRadius: 1.8,
    elevation: 4,
  },
  ModalBackGround:{
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',

  }
})
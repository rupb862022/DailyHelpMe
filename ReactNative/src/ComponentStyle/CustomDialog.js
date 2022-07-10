import { StyleSheet, Text, View, Modal, TouchableOpacity } from 'react-native'
import React from 'react'

const CustomDialog = ({ visible, content, setClose,title,color }) => {

  return (
    <Modal visible={visible}
      transparent
      onRequestClose={() => setClose(false)}>
      <TouchableOpacity style={styles.ModalBackGround}
        activeOpacity={1}
        onPress={() => setClose(false)}>
        <View style={[styles.modal,{borderColor:color=='red'?"#ca3146":"#52B69A"}]}>
        <View style={[styles.modalTitleBox,{backgroundColor:color=='red'?"#ca3146":"#52B69A"}]} >
          <Text style={styles.titleModal}>{title}</Text>
        </View>
          <View style={styles.contentS}>{content}</View>
             
        </View>
      </TouchableOpacity>
    </Modal>
  )
}

export default CustomDialog

const styles = StyleSheet.create({
  modal: {
    backgroundColor: 'white',
    position: 'absolute',
    top: "20%",
    width: "80%",
    alignSelf: 'center',
    borderRadius: 10,
    alignItems: 'center',
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
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    activeOpacity:1
  },
  modalTitleBox:{
  
    width: "100%",
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentS:{
    width:"100%",
  },
  titleModal:{
    fontSize:18,
    fontWeight: 'bold',
    color:'white',
   
  }
})
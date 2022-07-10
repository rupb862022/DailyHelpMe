import { StyleSheet, Text, View, Modal, TouchableOpacity } from 'react-native'
import React from 'react'

const CustomPopUp = ({ setDialog, dialog }) => {

  return (
    <Modal visible={dialog.visible}
      transparent
      onRequestClose={() => setDialog({...dialog,visible:false})}>
      <TouchableOpacity style={styles.ModalBackGround}
         activeOpacity={1}
        onPress={() => setDialog({...dialog,visible:false})}>
        <View style={[styles.modal,{borderColor:dialog.color=='red'?"#ca3146":"#52B69A"}]}>
          <View style={[styles.modalTitleBox,{backgroundColor:dialog.color=='red'?"#ca3146":"#52B69A"}]} >
            <Text style={styles.titleModal}>{dialog.textTitle}</Text>
          </View>
          <View>
            <Text style={styles.ModalText}>{dialog.textBody}</Text>
            <View style={[styles.row, { justifyContent: 'space-around', height: "30%", alignItems: 'flex-end' }]}>
              <TouchableOpacity style={styles.btnModal} onPress={() => setDialog({...dialog,visible:false})}>
                <Text style={styles.textBtnModal}>אישור</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  )
}

export default CustomPopUp

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
    height: 200
  },
  ModalBackGround: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    activeOpacity: 1
  },
  modalTitleBox: {
    height: 40,
    width: "100%",
    alignItems: 'center',
    justifyContent: 'center',
  },
  ModalText: {
    margin: 10,

  },
  btnModal: {
    bottom: 10,
    alignSelf:'center',
    position: 'absolute',
  },
  textBtnModal: {
    fontSize: 13,
    fontWeight: 'bold'
  },
  titleModal:{
    fontSize:16,
    fontWeight: 'bold',
    color:'white',
   
  }
})
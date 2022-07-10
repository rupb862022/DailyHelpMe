import { StyleSheet, Text, View, FlatList, Image, Dimensions, TouchableOpacity } from 'react-native'
import React, { useEffect, useState, useContext } from 'react';
import { acceptVol, getVol, denyVol } from '../../FetchCalls/profileAPI';
import { userContext } from '../../General/userContext';
import SelectDropdown from 'react-native-select-dropdown'
import moment from 'moment';
import CrownImg from '../../Components/CrownImg';
import ModalCustom from '../../ComponentStyle/ModalCustom';
import CustomPopUp from '../../ComponentStyle/CustomPopUp';
import { AntDesign, Ionicons } from '@expo/vector-icons';


const AcceptVolunteers = ({ navigation }) => {

  const { user } = useContext(userContext);

  const screenWidth = Dimensions.get('screen').width;
  const screenHeight = Dimensions.get('screen').height;

  const starImgFilled = 'https://raw.githubusercontent.com/tranhonghan/images/main/star_filled.png';
  const startImgCorner = 'https://raw.githubusercontent.com/tranhonghan/images/main/star_corner.png';

  const CustomRatingBar = ({ totalRate }) => {
    let maxRating = [1, 2, 3, 4, 5]
    return (
      <View style={styles.customRatingBarStyle}>
        {
          maxRating.map((item, key) => {
            return (
              <Image
                key={key}
                style={styles.starImgStyle}
                source={
                  item <= totalRate ? { uri: starImgFilled } : { uri: startImgCorner }
                } />
            )
          })
        }
      </View>
    )
  }

  const [dialog, setDialog] = useState({
    visible: false,
    textBody: "",
    textTitle: "",
  });

  const [listOfVol, setListOfVol] = useState([]);

  const acceptUser = (json) => {
    setShowModal(false)
    acceptVol(json).then(
      (result) => {
        result == "OK" ?
          setDialog({
            visible: true,
            textBody: "אישרת בהצלחה את המתנדב למשימה",
            textTitle: "פעולה בוצעה בהצלחה",
            color:"green"
          })
          : setDialog({
            visible: true,
            textBody: "אנא נסה שנית מאוחר יותר",
            textTitle: "פעולה נכשלה",
            color:"red"
          })
      },
      (error) => {
        console.log("accept vol not successful: ", error);
      });

    getVolunteers();
  }

  const denyUser = (json) => {
    setShowModal(false)
    denyVol(json).then(
      (result) => {
        result == "OK" ?
          setDialog({
            visible: true,
            textBody: "דחית בהצלחה את המתנדב",
            textTitle: "פעולה בוצעה בהצלחה",
            color:'green'
          })
          : setDialog({
            visible: true,
            textBody: "אנא נסה שנית מאוחר יותר",
            textTitle: "פעולה נכשלה",
            color:"red"
          })
      },
      (error) => {
        console.log("deny vol not successful: ", error);
      });

    getVolunteers();
  }

  const getVolunteers = () => {
    getVol(user.ID).then(
      (result) => {
        console.log("getVol vol successfully")
        setListOfVol(result)
      },
      (error) => {
        console.log("getVol vol not successful: ", error);
      });
  }

  useEffect(() => {
    navigation.addListener('focus', () => {
      getVolunteers();
    })

  }, [navigation])

  const [showModal, setShowModal] = useState(false);

  const [taskDate, setTaskDate] = useState({
    task: null,
    date: null,
  });

  const ProfileScreen = (json) => {
    setShowModal(false);
    navigation.navigate("ProfileOfUser", {
      ID: json.ID,
      FirstName: json.FirstName,
      LastName: json.LastName
    })
  }


  return (
    <View>
      <CustomPopUp dialog={dialog} setDialog={setDialog} />

      <FlatList
        contentContainerStyle={{ width: screenWidth * 0.9, height: screenHeight * 0.8, alignSelf: 'center',marginTop:10,  }}
        data={listOfVol}
        listKey={(item, index) => (item.TaskNumber + index).toString()}
        ListEmptyComponent={<Text>אין שיבוצים לאשר</Text>}
        keyExtractor={item => item.TaskNumber}
        renderItem={({ item }) => {
          return (
            <View style={{ borderBottomColor: 'black', borderBottomWidth: 1,width: screenWidth * 0.9, alignItems: 'center' }}>
                <Text style={{fontWeight: 'bold',alignSelf:'center'}}> {item.TaskName} </Text>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: "80%", alignSelf: 'center',margin:10}}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <AntDesign style={styles.icon} name="clockcircleo" size={14} color="#F8B11C" />
                      <Text style={{marginLeft:10}} >{item.TaskHour.substring(0, 5)}</Text>
                    </View>
                    
                    <SelectDropdown
                      buttonStyle={{
                        marginTop: 5,
                        width: "60%",
                        height: 30,
                        alignSelf: 'center',
                        shadowColor: 'black',
                        elevation: 1,
                      }}
                      dropdownIconPosition={'left'}
                      renderDropdownIcon={() => <Ionicons name="calendar" size={16} color="#F8B11C" />}
                      rowStyle={{ width: "100%", }}
                      dropdownStyle={{ width: "50%" }}
                      buttonTextStyle={{ fontSize: 14, textAlign: 'center', padding: 3 }}
                      data={item.TaskDates}
                      defaultButtonText="בחר תאריך"
                      onSelect={(selectedItem, index) => {
                        setTaskDate({
                          date: selectedItem,
                          task: item.TaskNumber
                        })
                        setShowModal(true);
                      }}
                      buttonTextAfterSelection={(selectedItem, index) => {
                        return moment(selectedItem).format('DD/MM/YYYY')
                      }}
                      rowTextForSelection={(item, index) => {
                        return moment(item).format('DD/MM/YYYY');
                      }}
                    />
                  </View>
               
                  </View>
      
          )
        }}

      />
      <ModalCustom setClose={setShowModal} visible={showModal} content={

        <FlatList
          data={taskDate.task != null && taskDate.date != null && listOfVol.length > 0 ? listOfVol.find(x => x.TaskNumber == taskDate.task).UsersRegistered.filter(x => x.Date == taskDate.date) : []
          }
          ListHeaderComponent={<Text style={styles.title}> מתנדבים אפשריים למשימה:</Text>}
          ListFooterComponent={
            <View>
              <TouchableOpacity
                style={styles.btnModal}
                onPress={() => setShowModal(false)}
              >
                <Text style={{ alignSelf: 'center', fontWeight: 'bold', fontSize: 12,color:"white" }}>
                  סגור
                </Text>
              </TouchableOpacity>
            </View>}
          listKey={users => users.ID + users.Date}
          keyExtractor={users => users.ID + users.Date}
          renderItem={(users) => {
            return (
              <View style={{ width: screenWidth, flexDirection: 'row', height: screenHeight * 0.1 }}>
                <TouchableOpacity onPress={() => ProfileScreen({
                  ID: users.item.ID,
                  FirstName: users.item.FirstName,
                  LastName: users.item.LastName
                })} style={{ width: "20%", height: "100%", justifyContent: 'center' }}>
                  <View style={{ marginLeft: 10 }}>
                    <CrownImg rank={users.item.Rank} profile={false} />
                  </View>
                  <Image style={styles.img} source={{ uri: users.item.Photo }} />
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', width: "80%", height: "100%", alignItems: 'center' }}>
                  <View style={{ width: "50%", alignSelf: 'flex-end', height: "70%" }}>

                    <TouchableOpacity onPress={() => ProfileScreen({
                      ID: users.item.ID,
                      FirstName: users.item.FirstName,
                      LastName: users.item.LastName
                    })}>
                      <Text style={styles.text} >{users.item.FirstName} {users.item.LastName}</Text>
                    </TouchableOpacity>
                    <View >
                      <CustomRatingBar totalRate={users.item.TotalRate} />
                    </View>
                  </View>
                  <View style={{ flexDirection: 'row', height: "85%", width: "30%", alignItems: 'space-around' }}>
                    <TouchableOpacity style={styles.acceptBtn} onPress={() => acceptUser({
                      ID: users.item.ID,
                      TaskNumber: taskDate.task,
                      TaskDate: users.item.Date
                    })}>
                      <Text style={{ fontSize: 12,color:"white"  }}> אשר </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.denyBtn} onPress={() => denyUser({
                      ID: users.item.ID,
                      TaskNumber: taskDate.task,
                      TaskDate: users.item.Date
                    })}>
                      <Text style={{ fontSize: 12,color:"white" }}> דחה </Text>
                    </TouchableOpacity>
                  </View>


                </View>
              </View>


            )
          }
          }
        />
      } />
    </View>
  )
}

export default AcceptVolunteers

const styles = StyleSheet.create({
  img: {
    width: 50,
    height: 50,
    marginLeft: 10,
    alignSelf: 'center',
    borderRadius: 50,
  },
  customRatingBarStyle: {
    flexDirection: 'row',
    height: 25,
    width: "70%"
  },
  starImgStyle: {
    width: 25,
    height: 25,
  },
  viewModal: {
    backgroundColor: 'white',
    position: 'absolute',
    alignSelf: 'center',
    top: "30%",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'black',
  },
  acceptBtn: {
    backgroundColor: '#52B69A',
    borderRadius: 20,
    padding: 4,
    margin: 2,
  },
  denyBtn: {
    backgroundColor: '#ca3146',
    borderRadius: 20,
    padding: 4,
    margin: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  btnModal: {
    marginTop: 10,
    marginBottom: 10,
    width: "20%",
    backgroundColor: "#52B69A",
    color: "black",
    alignSelf: 'center',
    padding: 3,
    margin: 3,
    borderRadius: 20,
    fontSize: 18,
    borderColor: '#52B69A',
    borderWidth: 1,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.5,
    shadowRadius: 1.8,
    elevation: 4
  },
  text: {
    fontSize: 12,
    fontWeight: 'bold'
  }
})
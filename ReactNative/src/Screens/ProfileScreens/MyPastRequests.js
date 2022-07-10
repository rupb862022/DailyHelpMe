import { StyleSheet, Text, View, FlatList, Modal, TouchableOpacity, Dimensions, Image ,ActivityIndicator} from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import { userContext } from '../../General/userContext';
import { pastRequest,deleteRequest } from '../../FetchCalls/profileAPI';
import SelectDropdown from 'react-native-select-dropdown'
import { Ionicons, AntDesign, MaterialCommunityIcons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import moment from 'moment';
import * as Clipboard from 'expo-clipboard';
import EditRequest from '../../Components/EditRequest';
import CustomPopUp from '../../ComponentStyle/CustomPopUp';
import CustomDialog from '../../ComponentStyle/CustomDialog';

const MyPastRequests = ({ navigation }) => {

  const { user } = useContext(userContext);
  const screenWidth = Dimensions.get('screen').width;
  const screenHeight = Dimensions.get('screen').height;
  const [requestList, setRequestList] = useState([]);

  const [loading,setLoading]=useState(true);

  const copyToClipboard = async (link) => {
    await Clipboard.setStringAsync(link);
  };

  const [dialog, setDialog] = useState({
    visible: false,
    textBody: "",
    textTitle: "",
  });

  const ProfileScreen = (json) => {
    navigation.navigate("ProfileOfUser", {
      ID: json.ID,
      FirstName: json.FirstName,
      LastName: json.LastName
    })
  }

  useEffect(() => {
    const whenFocus = navigation.addListener('focus', () => {
      getRequestList();
      return () => {
        getRequestList.abort()
      }
    });
    return whenFocus;

  }, [navigation])

  const getRequestList=()=>{
    setLoading(true);
    pastRequest(user.ID).then(
      (result) => {
        setRequestList(result);
        setLoading(false);
      },
      (error) => {
        setLoading(false);
      });
  }

  const [tasksShow, setTasksShow] = useState(null);
  const [dateTaskChose, setDateTaskChose] = useState({
    dateChosen: null,
    taskNum: null
  })
  const [ReqChose, setReqChose] = useState()

  const acceptUser = (json) => {
    setTasksShow(false)
    acceptVol(json).then(
      (result) => {
        result == "OK" ?
          setDialog({
            visible: true,
            textBody: "אישרת בהצלחה את המתנדב למשימה",
            textTitle: "פעולה בוצעה בהצלחה",
            color:"green"
          })
          : console.log("accept vol un!!successfully: ", result)
      },
      (error) => {
        console.log("accept vol not successful: ", error);
      });
  }

  const denyUser = (json) => {
    setTasksShow(false)
    DenyVol(json).then(
      (result) => {
        result == "OK" ?
          setDialog({
            visible: true,
            textBody: "דחית בהצלחה את המתנדב",
            textTitle: "פעולה בוצעה בהצלחה",
            color:"green"
          })
          : console.log("accept vol un!!successfully: ", result)
      },
      (error) => {
        console.log("accept vol not successful: ", error);
      });
  }

  const starImgFilled = 'https://raw.githubusercontent.com/tranhonghan/images/main/star_filled.png';
  const startImgCorner = 'https://raw.githubusercontent.com/tranhonghan/images/main/star_corner.png';

  const [showEditModal, setShowEditModal] = useState(false);

  const [showMissionSigned,setShowMissionSigned] = useState(false);
  const [signedTasks,setSignedTasks]=useState([]);

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

  const RequestDeleteApproved = (requestCode) => {
    deleteRequest(requestCode).then(
      (result) => {
        if(result == "OK"){
          setDialog({
            visible: true,
            textBody: "בקשה זו נמחקה",
            textTitle: "פעולה בוצעה בהצלחה",
            color: 'green'
          });

          let temp = requestList.filter(x=> x.RequestCode != requestCode);
          setRequestList(temp);
        }
        else{ setDialog({
            visible: true,
            textBody: "בקשה זו לא נמחקה, אנא נסה שנית במועד מאוחר יותר",
            textTitle: "פעולה נכשלה",
            color: 'red'
          })
        }
      },
      (error) => {
        setDialog({
          visible: true,
          textBody: "בקשה זו לא נמחקה, אנא נסה שנית במועד מאוחר יותר",
          textTitle: "פעולה נכשלה",
          color: 'red'
        })
      });
  }

  const DeleteRequest = (req) => {
    let taskSigned = [];
    req.Task.forEach(task => {
      task.TaskDateStatus.forEach(taskDate => {
        if (taskDate.Status == "signed") {
          if (moment(taskDate).isAfter(moment())) {
            setDialog({
              visible: true,
              textBody: "ישנו מתנדב משובץ למשימת עבר ולכן לא ניתן למחוק את הבקשה",
              textTitle: "לא ניתן להשלים את הפעולה",
              color: 'red'
            })
            return;
          }

          taskSigned.push({
            taskName: task.TaskName,
            date: taskDate.TaskDate
          })
        }
        else if (taskDate.Status == "wait") {
          taskSigned.push({
            taskName: task.TaskName,
            date: taskDate.TaskDate
          })
        }
      })
    })

    if (taskSigned.length > 0) {
      setSignedTasks(taskSigned);
      setShowMissionSigned(true)
    }
    else {
      RequestDeleteApproved(req.RequestCode)
    } 
  }

  const Tasks = () => (
    <View style={{ width: screenWidth, }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: "center",
          alignSelf: 'center',
          width: "90%",
          padding: 10,
          backgroundColor: "#e7e5e5",
          borderRadius: 5,
          height: screenHeight * 0.11
        }}>
        <TouchableOpacity style={{ width: "75%", alignItems: 'flex-start' }} onPress={() => {
          setTasksShow(false)
        }}>
          <Text style={styles.title}> {ReqChose.RequestName} </Text>
          <Text> {moment(ReqChose.StartDate).format("DD/MM/YYYY")} - {moment(ReqChose.EndDate).format("DD/MM/YYYY")} </Text>
          <TouchableOpacity style={[styles.row, styles.center]} onPress={() => copyToClipboard(ReqChose.Link)}>
            <FontAwesome5 name="copy" size={14} color="#F8B11C" />
            <Text style={{ fontSize: 12 }}> העתקת קוד בקשה</Text>
          </TouchableOpacity>
        </TouchableOpacity>
        <View style={{ width: "25%", marginTop: 5, }}>
          <View style={[styles.row, { justifyContent: 'space-around', marginBottom: 12 }]}>
            <TouchableOpacity onPress={() => { setShowEditModal(true); setReqChose(ReqChose) }}>
              <MaterialCommunityIcons name="square-edit-outline" size={22} color="#F8B11C" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {DeleteRequest(ReqChose) }}>
              <FontAwesome5 name="trash" size={18} color="#F8B11C" />
            </TouchableOpacity>
          </View>
          {ReqChose.PrivateRequest &&
            <View style={{ alignItems: 'center', }} >
              <MaterialIcons name="privacy-tip" size={14} color="black" />
              <Text style={{ fontSize: 10 }}>  בקשה פרטית </Text>
            </View>}
        </View>
      </View>
      <FlatList
        scrollEnabled={true}
        nestedScrollEnabled={true}
        data={ReqChose.Task}
        listKey={"list1s"}
       // listKey={(item, index) => (item.TaskNumber + index).toString()}
        keyExtractor={(item, index) => (index).toString()}
        ItemSeparatorComponent={() => {
          return <View style={{ backgroundColor: "black", height: 1, width: "90%", alignSelf: 'center' }} />
        }}
        renderItem={({ item }) => {
          return (
            <View style={{ width: screenWidth * 0.82, alignSelf: 'center', marginBottom: 5, marginTop: 5 }}>
              <Text style={styles.textTitle}>{item.TaskName}</Text>
              <Text>{item.TaskDescription}</Text>
              <View style={[styles.row, { justifyContent: 'space-between' }]}>
                <View style={styles.row}>
                  <SelectDropdown
                    buttonStyle={{
                      backgroundColor: 'transparent',
                      borderColor: '#52B69A',
                      borderWidth: 0.5,
                      borderRadius: 5,
                      width: "65%",
                      height: "100%",
                      alignSelf: 'center'
                    }}
                    rowStyle={{ width: "100%", }}
                    buttonTextStyle={{ fontSize: 14, textAlign: 'center', }}
                    data={item.DatesForTask}
                    defaultButtonText="בחר תאריך"
                    onSelect={selectedItem => setDateTaskChose({ dateChosen: selectedItem, taskNum: item.TaskNumber })}
                    buttonTextAfterSelection={selectedItem => moment(selectedItem).format('DD/MM/YYYY')}
                    rowTextForSelection={item => moment(item).format('DD/MM/YYYY')}

                  />
                </View>
                <View style={styles.row}>
                <AntDesign name="clockcircleo" size={20} color="#F8B11C" />
                  <Text>   {item.TaskHour.substring(0, 5)}  </Text>
                </View>
              </View>
              <View style={[styles.row, { alignSelf: 'center' }]}>
                <Text> {item.CityName}</Text>
                <Ionicons name="location" size={20} color="#F8B11C" />
              </View>
              {item.TaskNumber == dateTaskChose.taskNum ?
                <FlatList
                  style={{ marginTop: 10 }}
                  ListEmptyComponent={() =>
                    <Text style={[styles.textTitle, { textAlign: 'center' }]}>
                      {moment(dateTaskChose.dateChosen).isAfter(moment()) ? "לא השתבצו עדיין למשימה זו" : "לא ניתן להשתבץ למשימה זו"}
                    </Text>
                  }
                  listKey={"list2s"}
                  data={dateTaskChose.dateChosen != null ? item.TaskDateStatus.filter(x => x.TaskDate == dateTaskChose.dateChosen)[0].UserSigned : []}
                  keyExtractor={(item, index) =>  index}
                  renderItem={(item) => {
                    return (
                      <View style={{ width: screenWidth, flexDirection: 'row' }}>
                        <TouchableOpacity
                          style={{ width: "20%", alignSelf: 'flex-end' }}
                          onPress={() => ProfileScreen({
                            ID: item.item.ID,
                            FirstName: item.item.FirstName,
                            LastName: item.item.LastName
                          })}>
                          <Image style={styles.img} source={{ uri: item.item.Photo }} />
                        </TouchableOpacity>
                        <View style={{ flexDirection: 'row', width: "80%" }}>
                          <View style={{ width: "50%", alignSelf: 'center' }}>
                            <TouchableOpacity
                              onPress={() => ProfileScreen({
                                ID: item.item.ID,
                                FirstName: item.item.FirstName,
                                LastName: item.item.LastName
                              })}>
                              <Text style={{ fontSize: 14, fontWeight: "bold" }} >{item.item.FirstName} {item.item.LastName}</Text>
                            </TouchableOpacity>
                            <CustomRatingBar totalRate={item.item.TotalRate} />
                          </View>
                          <View style={{ flexDirection: 'row', width: "30%", justifyContent: 'space-around', alignSelf: 'flex-end' }}>
                            {item.item.Status != "signed"?
                            <TouchableOpacity
                              disabled={moment(dateTaskChose.dateChosen).isAfter(moment()) ? false : true}
                              style={moment(dateTaskChose.dateChosen).isAfter(moment()) ? styles.acceptBtn : styles.btnTooLate} onPress={() => acceptUser({
                                ID: item.item.ID,
                                TaskNumber: dateTaskChose.taskNum,
                                TaskDate: dateTaskChose.dateChosen,
                              })}>
                              <Text style={{ fontSize: 12 }}> אשר </Text>
                            </TouchableOpacity>: null}
                            <TouchableOpacity
                              disabled={moment(dateTaskChose.dateChosen).isAfter(moment()) ? false : true}
                              style={moment(dateTaskChose.dateChosen).isAfter(moment()) ? styles.denyBtn : styles.btnTooLate}
                              onPress={() => denyUser({
                                ID: item.item.ID,
                                TaskNumber: dateTaskChose.taskNum,
                                TaskDate: dateTaskChose.dateChosen,
                              })}>
                              <Text style={{ fontSize: 12 }}> דחה </Text>
                            </TouchableOpacity>
                          </View>

                        </View>
                      </View>
                    )
                  }}
                />
                : null
              }

            </View>
          )
        }} />
    </View>
  )

  const renderItem = ({ item }) => {
    return (
      <View style={{
        width: screenWidth,
      }}>
        <TouchableOpacity onPress={() => {
          setTasksShow(true)
          setDateTaskChose({ dateChosen: null, taskNum: null })
          setReqChose(item)
        }}
          style={{
            flexDirection: 'row',
            justifyContent: "center",
            alignSelf: 'center',
            width: "90%",
            margin: 5
          }}>
          <View style={{ width: "80%", alignItems: 'flex-start' }}>
            <Text style={styles.title}> {item.RequestName} </Text>
            <Text> {moment(item.StartDate).format("DD/MM/YYYY")} - {moment(item.EndDate).format("DD/MM/YYYY")} </Text>
            <TouchableOpacity style={[styles.row, styles.center]} onPress={() => copyToClipboard(item.Link)}>
              <FontAwesome5 name="copy" size={14} color="#F8B11C" />
              <Text style={{ fontSize: 12 }}> העתקת קוד בקשה</Text>
            </TouchableOpacity>
          </View>
          <View style={{ width: "25%", marginTop: 5, }}>
            <View style={[styles.row, { justifyContent: 'space-around', marginBottom: 12 }]}>
              <TouchableOpacity onPress={() => { setShowEditModal(true); setReqChose(item) }}>
                <MaterialCommunityIcons name="square-edit-outline" size={22} color="#F8B11C" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { DeleteRequest(item) }}>
                <FontAwesome5 name="trash" size={18} color="#F8B11C" />
              </TouchableOpacity>
            </View>
            {item.PrivateRequest &&
              <View style={{ alignItems: 'center', }} >
                <MaterialIcons name="privacy-tip" size={14} color="black" />
                <Text style={{ fontSize: 10 }}>  בקשה פרטית </Text>
              </View>}
          </View>
        </TouchableOpacity>
        <View style={{ backgroundColor: "#52B69A", height: 3, marginTop: 4, width: "95%", alignSelf: 'center', }} />
      </View>
    )
  }


  if (loading) {
    return <ActivityIndicator />
  }
  else{
  return (
    <View>
      <Modal
        transparent
        visible={showEditModal}
        animationType="fade"
        style={{ backgroundColor: 'grey', top: 0 }}
        onRequestClose={() => { setShowEditModal(false) }}
      >
        <TouchableOpacity style={styles.ModalBackGround} onPress={() => setShowEditModal(false)}
          activeOpacity={1}
        >
          <View style={styles.modal}>
            <View>
              <EditRequest requestSent={ReqChose} moveBack={setShowEditModal} />
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
      <CustomDialog visible={showMissionSigned} setClose={setShowMissionSigned} title="פעולה נדחתה" content={
        <FlatList
          data={signedTasks}
          keyExtractor={(item,index)=> index}
          ListHeaderComponent={<Text style={[styles.textTitle,{fontSize:13,padding:5}]}>מחיקת הבקשה תגרום לביטול שיבוצי הממתינים הבאים:</Text>}
          listKey={"lists4"}
          renderItem={({item}) => {
              return(
                <View>
                  <View style={[styles.row,styles.center]}>
                  <Text style={styles.text}>{item.taskName}</Text>
                  <Text style={styles.text}>{moment(item.date).format("DD/MM/YYYY")}</Text>
                  </View>             
                </View>
              )
          }}
          />

       
      }/>

      <CustomPopUp dialog={dialog} setDialog={setDialog} />
      <Modal
        transparent
        visible={tasksShow}
        animationType="fade"
        style={{ backgroundColor: 'grey', height: '40%' }}
        onTouchCancel={() => { setTasksShow(false) }}
        onRequestClose={() => { setTasksShow(false) }}
      >
        <TouchableOpacity style={styles.ModalBackGround} onPress={() => setTasksShow(false)}
          activeOpacity={1}
        >
          <View style={styles.modal}>
            <Tasks />
          </View>
        </TouchableOpacity>
      </Modal>
      <FlatList
        style={{ width: screenWidth, height: screenHeight * 0.7 }}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        contentInsetAdjustmentBehavior="always"
        scrollEnabled={true}
        data={requestList}
        renderItem={renderItem}
        keyExtractor={item => item.RequestCode}
        listKey={"list3s"}
        ListEmptyComponent={() => {
          return (
            <View>
              <Text> לא נמצאו תוצאות </Text>
            </View>
          );
        }}

      />

    </View>
  )
}
}

export default MyPastRequests

const styles = StyleSheet.create({
  title: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 13,
    color: 'grey',
  },
  textTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 3
  },
  btnStyle: {
    height: 30,
    marginTop: 12,
    textAlign: 'center',
    width: "40%",
    color: "black",
    alignSelf: 'center',
    padding: 4,
    borderRadius: 20,
    fontSize: 14,
    borderColor: 'black',
    borderWidth: 1,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.5,
    shadowRadius: 1.8,
    elevation: 4,
  },
  row: {
    flexDirection: 'row',
  },
  center: {
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: 'white',
    position: 'absolute',
    top: "10%",
    width: "98%",
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
  btnModal: {
    width: "20%",
    borderWidth: 0.5,
    borderColor: "#52B69A",
    borderRadius: 5,
    marginBottom: 5
  },
  btnTooLate: {
    backgroundColor: 'grey',
    borderRadius: 20,
    padding: 4,
    margin: 2,
    justifyContent: 'center',
  },
  btnModalText: {
    color: "#52B69A",
    textAlign: 'center'
  },
  acceptBtn: {
    backgroundColor: '#52B69A',
    borderRadius: 20,
    padding: 4,
    margin: 2,
    justifyContent: 'center',
  },
  denyBtn: {
    backgroundColor: '#F8B11C',
    borderRadius: 20,
    padding: 4,
    margin: 2,
    justifyContent: 'center',
  },
  img: {
    borderRadius: 40,
    height: 50,
    width: 50,
    alignSelf: 'center'
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
  ModalBackGround: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',

  }
})
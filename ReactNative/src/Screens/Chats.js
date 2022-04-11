import { StyleSheet, Text, View, FlatList, Dimensions, TouchableOpacity } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { userContext } from '../General/userContext';
import { Button } from 'react-native-paper';
import ButtonCustom from '../ComponentStyle/ButtonCustom';
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { futureTaskToDo, cancelTask, changeTaskStatus } from '../FetchCalls/futureTaskAPI';
import moment from 'moment';
import { useFocusEffect } from '@react-navigation/native';

const Chats = ({ navigation }) => {
  const { user } = useContext(userContext);
  const [taskList, setTaskList] = useState(null);

  const screenWidth = Dimensions.get('screen').width;
  const screenHeight = Dimensions.get('screen').height;

  useEffect(() => {
    navigation.addListener('focus', () => {
      futureTaskToDo(user.ID)
        .then(
          (result) => {
            console.log("futureTaskToDo successfuly=", result)
            if (result.length != 0) {
              setTaskList(result)
            }
            else {
              //מה לעשות כשאין משימות ברשימה
            }
          },
          (error) => {
            consol.log("futureTaskToDo not successfuly", error);
          })
    });

  }, [navigation])


  // TaskName = r.TaskName,
  // TaskHour = r.TaskHour,
  // TaskPlace =r.City.CityName,
  // TaskDate =r.StartDate,
  // MobilePhone=r.Request.Users.MobilePhone

  const finishTask = (Task) => {
    changeTaskStatus({
      ID: user.ID,
      TaskNumber: Task.TaskNumber,
    }).then(
      (result) => {
        console.log("finish Task: ", result)
        if (result == "Ok") {
          let temp = taskList.filter(t => t.TaskNumber !== Task.TaskNumber)
          setTaskList(temp)
        }
      },
      (error) => {
        console.log("Signed To Task with confirmation error=", error);
      });
  }


  const RemoveTask = (Task) => {
    cancelTask({
      ID: user.ID,
      TaskNumber: Task.TaskNumber,
    }).then(
      (result) => {
        console.log("cancel registration: ", result)
        if (result == "OK") {
          Task.Status = "sign"
          let temp = taskList.filter(t => t.TaskNumber !== Task.TaskNumber)
          setTaskList(temp)
          // showDialog()
          // setTextForDialog({ textTitle: "שיבוצך בוטל בהצלחה", textBody: `שיבוצך למשימה ${Task.TaskName} בוטל בהצלחה` })
        }
      },
      (error) => {
        console.log("Signed To Task with confirmation error=", error);
      });
  }

  return (
    <View style={{ height: screenHeight * 0.75, width: screenWidth }}>
      <FlatList
        scrollEnabled={true}
        data={taskList}
        listKey={"list1s"}
        renderItem={({ item }) => {
          return (
            <View style={styles.container}>
              <View>
                <Text style={styles.name}>{item.TaskName} </Text>
                <View style={styles.row}>
                  <Text style={styles.txt}> תאריך: {moment(item.TaskDate).format("DD/MM/YYYY")} </Text>
                  <Text style={[styles.hour, styles.txt]}> שעה: {item.TaskHour} </Text>
                </View>
                <View style={styles.row}>
                  <Text style={[styles.phone, styles.txt]}>{item.MobilePhone} </Text>
                  <AntDesign style={styles.icon} name="phone" size={24} color="#F8B11C" />
                  <Text style={[styles.place, styles.txt]}>{item.TaskPlace} </Text>
                  <Ionicons style={styles.icon} name="location" size={24} color="#F8B11C" />
                </View>          
                <TouchableOpacity style={styles.btn} onPress={() => RemoveTask(item)}>
                  <Text> הסר שיבוץ </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btn} onPress={() => finishTask(item)}>
                  <Text> סיימתי את המשימה  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )
        }}
        keyExtractor={(item) => item.TaskNumber}
        ItemSeparatorComponent={() => {
          return <View style={{ backgroundColor: "#52B69A", height: 4, marginTop: 20 }} />
        }}
      />
    </View>
  )
}

export default Chats

const styles = StyleSheet.create({
  container: {
    marginTop: 20
  },
  name: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 20,
    color: 'black'
  },
  txt: {
    fontSize: 18,
    color: 'grey',
  },
  hour: {
    marginRight: 30,
    marginBottom: 10
  },
  place: {
    marginRight: -10
  },
  phone: {
    marginRight: -15
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    textAlign: 'center'
  },
  icon: {
    marginLeft: -40
  },
  btn: {
    marginTop: 20,
    width: "50%",
    backgroundColor: "#52B69A",
    color: "black",
    alignSelf: 'center',
    padding: 7,
    borderRadius: 20,
    fontSize: 18,
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
    alignItems: 'center',
  }

})
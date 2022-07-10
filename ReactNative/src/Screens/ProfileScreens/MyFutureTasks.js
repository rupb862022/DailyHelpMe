import { StyleSheet, Text, View, FlatList, Dimensions, TouchableOpacity, ActivityIndicator, Image } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { userContext } from '../../General/userContext';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { futureTaskToDo, cancelTask, changeTaskStatus } from '../../FetchCalls/futureTaskAPI';
import moment from 'moment';
import SelectDropdown from 'react-native-select-dropdown'
import CustomPopUp from '../../ComponentStyle/CustomPopUp';

const MyFutureTasks = ({ navigation }) => {
  const { user,setUser } = useContext(userContext);
  const [taskList, setTaskList] = useState([]);
  const [loading, setLoading] = useState(true);

  const screenWidth = Dimensions.get('screen').width;
  const screenHeight = Dimensions.get('screen').height;

  const [dialog, setDialog] = useState({
    visible: false,
    textBody: "",
    textTitle: "",
    color: 'green'
  });

  const getTasks = () => {
    setLoading(true)
    futureTaskToDo(user.ID)
      .then(
        (result) => {
          setTaskList(result)
          setLoading(false)
        },
        (error) => {
          consol.log("futureTaskToDo not successfuly", error);
        })
  }

  useEffect(() => {
    const whenFocus = navigation.addListener('focus', () => {
      getTasks();
      return () => {
        getTasks.abort()
      }
    });
    return whenFocus;

  }, [navigation])

  const finishTask = (Task) => {

    if (Task.TaskDates.length > 0) {
      if (!moment(chosenDateTask.Date).isBefore(moment())) {
        setDialog({ visible: true, textTitle: "שגיאה", textBody: `לא ניתן לסיים משימה לפני תאריך המשימה`, color: 'red' })
        return;
      }
    }

    changeTaskStatus({
      ID: user.ID,
      TaskNumber: Task.TaskNumber,
      TaskDate:Task.TaskDates.length == 1? chosenDateTask.Date : Task.TaskDates[0]
    }).then(
      (result) => {
        console.log("finish Task: ", result)
        if (result == "Ok") {
          setDialog({ visible: true, textTitle: "אישרת את סיום המשימה", textBody: `תודה על שלקחת חלק מהקהילה שלנו`, color: 'green' })
          setUser({...user,TaskDone:user.TaskDone+1,RegisteredTasks:user.RegisteredTasks-1})
          getTasks()
        }
        else {
          setDialog({ visible: true, textTitle: "שגיאה", textBody: `אנא נסה שנית מאוחר יותר`, color: 'red' })
        }
      },
      (error) => {
        setDialog({ visible: true, textTitle: "שגיאה", textBody: `אנא נסה שנית מאוחר יותר`, color: 'red' })
      });
  }

  const [chosenDateTask, setChosenDateTask] = useState({
    Date: null,
    TaskNum: null
  })

  const RemoveTask = (Task) => {
    cancelTask({
      ID: user.ID,
      TaskNumber: Task.TaskNumber,
      TaskDate: chosenDateTask.Date
    }).then(
      (result) => {
        console.log("cancel registration: ", result)
        if (result == "OK") {
          setDialog({ visible: true, textTitle: "שיבוצך בוטל בהצלחה", textBody: `שיבוצך למשימה בוטל בהצלחה`, color: 'green' })
        }
        else {
          setDialog({ visible: true, textTitle: "לא ניתן לבטל שיבוץ", textBody: `אנא נסה שנית מאוחר יותר`, color: 'red' })
        }

        getTasks();
      },
      (error) => {
        setDialog({ visible: true, textTitle: "לא ניתן לבטל שיבוץ", textBody: `אנא נסה שנית מאוחר יותר`, color: 'red' })
      });
  }

  if (loading) {
    return (<ActivityIndicator />)
  }
  else {
    return (
      <View style={{ height: screenHeight * 0.75, width: screenWidth }}>
        <CustomPopUp dialog={dialog} setDialog={setDialog} />
        <FlatList
          scrollEnabled={true}
          data={taskList}
          listKey={"list1s"}
          ListEmptyComponent={<Text>לא נמצאו תוצאות</Text>}
          renderItem={({ item }) => {
            return (
              <View style={styles.container}>
                <Text style={styles.taskTitle}>{item.TaskName}</Text>
                <View style={{ flexDirection: 'row', width: "65%", alignSelf: 'center' }}>
                  <View style={{ alignItems: "center", width: "30%" }}>
                    <Image source={{ uri: item.Photo }} style={styles.img} />
                    <Text style={styles.txt}>{item.UserUpload}</Text>
                  </View>
                  <View style={{ alignItems: "center", width: "70%" }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', width: "100%" }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <AntDesign style={styles.icon} name="clockcircleo" size={14} color="#F8B11C" />
                        <Text style={styles.txt}>{item.TaskHour.substring(0, 5)}</Text>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons style={styles.icon} name="location" size={14} color="#F8B11C" />
                        <Text style={[styles.txt]}>{item.TaskPlace}</Text>
                      </View>
                    </View>
                    <SelectDropdown
                      buttonStyle={{
                        width: "100%",
                        height: 40,
                        alignSelf: 'center',
                        backgroundColor: "transparent",
                        shadowColor: 'black',
                        elevation: item.TaskDates.length > 1 ? 2 : 0,
                      }}
                      dropdownIconPosition={'left'}
                      renderDropdownIcon={() => {
                        if (item.TaskDates.length > 1) {
                          return <AntDesign name="caretdown" size={15} color="grey" />
                        }
                      }}
                      disabled={item.TaskDates.length > 1 ? false : true}
                      rowStyle={{ width: "100%", }}
                      dropdownStyle={{ width: "40%" }}
                      buttonTextStyle={{ fontSize: 15, textAlign: 'center', padding: 2 }}
                      data={item.TaskDates}
                      defaultButtonText={item.TaskDates.length > 1 ? "צפה בתאריכים" : moment(item.TaskDates[0]).format('DD/MM/YYYY')}
                      onSelect={(selectedItem, index) => {
                        setChosenDateTask({ Date: selectedItem, TaskNum: item.TaskNumber })
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
                <View style={styles.row}>
                  <TouchableOpacity style={[styles.btn, { backgroundColor: "#ca3146", borderColor: "#ca3146" }]} onPress={() => RemoveTask(item)}>
                    <Text style={{ color: "white" }}>הסר שיבוץ</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.btn} onPress={() => finishTask(item)}>
                    <Text style={{ color: "white" }}>המשימה בוצעה</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )
          }}
          keyExtractor={(item) => item.TaskNumber}
          ItemSeparatorComponent={() => {
            return <View style={{ backgroundColor: "#52B69A", height: 4, marginTop: 10 }} />
          }}
        />
      </View>
    )
  }
}

export default MyFutureTasks

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    width: '100%',
  },
  taskTitle: {
    fontSize: 15,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 10
  },
  txt: {
    fontSize: 14,
    padding: 2
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    textAlign: 'center',
    width: '100%',
  },
  icon: {
    marginRight: 2
  },
  btn: {
    margin: 5,
    width: "35%",
    backgroundColor: "#52B69A",
    color: "black",
    alignSelf: 'center',
    padding: 5,
    borderRadius: 20,
    fontSize: 18,
    borderColor: "#52B69A",
    borderWidth: 1,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.5,
    shadowRadius: 1.8,
    elevation: 3,
    alignItems: 'center',
  },
  img: {
    height: 40,
    width: 40,
    borderRadius: 50,
  }
})
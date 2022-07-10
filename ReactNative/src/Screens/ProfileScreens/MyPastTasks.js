import { StyleSheet, Text, View, FlatList, Dimensions, Image, ActivityIndicator } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import { taskDoneByMe } from '../../FetchCalls/profileAPI';
import { userContext } from '../../General/userContext';
import moment from 'moment';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import SelectDropdown from 'react-native-select-dropdown'

const MyPastTasks = ({ navigation }) => {

  const [taskList, setTaskList] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(userContext);

  const screenWidth = Dimensions.get('screen').width;
  const screenHeight = Dimensions.get('screen').height;

  useEffect(() => {
    const whenFocus = navigation.addListener('focus', () => {
      setLoading(true);
      taskDoneByMe(user.ID)
        .then(
          (result) => {
            if (result.length != 0) {
              setTaskList(result)
            }
            setLoading(false)
          },
          (error) => {
            setLoading(false)
          })
    });
    return whenFocus;
  }, [navigation])

  if (loading) {
    return <ActivityIndicator />
  }
  else {
    return (
      <View style={{ height: screenHeight * 0.72, width: screenWidth }}>
        <FlatList
          style={{ height: "100%" }}
          scrollEnabled={true}
          data={taskList}
          listKey={"list1s"}
          renderItem={({ item }) => {
            return (
              <View style={styles.container}>
                <View style={{ flexDirection: 'row', width: "100%", }}>
                  <View style={{ width: "30%", alignItems: "center" }}>
                    <Text style={[styles.taskTitle, { textDecorationLine: "underline", fontSize: 13, color: 'grey', marginBottom: 10 }]}>עבור:</Text>
                    <Image source={{ uri: item.Photo }} style={styles.img} />
                    <Text style={styles.txt}>{item.UserUpload}</Text>
                  </View>
                  <View style={{ width: "70%", alignItems: "center" }}>
                    <Text style={[styles.taskTitle, { textDecorationLine: "underline", fontSize: 13, color: 'grey' }]}>ביצעתי:</Text>
                    <Text style={styles.taskTitle}>{item.TaskName}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', width: "70%" }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <AntDesign style={styles.icon} name="clockcircleo" size={14} color="#F8B11C" />
                        <Text style={styles.txt}>{item.TaskHour.substring(0, 5)}</Text>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons style={styles.icon} name="location" size={14} color="#F8B11C" />
                        <Text style={[styles.txt]}>{item.TaskPlace}  </Text>
                      </View>
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
                      dropdownStyle={{ width: "40%" }}
                      buttonTextStyle={{ fontSize: 13, textAlign: 'center', padding: 2 }}
                      data={item.TaskDates}
                      defaultButtonText="צפה בתאריכים"
                      onSelect={(selectedItem, index) => {

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

export default MyPastTasks

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    width: '100%',
  },
  taskTitle: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 5
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
    marginRight: 5
  },
  btn: {
    marginTop: 20,
    width: "35%",
    backgroundColor: "#52B69A",
    color: "black",
    alignSelf: 'center',
    padding: 5,
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
  },
  img: {
    height: 50,
    width: 50,
    borderRadius: 50,
  }

})
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, TextInput, Modal } from 'react-native'
import React, { useEffect, useState, useContext } from 'react';
import moment from 'moment';
import { getDoneTasks, rateUser } from '../../FetchCalls/profileAPI';
import { userContext } from '../../General/userContext';
import ModalCustom from '../../ComponentStyle/ModalCustom';

const TaskRating = ({navigation}) => {

  const { user } = useContext(userContext);

  const [rate, setRate] = useState({
    Rating: null,
    Recommendation: null,
    TaskRegisteredNum: null,
    DoneRate: false
  });

  const [rateModalShow, setRateModalShow] = useState(false);

  const [defaultRating, setDefaultRating] = useState(0);
  const starImgFilled = 'https://raw.githubusercontent.com/tranhonghan/images/main/star_filled.png';
  const startImgCorner = 'https://raw.githubusercontent.com/tranhonghan/images/main/star_corner.png';

  useEffect(() => {
    if (rate.DoneRate) {
      JSON.stringify(rate)
      console.log("rate= ",rate)
      rateUser(rate).then(
        (result) => {
          if (result) {
            getTaskToRate();
          }
          console.log("Phone checked not successfully: ", result)
        },
        (error) => {
          console.log("checkPhoneFailed=", error);
        });

      setRate({ ...rate, DoneRate: false })
    }
  }, [rate.DoneRate])

  const DoneRate = (taskToRate) => {
    setRate({
      Rating: defaultRating,
      Recommendation: rate.Recommendation,
      TaskRegisteredNum: taskToRate,
      DoneRate: true
    })
  }

  const CustomRatingBar = () => {
    let maxRating = [1, 2, 3, 4, 5];
    return (
      <View style={styles.customRatingBarStyle}>
        {
          maxRating.map((item, key) => {
            return (
              <TouchableOpacity activeOpacity={0.7} key={item} onPress={() => setDefaultRating(item)}>
                <Image
                  style={styles.starImgStyle}
                  source={
                    item <= defaultRating ? { uri: starImgFilled } : { uri: startImgCorner }
                  } />
              </TouchableOpacity>
            )
          })
        }
      </View>
    )
  }

  const getTaskToRate= ()=>{
    getDoneTasks(user.ID)
    .then(
      (result) => {
        console.log("getDoneTasks successfuly=", result)
        if (result != "No") {
          setTaskList(result)
        }
      },
      (error) => {
        consol.log("getDoneTasks not successfuly", error);
      })
  }


  useEffect(() => {
    const whenFocus = navigation.addListener('focus', () => {
      getTaskToRate();
    })
    return whenFocus;
  }, [navigation])



  const [taskList, setTaskList] = useState([]);

  const [RateDialog, setRateDialog] = useState({
    FirstName: null,
    LastName: null,
    TaskName: null,
    TaskDate: null,
    TaskRegisteredNum: null,
    Photo: null,
    Rank: null,
  });


  return (
    <View style={{ width: '100%', height: '100%' }}>
      <FlatList
        keyExtractor={item => item.TaskRegisteredNum}
        data={taskList}
        ListEmptyComponent={() => {
          return (
            <View>
               <Text> אין מתנדבים חדשים לדרג </Text>
            </View>
          );
        }}
        renderItem={(item) => {
          return (
            <View style={[styles.container, styles.row]}>
              <View style={{ width: "20%", alignItems: 'flex-start' }} >
                <Image style={styles.imgSlideStyle} source={{ uri: item.item.Photo }} />
              </View>
              <View style={{ width: "60%", alignItems: 'flex-start' }} >
                <Text style={styles.title}> {item.item.FirstName} {item.item.LastName} </Text>
                <Text style={styles.textNoBold}> {item.item.TaskName} </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={styles.textNoBold}> {moment(item.item.TaskDate).format('DD/MM/YYYY')} </Text>
                </View>

              </View>
              <TouchableOpacity style={[styles.rateBtn, { width: "20%" }]}
                onPress={() => {
                  setRateDialog(item.item)
                  setRateModalShow(true)
                }}>
                <Text style={styles.text}> דרג </Text>
              </TouchableOpacity>
            </View>
          )
        }}
        ItemSeparatorComponent={() => {
          return <View style={{ backgroundColor: "#52B69A", height: 4 }} />
        }}
      />
      {rateModalShow && <ModalCustom setClose={setRateModalShow} visible={rateModalShow} content={
        <View style={styles.containerDialog}>
          <Text style={styles.textNoBold}> עבור המשימה: {RateDialog.TaskName} </Text>
          <Text style={styles.textNoBold}>בתאריך {moment(RateDialog.TaskDate).format('DD/MM/YYYY')} </Text>
          <Text style={styles.title}> דרג את שביעות רצונך מ{RateDialog.FirstName} </Text>
          <CustomRatingBar />
          <Text style={styles.title}>
            המלצה על {RateDialog.FirstName}
          </Text>
          <TextInput
            multiline={true}
            numberOfLines={4}
            style={styles.input}
            maxLength={100}
            onChangeText={(text) => setRate({ ...rate, Recommendation: text })}
          />
          <View style={[styles.row, { width: "50%", marginTop: 30 }]}>
            <TouchableOpacity onPress={() => setRateModalShow(false)} >
              <Text style={styles.modalBtn}> חזור </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              setRateModalShow(false)
              DoneRate(RateDialog.TaskRegisteredNum);
            }}>
              <Text  style={styles.modalBtn}> דרג </Text>
            </TouchableOpacity>
          </View>
        </View>

      } />}
    </View>
  )
}

export default TaskRating

const styles = StyleSheet.create({
  container: {
    borderColor: 'grey',
    alignSelf: 'center',
    width: "90%",
    padding: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  textNoBold: {
    fontSize: 13
  },
  imgSlideStyle: {
    borderRadius: 50,
    height: 50,
    width: 50,
  },
  rateBtn: {
    backgroundColor: '#F8B11C',
    borderRadius: 20,
    padding: 4,
    margin: 2,
  },
  modalBtn: {
    color: '#52B69A',
  },
  text: {
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  customRatingBarStyle: {
    justifyContent: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    marginBottom: 20,
    marginTop: 10,
  },
  starImgStyle: {
    width: 25,
    height: 25,
    resizeMode: 'cover'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  input: {
    marginTop:10,
    borderColor: 'black',
    borderWidth: 1,
    color: 'black',
    width: "100%",
    maxWidth: "90%",
    textAlign: 'right',
    borderRadius: 10,
    padding: 10,
    textAlignVertical: 'top',
  },
  containerDialog: {
    padding: 10,
    alignItems: 'center',
  }
})
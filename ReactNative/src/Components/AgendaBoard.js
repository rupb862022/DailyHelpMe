import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image, Dimensions, Modal } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Calendar, LocaleConfig } from 'react-native-calendars';
import moment from 'moment'
import { Ionicons, FontAwesome5, Foundation } from '@expo/vector-icons';
import * as Linking from 'expo-linking';

const AgendaBoard = ({ taskList,navigation }) => {



  const openUrl = async (url) => {
    const isSupported = await Linking.canOpenURL(url);
    isSupported ? await Linking.openURL(url)
      : console.log("can't open url: " + url)
  }

  const monthNames = [
    'ינואר',
    'פברואר',
    'מרץ',
    'אפריל',
    'מאי',
    'יוני',
    'יולי',
    'אוגוסט',
    'ספטמבר',
    'אוקטובר',
    'נובמבר',
    'דצמבר'
  ];

  const dayNames = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];

  const screenWidth = Dimensions.get('screen').width;
  const screenHeigth = Dimensions.get('screen').height;

  LocaleConfig.locales['hb'] = {
    monthNames,
    monthNamesShort: ["פב", "ינו", 'מרץ', 'אפר', 'מאי', 'יוני', 'יולי', 'אוג', 'ספט', 'אוק', 'נוב', 'דצמ'],
    dayNames,
    dayNamesShort: ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'],
    today: "היום"
  };

  LocaleConfig.defaultLocale = 'hb';

  const [listPerDay, setListPerDay] = useState([]);
  const [listPerMonth, setListPerMonth] = useState([]);

  useEffect(() => {
    let temp = [];
    taskList.forEach(x => {
      moment(x.Date).format("M").toString() == (moment().month() + 1).toString() ? temp.push(x) : null
    })
    setListPerMonth(temp);
    setViewPerDay(false)
  }, [taskList])

  const [viewPerDay, setViewPerDay] = useState(false);
  const [modalShow, setModalShow] = useState(false);

  const signed = { color: '#52B69A', selectedDotColor: '#52B69A' }
  const wait = { color: '#F8B11C', selectedDotColor: '#F8B11C' }
  var dataList = {}
  var markedDates = {}

  taskList.forEach((data) => {
    dataList[moment(data.Date).format("DD-MM-YYYY")] = data.TaskList
    let dots = []
    data.TaskList.forEach(t => {
      t.SignStatus == "wait" ? dots.push(wait) : dots.push(signed)
    })
    markedDates[moment(data.Date).format("YYYY-MM-DD")] = { dots, marked: true }
  })

  return (
    <View style={{ height: screenHeigth*0.8 }}>
      <Calendar
        enableSwipeMonths
        renderHeader={(date) => {
          return (
            <View style={styles.header}>
              <TouchableOpacity onPress={() => setViewPerDay(false)}>
                <Text style={{ fontSize: 14 }}>
                  {monthNames[date.getMonth()]}
                </Text>
              </TouchableOpacity>
              <Text style={{ marginLeft: 7, fontSize: 12 }}>
                {date.getFullYear()}
              </Text>

            </View>
          )
        }}
        style={{
          borderColor: 'white',
          borderWidth: 7,
          padding: 5,
        }}
        theme={{
          textDayHeaderFontSize: 16,
          calendarBackground: '#EFEFEF',
          zIndex: 1,
          textSectionTitleColor: '#52B69A',
          textSectionTitleDisabledColor: 'red',
          dayTextColor: 'black',
          todayTextColor: '#52B69A',
          selectedDayTextColor: 'white',
          indicatorColor: '#434343',
          selectedDayBackgroundColor: '#52B69A',

          'stylesheet.calendar.main': {
            week: {
              marginBottom: 1,
              flexDirection: 'row',
              justifyContent: 'space-around'
            }
          },
          'stylesheet.day.basic': {
            base: {
              height: 30,

            },
          }
        }}
        minDate={new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toLocaleString()}
        maxDate={new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toLocaleString()}
        hideExtraDays={true}
        onDayPress={day => {
          setViewPerDay(true)
          let temp = []
          taskList.forEach(x => moment(x.Date).format("YYYY-MM-DD") == day.dateString ? temp.push(x) : null)
          setListPerDay(temp)
        }}
        onMonthChange={month => {
          let temp = [];
          taskList.forEach(x => {
            moment(x.Date).format("M") == month.month ? temp.push(x) : null
          })
          setListPerMonth(temp);
          setViewPerDay(false)
        }}
        renderArrow={direction => <Ionicons
          name={direction === 'left'
            ? 'arrow-forward'
            : 'arrow-back'
          }
          size={16}
        />}
        markingType={'multi-dot'}
        markedDates={markedDates}
      />
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', width: '70%', alignSelf: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="timer-outline" size={12} color="#F8B11C" />
          <Text style={{ fontSize: 12, marginLeft: 3 }}>
            ממתין לאישור
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <FontAwesome5 name="check-square" size={12} color="#52B69A" />
          <Text style={{ fontSize: 12, marginLeft: 3 }}> מאושר </Text>
        </View>
      </View>
      <View style={{ height: screenHeigth * 0.30 }}>
        <FlatList
          contentContainerStyle={{ width: screenWidth * 0.95, alignSelf: 'center', }}
          scrollEnabled={true}
          extraData={listPerMonth}
          data={viewPerDay ? listPerDay : listPerMonth}
          keyExtractor={(item, index) => item + index}
          renderItem={(item) => {
            return (
              <View>
                <FlatList
                  scrollEnabled={true}
                  data={item.item.TaskList}
                  ListHeaderComponent={
                    <View style={{ alignItems: 'flex-end', flexDirection: 'row', justifyContent: 'flex-start' }}>
                      <Text style={{ fontSize: 25 }}>  {new Date(item.item.Date).getDate()}</Text>
                      <Text style={{ fontSize: 15 }}>  {dayNames[moment(item.item.Date).isoWeekday()]}</Text>
                    </View>
                  }
                  keyExtractor={(item, index) => index}
                  renderItem={item => {
                    return (
                      <View style={{ marginTop: 7 }}>
                        <View style={{
                          padding: 5, width: '100%',
                          backgroundColor: item.item.SignStatus == "signed" ? "#C4DDD6" : "#EEE8DA"
                        }}>
                          <View style={{ alignItems: 'flex-start', justifyContent: 'center', }}>
                            <Text style={[styles.title, { color: item.item.SignStatus == "signed" ? "#52B69A" : "#F8B11C" }]}>
                              {item.item.TaskName}
                            </Text>

                          </View>
                          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                              <TouchableOpacity onPress={() => {
                                let mapRequest = `https://waze.com/ul?ll=${item.item.Lat},${item.item.Lng}&navigate=yes&zoom=17`;
                                openUrl(mapRequest)
                              }}>
                                <FontAwesome5 name="waze" size={16} />
                              </TouchableOpacity>

                              <Text style={{ paddingLeft: 5 }}>  {item.item.CityName}</Text>
                            </View>
                            <Text stlye={{ textAlign: 'center' }}>
                              {item.item.TaskHour.substring(0, 5)}
                            </Text>
                            <TouchableOpacity style={styles.btnContact} onPress={() => setModalShow(true)}>
                              <Text> פרטי איש קשר</Text>
                            </TouchableOpacity>
                            <Modal visible={modalShow} transparent>
                              <View style={styles.viewModal}>
                                <View style={styles.rowModal}>
                                  <View style={{ alignItems: 'center',width:"30%" }}>
                                    <Image source={{ uri: item.item.Photo }} style={styles.img} />
                                    <Text> {item.item.FirstName}</Text>
                                  </View>
                                  <View style={{ alignItems: 'center',width:"70%" }}>

                                    <Text style={{ paddingRight: 5, fontSize: 14, fontWeight: 'bold', marginBottom: 5 }}>  יצירת קשר  </Text>
                                    <TouchableOpacity style={{ marginLeft: 10, paddingLeft: 10, flexDirection: 'row',marginTop:5 }} onPress={() => openUrl(`tel:${item.item.MobilePhone}`)}>
                                    <Foundation name="telephone" size={20} />
                                      <Text style={styles.textModal}>  
                                        {item.item.MobilePhone}
                                      </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      onPress={() =>{
                                        setModalShow(false)
                                         navigation.navigate('ChatS', { screen: 'ChatMesseges', initial: false, params: { otherUserEmail: item.item.Email, otherUserPhoto: item.item.Photo, otherUserName: item.item.FirstName+" "+item.item.LastName } })}
                                      }
                                      style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center',marginTop:5 }}>
                                  
                                      <Ionicons name='chatbubbles-outline' size={24}  />
                                      <Text style={styles.textModal}> בצ'אט </Text>
                                    </TouchableOpacity>
                                  </View>

                                </View>
                                <TouchableOpacity style={styles.btnModal} onPress={() => setModalShow(false)}>
                                  <Text style={styles.text}> סגור </Text>
                                </TouchableOpacity>

                              </View>
                            </Modal>
                          </View>
                        </View>
                        <View style={{ backgroundColor: item.item.SignStatus == "signed" ? "#52B69A" : "#F8B11C", height: 5, width: "100%" }} />
                      </View>
                    )
                  }} />

              </View>
            )

          }}
        />
      </View>
    </View>

  )
}

export default AgendaBoard

const styles = StyleSheet.create({
  title: {
    fontWeight: 'bold',
    fontSize: 15
  },
  textModal:{
    marginLeft:5,
  },
  header:
  {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginBottom: 1,
    backgroundColor: '#52B69A',
    padding: 5,
    paddingRight: 20,
    paddingLeft: 20,
    fontSize: 20,
    color: 'white',
    borderRadius: 5,
  },
  btnContact: {
    padding: 3,
    borderWidth: 0.2,
    borderRadius: 5,
  },
  viewModal: {
    backgroundColor: 'white',
    position: 'absolute',
    alignSelf: 'center',
    top: "30%",
    width: "75%",
    padding: 8,
    borderRadius: 10,
    borderColor: "#52B69A",
    borderWidth: 5,
  
  },
  rowModal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width:"100%"
  },
  img: {
    width: 60,
    height: 60,
    borderRadius: 30
  },
  btnModal: {
    marginTop: 20,
    width: "30%",
    backgroundColor: "#52B69A",
    color: "black",
    alignSelf: 'center',
    padding: 3,
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
    textAlign: 'center',
    fontSize: 14,
    color: 'white',
  }
})
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';

const CalendarBoard = ({ setDate, setOpen, dates, cantCancelDates }) => {
  
  const [dateList, setDateList] = useState([]);

  const [cantCancel, setCantCancel] = useState([]);


  useEffect(() =>{

    if(dates != null){
    let temp = [];
    dates.forEach(x => temp.push(moment(x).format("YYYY-MM-DD")))
  
    setDateList(temp);

    let tempy = [];
    cantCancelDates.forEach(x => {
      if (x.Status == "signed") {
        tempy.push(moment(x.TaskDate).format("YYYY-MM-DD"))
      }
    })
    setCantCancel(tempy);

    console.log("cantCancelDates",tempy)
  }

  },[])



  LocaleConfig.locales['hb'] = {
    monthNames: [
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
    ],
    monthNamesShort: ["פב", "ינו", 'מרץ', 'אפר', 'מאי', 'יוני', 'יולי', 'אוג', 'ספט', 'אוק', 'נוב', 'דצמ'],
    dayNames: ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'],
    dayNamesShort: ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'],
    today: "היום"
  };
  LocaleConfig.defaultLocale = 'hb';

  const addDateToList = (date) => {
    if(cantCancel.some(x=> x==date)){
      return;
    }
    if (dateList != []) {
      let temp = dateList.filter(t => t != date)
      temp.length == dateList.length ? setDateList([...dateList, date])
        : setDateList(temp)
    }
    else {
      setDateList([date])
    }
  }

  let mark = {}
  dateList.forEach((date) => {
    if(cantCancel.some(x=> x==date)){
      mark[date] = { selected: true, selectedColor: 'grey' };

    }
    else if(moment(date).isBefore(moment())){
      mark[date] = { selected: true, selectedColor: 'grey' };

    }
    else{
      mark[date] = { selected: true, };

    }
  });

  return (
    <View >
      <Text style={styles.title}> אנא בחרו תאריכים למשימה </Text>
      <Calendar
        enableSwipeMonths
        style={{
          borderColor: 'white',
          borderWidth: 5,  
          width: "100%"
        }}
        theme={{
          textDayHeaderFontSize: 16,
          calendarBackground: '#EFEFEF',
          textSectionTitleColor: '#52B69A',
          textSectionTitleDisabledColor: 'red',
          dayTextColor: 'black',
          todayTextColor: '#52B69A',
          selectedDayTextColor: 'white',
          monthTextColor: '#52B69A',
          indicatorColor: '#434343',
          selectedDayBackgroundColor: '#52B69A',
          arrowColor: '#52B69A',        
        }}
        minDate={new Date().toLocaleString()}
        maxDate={(new Date().getFullYear() + 1).toString()}
        hideExtraDays={true}
        onDayPress={day => {
          addDateToList(day.dateString)
        }}
        renderArrow={direction => <Ionicons
          name={direction === 'left'
            ? 'arrow-forward'
            : 'arrow-back'
          }
        />}
        markedDates={mark}
      />
      <View style={{ flexDirection: 'row', justifyContent: 'space-around',marginBottom: 10}}>
        <TouchableOpacity  onPress={() => setOpen(false)}>
          <Text style={{ color: '#52B69A',fontWeight:'bold' }}>  חזור  </Text>
        </TouchableOpacity>
        <TouchableOpacity  onPress={() => {
          setOpen(false)
          setDate(dateList)
        }}
        >
          <Text style={{ color: '#52B69A',fontWeight:'bold' }} >  בחר  </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default CalendarBoard

const styles = StyleSheet.create({

  title: {
    backgroundColor: 'white',
    padding: 5,
    fontWeight: 'bold',
    paddingTop: 7
  }
})
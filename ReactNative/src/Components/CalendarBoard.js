import { StyleSheet, View, Text } from 'react-native'
import React from 'react'
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import { DATE_TYPE } from 'react-native-common-date-picker';
import moment from 'moment';

const CalendarBoard = ({ setDate, setOpen, minDate, maxDate, startOrEnd }) => {

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

  return (
    <View >
      {startOrEnd == "start" ? <Text style={styles.title}>אנא בחר תאריך התחלה </Text> : <Text style={styles.title}>  אנא בחר תאריך סיום </Text>}
      <Calendar
        enableSwipeMonths
        style={{
          borderColor: 'white',
          borderWidth: 10,
          padding: 10,
        }}
        theme={{
          textDayHeaderFontSize: 16,
          calendarBackground: '#EFEFEF',
          zIndex: 1,
          textSectionTitleColor: '#52B69A',
          textSectionTitleDisabledColor: 'red',
          dayTextColor: 'black',
          todayTextColor: '#52B69A',
          selectedDayTextColor: '#F8B11C',
          monthTextColor: '#52B69A',
          indicatorColor: '#434343',
          selectedDayBackgroundColor: '#52B69A',
          arrowColor: '#52B69A',
          'stylesheet.calendar.main': {
            week: {
              marginTop: 1,
              marginBottom: 1,
              flexDirection: 'row',
              justifyContent: 'space-around'
            }
          },
          'stylesheet.calendar.header': {
            header: {
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingLeft: 10,
              paddingRight: 10,
              alignItems: 'center',
              height: 40
            },
            week: {
              marginTop: 6,
              flexDirection: 'row',
              justifyContent: 'space-around',
            }
          },
          'stylesheet.day.basic': {
            base: {
              height: 28,
            },
          }
        }}
        maxDate={maxDate}
        minDate={minDate}
        hideExtraDays={true}
        onDayPress={day => {
          setDate(day.dateString)
          setOpen(false)  
        }}
        renderArrow={direction => <Ionicons
          name={direction === 'left'
            ? 'arrow-forward'
            : 'arrow-back'
          }
        />}

      />
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
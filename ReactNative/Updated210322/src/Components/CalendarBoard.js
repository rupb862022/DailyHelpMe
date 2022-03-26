import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { Calendar, CalendarProps } from 'react-native-calendars';
import { LocaleConfig } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';



const CalendarBoard = ({ setDate }) => {

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
    <View style={styles.container}>
      <Calendar
    
        enableSwipeMonths
        style={{
          borderColor: 'white',
          borderWidth: 10,
          borderRadius: 20,
          padding: 10,
        }}
        theme={{
          textDayHeaderFontSize: 16,
          calendarBackground: '#EFEFEF',
          zIndex:1,
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
              marginTop: 7,
              marginBottom: 7,
              flexDirection: 'row-reverse',
              justifyContent: 'space-around'
            }
          },
          'stylesheet.calendar.header': {
            header: {
              flexDirection: 'row-reverse',
              justifyContent: 'space-between',
              paddingLeft: 10,
              paddingRight: 10,
              alignItems: 'center',
              height: 40
            },
            week: {
              marginTop: 6,
              flexDirection: 'row-reverse',
              justifyContent: 'space-around',
            }
          },
          'stylesheet.day.basic': {
            base: {
              height: 26,
            }, 
          }
        }}
        hideExtraDays={true}
        onDayPress={day => {
          setDate(day.dateString)
        }}
        renderArrow={direction => <Ionicons
          name={direction === 'left'
            ? 'arrow-forward'
            : 'arrow-back'
          }
        />}

      // minDate={'1930-03-01'}
      // maxDate={'2004-03-01'}
      // current={'2004-03-21'}
      />
    </View>
  )
}

export default CalendarBoard

const styles = StyleSheet.create({
  container: {
   
  }
})
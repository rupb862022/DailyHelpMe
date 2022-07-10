import { StyleSheet, View } from 'react-native'
import React,{useState,useEffect,useContext} from 'react'
import AgendaBoard from '../Components/AgendaBoard'
import {getTasksForCalendar} from '../FetchCalls/calendarAPI'
import { userContext } from '../General/userContext';

const Calendars = ({navigation}) => {

    const { user } = useContext(userContext);
    const [tasks,setTasks]=useState([]);

    useEffect(() => {
      const whenFocus = navigation.addListener('focus', () => {
    
        getTasksForCalendar(user.ID).then(
          (result) => {    
            if(result!= "empty")
            {
              setTasks(result)
              return;
            }
            console.log("calendar tasks didnt come : ",result)
          },
          (error) => {
            console.log("calendar tasks ERROR: ",error);
          });
      })
      return whenFocus;
  
    }, [navigation])

  return (
    <View>
      <AgendaBoard taskList={tasks} navigation={navigation}/>
    </View>
  )
}

export default Calendars

const styles = StyleSheet.create({})
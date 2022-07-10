import {serverFetchAPI} from './apiUtils';

export const getTasksForCalendar=(json)=>{
  return serverFetchAPI('getTasksForCalendar','POST',JSON.stringify(json));
}

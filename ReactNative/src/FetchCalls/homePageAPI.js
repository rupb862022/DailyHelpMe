import {serverFetchAPI} from './apiUtils';

export const getRequests=(id)=>{
  return serverFetchAPI('getRequests/','POST',JSON.stringify(id));
}

export const getRequestsSorted=(json)=>{
  return serverFetchAPI("getRequestsSorted/",'POST',JSON.stringify(json));
}

export const signToTaskConfirm=(json)=>{
  return serverFetchAPI('signToTaskConfirm/','POST',JSON.stringify(json));
}

export const signToTask=(json)=>{
  return serverFetchAPI('signToTask/','POST',JSON.stringify(json));
}

export const cancelTask=(json)=>{
  return serverFetchAPI('sendpushnotification/','POST',JSON.stringify(json));
}

export const getTypesName=()=>{
  return serverFetchAPI('api/Types/','GET');
}

export const getTypes=()=>{
  return serverFetchAPI('getTypes/','GET');
}



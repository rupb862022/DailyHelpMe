import {serverFetchAPI} from './apiUtils';

export const getRequests=(json)=>{
  return serverFetchAPI('getRequests/','POST',JSON.stringify(json));
}

export const signToTaskConfirm=(json)=>{
  return serverFetchAPI('signToTaskConfirm/','POST',JSON.stringify(json));
}

export const signToTask=(json)=>{
  return serverFetchAPI('signToTask/','POST',JSON.stringify(json));
}

export const getTasks=(json)=>{
  return serverFetchAPI('getTasks/','POST',JSON.stringify(json));
}

export const cancelTask=(json)=>{
  return serverFetchAPI('cancelTask/','DELETE',JSON.stringify(json));
}

export const getTypesName=()=>{
  return serverFetchAPI('api/Types/','GET');
}

export const getTypes=()=>{
  return serverFetchAPI('getTypes/','GET');
}



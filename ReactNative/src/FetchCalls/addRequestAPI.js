import {serverFetchAPI} from './apiUtils';

export const addRequest=(json)=>{
  return serverFetchAPI('addRequest','POST',JSON.stringify(json));
}

export const getTypes=()=>{
  return serverFetchAPI('api/Types/','GET');
}

export const addCity=(city)=>{
  return serverFetchAPI('addCity','POST',JSON.stringify(city));
}

export const addType=(type)=>{
  return serverFetchAPI('addType','POST',JSON.stringify(type));
}


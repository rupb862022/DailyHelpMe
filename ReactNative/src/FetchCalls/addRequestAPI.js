import {serverFetchAPI} from './apiUtils';

export const addRequest=(json)=>{
  console.log("request after stringify: ",JSON.stringify(json))
  return serverFetchAPI('addRequest','POST',JSON.stringify(json));
}

export const getTypes=()=>{
  return serverFetchAPI('api/Types/','GET');
}

export const addCity=(json)=>{
  return serverFetchAPI('addCity','POST',JSON.stringify(json));
}



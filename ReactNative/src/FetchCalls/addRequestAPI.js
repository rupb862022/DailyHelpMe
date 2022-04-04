import {serverFetchAPI} from './apiUtils';

export const addRequest=(json)=>{
  return serverFetchAPI('addRequest','POST',JSON.stringify(json));
}

export const getTypes=()=>{
  return serverFetchAPI('api/Types/','GET');
}

export const AddCity=(json)=>{
  return serverFetchAPI('AddCity','POST',JSON.stringify(json));
}



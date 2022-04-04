import {serverFetchAPI} from './apiUtils';

export const checkIfEmailUsed=(email)=>{
  return serverFetchAPI('checkIfEmailUsed/','POST',JSON.stringify(email));
}

export const checkIfPhoneUsed=(phone)=>{
  return serverFetchAPI('checkIfPhoneUsed/','POST',JSON.stringify(phone));
}

export const checkIfIDValidOrUsed=(id)=>{
  return serverFetchAPI('checkIfIDValidOrUsed/','POST',JSON.stringify(id));
}

export const getTypes=()=>{
  return serverFetchAPI('api/Types/','GET');
}

export const addUser=(user)=>{
  return serverFetchAPI('addUser/','POST',JSON.stringify(user));
}


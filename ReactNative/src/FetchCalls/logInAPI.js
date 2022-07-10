import {serverFetchAPI} from './apiUtils';

export const searchUser=(token)=>{
  return serverFetchAPI('searchUser/','POST',JSON.stringify(token));
}

export const logIn=(json)=>{
  return serverFetchAPI('logIn/','POST',JSON.stringify(json));
}

export const sendMail=(id)=>{
  return serverFetchAPI('sendMail/','POST',JSON.stringify(id));
}

export const setNewPassword=(json)=>{
  return serverFetchAPI('setNewPassword/','POST',JSON.stringify(json));
}


export const addUser=(user)=>{
  console.log("API addUser= ",JSON.stringify(user))
  return serverFetchAPI('addUser/','POST',JSON.stringify(user));
}

export const getUser=(user)=>{
  return serverFetchAPI('getUser/','POST',JSON.stringify(user));
}
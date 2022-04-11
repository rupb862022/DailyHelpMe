import {serverFetchAPI} from './apiUtils';

export const searchUser=(token)=>{
  return serverFetchAPI('searchUser/','POST',JSON.stringify(token));
}

export const logIn=(json)=>{
  return serverFetchAPI('logIn/','POST',JSON.stringify(json));
}


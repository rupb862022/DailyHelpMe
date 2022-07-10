import {serverFetchAPI} from './apiUtils';

export const myRequests=(json)=>{
  console.log(JSON.stringify(json))
  return serverFetchAPI('myRequests/','POST',JSON.stringify(json));
}

export const pastRequest=(json)=>{
  console.log(JSON.stringify(json))
  return serverFetchAPI('pastRequest/','POST',JSON.stringify(json));
}

export const getVol=(id)=>{
  return serverFetchAPI('getVol','POST',JSON.stringify(id));
}

export const acceptVol=(json)=>{
  return serverFetchAPI('acceptVol','POST',JSON.stringify(json));
}

export const denyVol=(json)=>{
  return serverFetchAPI('denyVol','DELETE',JSON.stringify(json));
}

export const changeUserInfo=(json)=>{
  return serverFetchAPI('changeUserInfo','POST',JSON.stringify(json));
}

export const checkIfPhoneUsed=(phone)=>{
  return serverFetchAPI('checkIfPhoneUsed/','POST',JSON.stringify(phone));
}

export const getRecommendation=(id)=>{
  return serverFetchAPI('getRecommendation/','POST',JSON.stringify(id));
}

export const getUser=(id)=>{
  return serverFetchAPI('getUser/','POST',JSON.stringify(id));
}

export const getDoneTasks=(id)=>{
  return serverFetchAPI('getDoneTasks/','POST',JSON.stringify(id));
}

export const rateUser=(json)=>{
  return serverFetchAPI('rateUser/','POST',JSON.stringify(json));
}

export const taskDoneByMe=(id)=>{
  return serverFetchAPI('taskDoneByMe/','POST',JSON.stringify(id));
}

export const deleteRequest=(code)=>{
  return serverFetchAPI('deleteRequest/','DELETE',JSON.stringify(code));
}


export const blockORActiveUser=(id)=>{
  return serverFetchAPI('blockORActiveUser/','POST',JSON.stringify(id));
}
export const managerData=(id)=>{
  return serverFetchAPI('managerData/','POST',JSON.stringify(id));
}
export const acceptType=(id)=>{
  return serverFetchAPI('acceptType/','POST',JSON.stringify(id));
}

export const getTheTop3=()=>{
  return serverFetchAPI('getTheTop3/','POST',JSON.stringify());
}








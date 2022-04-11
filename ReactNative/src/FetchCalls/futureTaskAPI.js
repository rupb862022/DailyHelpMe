import {serverFetchAPI} from './apiUtils';

export const futureTaskToDo=(json)=>{
  return serverFetchAPI('futureTaskToDo','POST',JSON.stringify(json));
}

export const cancelTask=(json)=>{
    return serverFetchAPI('cancelTask/','DELETE',JSON.stringify(json));
  }

  export const changeTaskStatus=(json)=>{
    return serverFetchAPI('changeTaskStatus/','POST',JSON.stringify(json));
  }


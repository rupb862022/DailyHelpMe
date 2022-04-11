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



export const uploadPic=(picture,picName)=>{
  let urlAPI = 'https://proj.ruppin.ac.il/bgroup86/prod/uploadpicture';
 
  console.log("picName: ",picName);

  console.log("picture: ",picture);
  fetch(urlAPI, {
    method: 'POST',
    body: picture,
  })
  .then((res) => {
    if (res.status == 201) { return res.json(); }
    else { return "errrrrr"; }
  })
  .then((responseData) => {
    if (responseData != "err") {
      let picNameWOExt = picName.substring(0, picName.indexOf("."));
      let imageNameWithGUID = responseData.substring(responseData.indexOf(picNameWOExt),
        responseData.indexOf(".jpg") + 4);
      console.log(imageNameWithGUID);
      console.log("img uploaded successfully!");
     return imageNameWithGUID;
    }
    else { return "NO" }
  })
  .catch(err => { return "NO"  });
   
}


import { initializeApp } from 'firebase/app';

import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  FacebookAuthProvider,
  signInWithCredential,
  signInWithEmailAndPassword
} from 'firebase/auth';

import { doc, collection, addDoc, getFirestore, setDoc, getDoc, getDocs, updateDoc, arrayUnion } from "firebase/firestore";
import moment from 'moment';

import { GoogleSignin } from '@react-native-google-signin/google-signin';

// // //const auth = getAuth();
const firebaseConfig = {
  apiKey: "AIzaSyBMSBcg1otPMlZ2-7Mxmglyx6JtfQ9iJU8",
  authDomain: "dailyhelpme-712a7.firebaseapp.com",
  projectId: "dailyhelpme-712a7",
  storageBucket: "dailyhelpme-712a7.appspot.com",
  messagingSenderId: "819174498478",
  appId: "1:819174498478:web:2a88b2058d829639928d3f",
  measurementId: "G-X95T2FFEVG"
  //databaseURL:"dailyhelpme-3f8dc-default-rtdb.europe-west1.firebasedatabase.app/"
};



export const signUpToFirestore =  async (email, password) => {

  console.log("hi!")
  const auth = getAuth();

  GoogleSignin.configure(firebaseConfig);
  // Get the users ID token
  const { idToken } = await GoogleSignin.signIn();

  // Create a Google credential with the token
  const googleCredential = auth.GoogleAuthProvider.credential(idToken);

  // Sign-in the user with the credential
  return auth().signInWithCredential(googleCredential);

  // createUserWithEmailAndPassword(auth, email, password)
  //   .then((userCredential) => {
  //     Signed in 
  //     const user = userCredential.user;
  //     console.log("user=", user)
  //     ...
  //   })
  //   .catch((error) => {
  //     console.log("error=", error)
  //     const errorCode = error.code;
  //     const errorMessage = error.message;
  //     ..
  //   });
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


export const sendMessege = async (currentUser, otherUser, _id, CreatedAt, text, user) => {
  try {
    let createdAt = moment(CreatedAt).format();

    let forOtherUser = {
      id: currentUser.Email,
      userName: currentUser.FirstName + " " + currentUser.LastName,
      userImg: currentUser.Photo,
      messageTime:createdAt,
      messageText: text,
      messages:
      {
        _id: _id,
        createdAt: createdAt,
        text: text,
        user: {
          _id: user._id == 1 ? 2 : 1,
          avatar: currentUser.Photo,
          name: currentUser.FirstName + " " + currentUser.LastName
        }
      }
    }

    let forCurrentUser = {
      id: otherUser.otherUserEmail,
      userName: otherUser.otherUserName,
      userImg: otherUser.otherUserPhoto,
      messageTime:createdAt,
      messageText: text,
      messages:
      {
        _id: _id,
        createdAt:createdAt,
        text: text,
        user: {
          _id: user._id,
          avatar: user.avatar,
          name: user.name
        }
      }
    }

    //for current user!
    const docRef = doc(db, "chats", currentUser.Email, "OtherUsers", otherUser.otherUserEmail);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      await updateDoc(docRef, {
        "userName": forCurrentUser.userName,
        "userImg": forCurrentUser.userImg,
        "messageTime": forCurrentUser.messageTime,
        "messageText": text,
        "messages": arrayUnion(forCurrentUser.messages)
      });
    } else {
      await setDoc(doc(db, "chats", currentUser.Email, "OtherUsers", forCurrentUser.id), forCurrentUser);
    }


    //for other user!
    const docRefOther = doc(db, "chats", otherUser.otherUserEmail, "OtherUsers", currentUser.Email);
    const docSnapOther  = await getDoc(docRefOther);

    if (docSnapOther.exists()) {
      await updateDoc(docRefOther, {
        "userName": forOtherUser.userName,
        "userImg": forOtherUser.userImg,
        "messageTime": forOtherUser.messageTime,
        "messageText": text,
        "messages": arrayUnion(forOtherUser.messages)
      });
    } else {
      await setDoc(docRefOther, forOtherUser);
    }

  }
  catch (error) {

  }
}


class otherUser {
  constructor(userName, userImg, messageTime, messageText, messages) {
    this.userName = userName;
    this.userImg = userImg;
    this.messageTime = messageTime;
    this.messageText = messageText;
    this.messages = messages;
  }
}


const otherUserConverter = {
  toFirestore: (otherUser) => {
    var messeages = [];
    otherUser.messages.forEach(x => {
      messeages.push({
        _id: x._id,
        createdAt: x.createdAt,
        text: x.text,
        userImg: x.userImg,
        userName: x.userName,
        user: {
          _id: x.user._id,
          avatar: x.user.avatar,
          name: x.user.name
        }
      })
    })

    return {
      userName: otherUser.userName,
      userImg: otherUser.userImg,
      messageTime: otherUser.messageTime,
      messageText: otherUser.messageText,
      messages: messeages
    };
  },
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    return new otherUser(data.userName, data.userImg, data.messageTime, data.messageText, data.messages);
  }
};


export const getChat = async (userEmail, otherUser) => {

  let messageList = [];
  if (otherUser == null) {
    const querySnapshot = await getDocs(collection(db, "chats", userEmail, "OtherUsers"));
    querySnapshot.forEach((doc) => {
      messageList.push(doc.data())
    });
    return messageList.reverse();
  }
  else {
 
    const querySnapshot = await getDoc(doc(db, "chats", userEmail.Email, "OtherUsers", otherUser));
    let messegesOnly = querySnapshot.data()
    if(messegesOnly==undefined || messegesOnly.messages.length ==0){
      return [];
    }
 
    if(!Array.isArray(messegesOnly.messages)){
      let yo = [];
      yo.push(messegesOnly.messages)
      return yo;
    }
  
    return  messegesOnly.messages.reverse()
  }

}






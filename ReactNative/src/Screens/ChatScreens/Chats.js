import React, { useState, useEffect, useContext } from 'react'
import { View,  StyleSheet, FlatList ,Dimensions} from 'react-native';
import {
  Container,
  Card,
  UserInfo,
  UserImgWrapper,
  UserImg,
  UserInfoText,
  UserName,
  PostTime,
  MessageText,
  TextSection,
} from '../../ComponentStyle/MessegeStyles';
import {getChat} from '../../General/firebase';
import {userContext} from '../../General/userContext'
import moment from 'moment';

const Chats = ({ navigation }) => {

  const { user } = useContext(userContext);
  const [Messages,setMessageList]=useState([]);

  const getChatMessages= async ()=>{
    let messageList =  await getChat(user.Email,null)
    setMessageList(messageList)
  }

  useEffect(() => {
    const whenFocus = navigation.addListener('focus', () => {
      getChatMessages();
 
    })
    return whenFocus;

  }, [navigation])


  const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

  return (
    <View style={{width: screenWidth, height: screenHeight*0.9}}> 
    <Container>
      <FlatList
        data={Messages}
        contentContainerStyle={{width: '100%', height: '90%'}}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={{width:screenWidth*0.9}}>
          <Card onPress={() => navigation.navigate('ChatMesseges', { otherUserName: item.userName,otherUserEmail:item.id,otherUserPhoto:item.userImg })}>
            <UserInfo>
              <UserImgWrapper>
                <UserImg source={{uri: item.userImg}} />
              </UserImgWrapper>
              <TextSection>
                <UserInfoText>
                  <UserName>{item.userName}</UserName>
                  <PostTime>{moment(item.messageTime).locale('he').fromNow()}</PostTime>
                </UserInfoText>
                <MessageText>{item.messageText}</MessageText>
              </TextSection>
            </UserInfo>
          </Card>
          </View>
        )}
      />
    </Container>
    </View>
  );
};

export default Chats;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
});
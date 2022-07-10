import React, { useState, useContext, useEffect, useCallback, useLayoutEffect } from 'react';
import { View, Text, StyleSheet} from 'react-native';
import { Bubble, GiftedChat, Send } from 'react-native-gifted-chat';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { sendMessege, getChat } from '../../General/firebase';
import { userContext } from '../../General/userContext';
import 'dayjs/locale/fr'
import moment from 'moment';


const ChatMesseges = ({ route, navigation }) => {

  const { user } = useContext(userContext)
  const currentUser = user;

  const { otherUserEmail, otherUserPhoto, otherUserName } = route.params;

  const otherUser = {
    otherUserEmail,
    otherUserPhoto,
    otherUserName
  }

  useEffect(() => {
    const whenFocus = navigation.addListener('focus', () => {
      getChatMesseges();
      return () => {
        getChatMesseges.abort()
      }
    });
    return whenFocus;
  }, [navigation])

  useLayoutEffect(() => {
    navigation.setOptions({
      title: otherUser.otherUserName,
    })
  }, [navigation]);

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
        getChatMesseges();
    }, 500)
    return () => clearTimeout(timer);
  }, [messages])

  const getChatMesseges = async () => {
    let yo = await getChat(user, otherUserEmail)
    setMessages(yo)
  }

  const onSend = useCallback((messages = []) => {
 
    if (messages[0]._id == 2) {
      messages[0].user.avatar = otherUserPhoto;
      messages[0].user.name = otherUserName;
    }
    else {
      messages[0].user.avatar = currentUser.Photo;
      messages[0].user.name = currentUser.FirstName + " " + currentUser.LastName;
    }

    setMessages((previousMessages) =>
      GiftedChat.prepend(previousMessages, messages),
    )

    const {
      _id,
      createdAt,
      text,
      user,
    } = messages[0]

    sendMessege(currentUser, otherUser, _id, createdAt, text, user)
  }, []);

  const renderSend = (props) => {
    return (
      <Send {...props} >
      
        <View>
          <MaterialCommunityIcons
            name="send-circle"
            size={40}
            color="#F8B11C"
          />
        </View>
      </Send>
    );
  };

  const renderBubble = (props) => {
    return ( 
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#52B69A',
          },
          left:{
            backgroundColor: 'white'
          }
        }}
        textStyle={{
          right: {
            color: 'white',
          },
          left:{
            color:'#52B69A'
          }
        }}     
      />
    );
  };

  const scrollToBottomComponent = () => {
    return (
      <FontAwesome name='angle-double-down' size={22} color='#333' />
    );
  }

  return (
    <View style={{flex:1,height:"100%" }}>
      <GiftedChat
        timeFormat='HH:mm'
        inverted={true}
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: 1,
        }}
        renderBubble={renderBubble}
        alwaysShowSend
        renderSend={renderSend}
        scrollToBottom
        scrollToBottomComponent={scrollToBottomComponent}
        placeholder = "הכנס טקסט"
        renderTime={(time) => (
          <View style={time.containerStyle}>
            <Text size={10} style={{marginHorizontal: 10, marginBottom: 5}} bold color={time.position === "left" ? 'gray' : 'white'}>
              {`${moment(time.currentMessage.createdAt).format("HH:mm")}`}
            </Text>
          </View>
        )}
      />
      
    </View>
  );
};

export default ChatMesseges;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
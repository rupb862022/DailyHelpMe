import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions } from 'react-native'
import React, { useContext, useLayoutEffect, useState, useEffect } from 'react'
import { userContext } from '../../General/userContext';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import Carousel from 'react-native-snap-carousel';
import { getRecommendation } from '../../FetchCalls/profileAPI';
import moment from 'moment';
import CrownImg from '../../Components/CrownImg';
import he from 'moment/locale/he';

const ProfileOfUser = ({ navigation, route }) => {

  const { user, setUser } = useContext(userContext);

  const { ID, FirstName, LastName } = route.params;

  const [chosenUser, setChosenUser] = useState([]);

  useEffect(() => {
    getFromDb();
  }, [])

  useLayoutEffect(() => {
    navigation.setOptions({
      title: ID != 0 ? FirstName + " " + LastName : null,
    });
  }, [navigation, user]);


  const getFromDb=()=>{
   
    getRecommendation(ID).then(
      (result) => {
        result.Recommendations.forEach(reco => {
          reco.RatingTime = moment(reco.RatingTime).locale('he').startOf('day').fromNow();
        })
        setRecommendationsList(result.Recommendations);

        let today = new Date();
        let birthDate = new Date(result.DateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear(); 
        let m = today.getMonth() - birthDate.getMonth(); 
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }

        setChosenUser({
          FirstName: result.FirstName,
          LastName: result.LastName,
          Gender: result.Gender,
          DateOfBirth: result.DateOfBirth,
          UserDescription: result.UserDescription,
          Rank: result.Rank,
          TotalRate: result.TotalRate,
          Photo: result.Photo,
          userAge: age,
          Email: result.Email,
          FullName: FirstName + " " + LastName
        })
      },
      (error) => {
        console.log("getting user in profile didnt successed: ", error);
      });
  }


  const screenWidth = Dimensions.get('screen').width;
  const screenHeight = Dimensions.get('screen').height;

  const [maxRating, setMxRating] = useState([1, 2, 3, 4, 5]);
  const starImgFilled = 'https://raw.githubusercontent.com/tranhonghan/images/main/star_filled.png';
  const startImgCorner = 'https://raw.githubusercontent.com/tranhonghan/images/main/star_corner.png';

  const [recommendationsList, setRecommendationsList] = useState([]);

  const renderItem = ({ item, index }) => {
    return (
      <View style={styles.slide}>
        <View style={{ width: "27%" }} >
          <Image style={styles.imgSlideStyle} source={{ uri: item.RaterPhoto }} />
        </View>
        <View style={{ width: "73%" }} >
          <Text style={styles.titleSlide}> {item.RaterFirstName} </Text>
          <Text style={styles.slideText}> {item.Recommendation} </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <CustomRatingBar totalRate={item.Rating} rateStyle="Recommendation" />
            <Text style={styles.slideText}> {item.RatingTime} </Text>
          </View>
        </View>
      </View>
    );
  }

  const CustomRatingBar = ({ totalRate, rateStyle }) => {

    return (
      <View style={styles.customRatingBarStyle}>
        {
          maxRating.map((item, key) => {
            return (
              <Image
                key={key}
                style={rateStyle == "user" ? styles.starImgStyle : styles.starImgStyleSlide}
                source={
                  item <= totalRate ? { uri: starImgFilled } : { uri: startImgCorner }
                } />
            )
          })
        }
      </View>
    )
  }


  return (
    <View style={{ width: screenWidth }}>
      {chosenUser.length == 0 ? null :
        <View>
          <View style={{ marginTop: 15, height: "18%", flexDirection: 'row', justifyContent: 'center', width: '100%', marginBottom: 5 }}>
            {ID != user.ID ? null
              : <TouchableOpacity style={{ position: 'absolute', left: "30%", bottom: "10%" }} onPress={() => {
                   navigation.navigate("EditProfile");
              }}>
                <MaterialCommunityIcons name="square-edit-outline" size={22} color="#F8B11C" />
              </TouchableOpacity>
            }
            <CrownImg rank={chosenUser.Rank} profile={true} />
            <Image style={[styles.imgStyle]} source={{ uri: chosenUser.Photo }} />
          </View>
          <Text style={styles.title}> קצת עליי </Text>

          <View style={[styles.descriptionStyle, { width: screenWidth * 0.6 }]}>

            {user.HowSigned == "Signed" && <Text>{chosenUser.Gender == "F" ? <Text>בת </Text> : <Text>בן </Text>}{chosenUser.userAge}</Text>}

            <Text >{chosenUser.UserDescription == null ? "..." : chosenUser.UserDescription}</Text>
          </View>
        
          <TouchableOpacity
            disabled={ID == user.ID}
            onPress={() => navigation.navigate('ChatS', { screen: 'ChatMesseges', initial: false, params: { otherUserEmail: chosenUser.Email, otherUserPhoto: chosenUser.Photo, otherUserName: chosenUser.FullName } })}
            style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={styles.slideText}> דברו איתי </Text>
            <Ionicons name='chatbubbles-outline' size={24} color="grey" style={{ alignSelf: 'center', }} />
          </TouchableOpacity>
          <Text style={styles.title}> דירוג כללי </Text>
          <CustomRatingBar totalRate={chosenUser.TotalRate} rateStyle="user" />
          <Text style={styles.title}>{recommendationsList.length > 0 ? "מה אחרים חושבים עליי" : null}</Text>

          <View style={{ alignItems: 'center', height: '25%', marginTop: 10 }}>
            <Carousel
              data={recommendationsList}
              renderItem={renderItem}
              sliderWidth={screenWidth * 0.9}
              itemWidth={screenWidth * 0.8}
            />
          </View>
        </View>
      }
    </View>
  )

}

export default ProfileOfUser

const styles = StyleSheet.create({
  imgStyle: {
    borderRadius: 50,
    height: 80,
    width: 80,
    alignSelf: 'center',
    marginTop: 10
  },
  imgSlideStyle: {
    borderRadius: 50,
    height: 50,
    width: 50,
    //alignSelf: 'center',
  },
  btnStyle: {
    //marginRight: 50,


  },
  descriptionStyle: {
    alignSelf: 'center',
    borderRadius: 10,
    padding: 8,
    borderTopEndRadius: 0,
    marginTop: 5,
    backgroundColor: '#B6E0D4',
    alignItems: 'center',
    
  },
  title: {
    fontSize: 18,
    alignSelf: 'center',
    marginTop: 15
  },
  customRatingBarStyle: {
    flexDirection: 'row',
    height: 25,
    alignSelf: 'center',
    marginTop: 5
  },
  starImgStyle: {
    width: 23,
    height: 23,
  },
  starImgStyleSlide: {
    width: 15,
    height: 15,
    alignSelf: 'flex-start'
  },
  slide: {
    borderWidth: 1,
    borderColor: 'grey',
    flexDirection: 'row',
    alignSelf: 'center',
    width: "100%",
    height: "100%",
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    //backgroundColor: '#e2e2e2',
    borderRadius: 15,
    backgroundColor:"#B6E0D4"
  },
  titleSlide: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  slideText: {
    fontSize: 13
  }
})
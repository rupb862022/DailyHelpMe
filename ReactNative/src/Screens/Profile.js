import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React, { useContext, useLayoutEffect, useState } from 'react'
import { userContext } from '../General/userContext';
import { useStars } from 'stars-rating-react-hooks'

const Profile = ({ navigation }) => {
  const { user } = useContext(userContext);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: user != 0 ? user.FirstName : null,
    });
  }, [navigation, user]);

  const [defaultRating, setDefaultRating] = useState(2);
  const [maxRating, setMxRating] = useState([1, 2, 3, 4, 5]);
  const starImgFilled = 'https://raw.githubusercontent.com/tranhonghan/images/main/star_filled.png';
  const startImgCorner = 'https://raw.githubusercontent.com/tranhonghan/images/main/star_corner.png';

  const CustomRatingBar = () => {
    return (
      <View style={styles.customRatingBarStyle}>
        {
          maxRating.map((item, key) => {
            return (
              <TouchableOpacity activeOpacity={0.7} key={item} onPress={() => setDefaultRating(item)}>
                <Image
                  style={styles.starImgStyle}
                  source={
                    item <= defaultRating ? { uri: starImgFilled } : { uri: startImgCorner }
                  } />

              </TouchableOpacity>
            )
          })

        }
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View>
        <Image style={styles.imgStyle} source={{uri: user.Photo}} />
      </View>
      <View>
        <View style={styles.row}>
          <TouchableOpacity >
            <Text > בקשות פתוחות </Text>
          </TouchableOpacity>
          {/* <TouchableOpacity onPress={navigation.navigate("FutureTasks")}>
            <Text>  משימות שהשתבצתי   </Text>
          </TouchableOpacity> */}
        </View>
        <View style={styles.row}>
          <TouchableOpacity>
            <Text > משימות שביצעתי   </Text>
          </TouchableOpacity>
          <TouchableOpacity >
            <Text > בקשות שפתחתי   </Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.btnStyle}>
        <Text > אישור שיבוצים חדשים </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btnStyle}>
        <Text > דירוג משימות שהושלמו </Text>
      </TouchableOpacity>
      <Text style={styles.text}> הדירוג שלי </Text>
      <CustomRatingBar />
      <Text style={styles.text}>
        {defaultRating + ' / ' + maxRating.length}
      </Text>
      <TouchableOpacity activeOpacity={0.7} style={styles.btnStyle} onPress={() => alert(defaultRating)}>
        <Text>לחץ לשמירת הדירוג</Text>

      </TouchableOpacity>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {

    //textAlign: 'center',
    // flexDirection: 'row',
    // marginTop: 5,
    // justifyContent: 'flex-center',
    // width: '80%',
  },
  customRatingBarStyle: {
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 30
  },
  starImgStyle: {
    width: 40,
    height: 40,
    resizeMode: 'cover'
  },
  imgStyle: {
    borderRadius: 40,
    height: 80,
    width: 80,
    marginLeft: 150,
    marginTop: 50,
    alignItems: 'center',
    padding: 50,
  },
  title: {
    fontSize: 27,
    textAlign: 'center',
    marginTop: 50

  },
  text: {
    fontSize: 18,
    color: 'grey',
    textAlign: 'center',
    marginTop: 50,
    flexDirection: 'row',
  },
  btnStyle: {
    marginTop: 20,
    textAlign: 'center',
    width: "25%",
    color: "black",
    backgroundColor: "#F8B11C",
    alignSelf: 'center',
    padding: 7,
    borderRadius: 20,
    fontSize: 14,
    borderColor: 'black',
    borderWidth: 1,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 10,
    },
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  }
})

export default Profile;
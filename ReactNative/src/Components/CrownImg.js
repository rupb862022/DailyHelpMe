import { StyleSheet, Text, View ,Image} from 'react-native'
import React from 'react'

const CrownImg = ({rank,profile}) => {
  
  switch (rank)
  {
    case 1:{
      return (
        <Image style={profile? styles.crownProfile : styles.crownImg} source={require(`../../assets/rank1.png`)} />
      )
    }
    case 2:{
      return (
        <Image style={profile? styles.crownProfile : styles.crownImg} source={require(`../../assets/rank2.png`)} />
      )
    }
    case 3:{
      return (
        <Image style={profile? styles.crownProfile : styles.crownImg} source={require(`../../assets/rank3.png`)} />
      )
    }
    default:
      return null
         
    
  }
}

export default CrownImg

const styles = StyleSheet.create({
  crownImg: {
    height: 20,
    width: 20,
    alignSelf: 'center',
    marginRight:20,
    marginBottom: -5,
    zIndex: 3,
    transform: [{rotate: '20deg'}],
  },
  crownProfile:{
    height: 30,
    width: 30,
    alignSelf: 'center',
    marginRight:-40,
    marginTop: -90,
    zIndex: 3,
    transform: [{rotate: '20deg'}],
  }
})
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { Camera } from 'expo-camera';

const CameraUpload= ()=> {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [camera, setCamera] = useState(null);
  const [picUri, setPicUri] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const UploadPic = (picName) => {
      let urlAPI = 'https://proj.ruppin.ac.il/bgroup86/prod/uploadpicture';
      let picture = new FormData();

      picture.append('picture',{
        uri: picUri,
        name: 'User.jpg',
        type: 'image/jpg'
      });

      const config = {
        method: 'POST',
        body: picture,
      }
  
      fetch(urlAPI, config)
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
          }
          else { alert('error uploding  :(...'); }
        })
        .catch(err => { alert('err upload= ' + err); });

  }


  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={styles.container}>
      <Camera style={styles.camera}
        type={type}
        ref={ref => setCamera(ref)} >
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }}>
            <Text style={styles.text}> Flip </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={async () => {
              if (camera) {
                const data = await camera.takePictureAsync({ quality: 0.8 });
                console.log(data.uri)
                setPicUri(data.uri);
              }
            }}
          >
            <Text style={styles.text}> Snap </Text>
          </TouchableOpacity>

        </View>
      </Camera >

      <View style={styles.snapBox}>
        {picUri && <Image source={{ uri: picUri }}
          style={styles.snapPhoto} />}
        {picUri && <TouchableOpacity style={styles.btn} onPress={() => UploadPic('user')}>
          <Text> אהבתי את התמונה! </Text>
        </TouchableOpacity> }   
      </View>
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 1,
    position: 'absolute',
    alignSelf: 'center',
    width: '100%',
    height: '100%',
  },
  camera: {
    flex: 0.6,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    margin: 10,
  },
  button: {
    flex: 0.2,
    alignSelf: 'flex-end',
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
  snapPhoto: {
    width: 200,
    height: 200,
    borderWidth: 2,
    borderColor: '#52B69A',
    borderRadius: 100,
    margin: 10,
    alignSelf: 'center',
    
  },
  snapBox: {
    flex: 0.4,
    justifyContent: 'center',
    backgroundColor: 'white',
    alignItems: 'center',
  },
  btn: {
   borderRadius: 20,
    backgroundColor:'#52B69A',
    alignItems: 'center',
    borderColor:'black',
    borderWidth: 1,
    padding:5,

  }
});

export default CameraUpload;
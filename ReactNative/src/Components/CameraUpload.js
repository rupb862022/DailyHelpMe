import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { Camera } from 'expo-camera';

const CameraUpload = ({ setPicture, setOpen ,firstName}) => {
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
            <Text style={styles.text}> הפוך </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={async () => {
              if (camera) {
                const data = await camera.takePictureAsync({ quality: 0.8 });
                console.log("picUrl:",data.uri)
                setPicUri(data.uri);
              }
            }}
          >
            <Text style={styles.text}> צלם </Text>
          </TouchableOpacity>
        </View>
      </Camera >

      <View style={styles.snapBox}>
        {picUri && <Image source={{ uri: picUri }}
          style={styles.snapPhoto} />}
        {picUri && <TouchableOpacity style={styles.btn} onPress={() => {
          setPicture(picUri)
          setOpen(false);
        }}>
          <Text> אהבתי את התמונה! </Text>
        </TouchableOpacity>}
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
    width: 220,
    height: 220,
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
    backgroundColor: '#52B69A',
    alignItems: 'center',
    borderColor: 'black',
    borderWidth: 1,
    padding: 5,

  }
});

export default CameraUpload;
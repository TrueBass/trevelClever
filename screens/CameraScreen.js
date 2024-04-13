import { Camera, CameraType } from 'expo-camera';
import { useState, useEffect } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function CameraScreen({ navigation }) {

  const [shouldAsk,setshouldAsk] = useState(true);
  const [hasPermission, requestPermission] = Camera.useCameraPermissions();
  const [isCameraActive, setIsCameraActive] = useState(false); 
  const [type, setType] = useState(CameraType.back);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setIsCameraActive(true);
      if(shouldAsk){
        requestPermission({shouldAsk});
      }
    });
    return unsubscribe; 
  }, [navigation,shouldAsk]); 

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      setIsCameraActive(false);
    });
    return unsubscribe;
  }, [navigation]);

  const handleRequestPermission = async () => {
    const { status } = await requestPermission({shouldAsk});
    if (status === 'granted'){
      setshouldAsk(false);
      navigation.navigate('Camera');
    }
    else if (status !== 'granted') {
      console.warn('Camera permission not granted'); 
    }
  };

  const handleAskAgain = () => {
    setShouldAsk(true);
  };

  const handleNeverAskAgain = () => {
    setShouldAsk(false);
  };

  const toggleCameraType = () => {
    setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
  };

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={handleRequestPermission} title="Grant a permission" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isCameraActive && hasPermission.granted &&(
        <Camera key={Date.now()} style={styles.camera} type={type}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
              <Text style={styles.text}>Flip Camera</Text>
            </TouchableOpacity>
          </View>
        </Camera>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});

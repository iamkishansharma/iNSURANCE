import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {RNCamera} from 'react-native-camera';
import {Avatar, useTheme} from 'react-native-paper';
import {LoadingScreen} from '../components/LoadingScreen';

const ClickPhoto = ({navigation}) => {
  const paperTheme = useTheme();

  // capture a jpg image
  const takePicture = async camera => {
    try {
      const options = {quality: 0.9, base64: false};
      const data = await camera.takePictureAsync(options);
      navigateToSignUp(data.uri);
    } catch (error) {
      console.console.warn(error);
    }
  };

  function navigateToSignUp(image) {
    // send image uri to signup screen
    navigation.navigate('SignUp', {image});
  }

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: paperTheme.colors.backgroundColor},
      ]}>
      <RNCamera
        type={RNCamera.Constants.Type.back}
        captureAudio={false}
        flashMode={RNCamera.Constants.FlashMode.on}
        style={styles.preview}
        androidCameraPermissionOptions={{
          title: 'Permission to use camera',
          message: 'Do you want to use camera?',
          buttonPositive: 'Yes',
          buttonNegative: 'No',
        }}>
        {({camera, status}) => {
          if (status !== 'READY') {
            return <LoadingScreen msg="Loading..." isAutomatic={true} />;
          }
          return (
            <TouchableOpacity
              onPress={() => {
                takePicture(camera);
              }}>
              <Avatar.Icon
                icon="camera"
                color={paperTheme.colors.accent}
                style={{
                  backgroundColor: paperTheme.colors.backgroundColor,
                }}
                size={70}
              />
            </TouchableOpacity>
          );
        }}
      </RNCamera>
    </View>
  );
};

export default ClickPhoto;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 20,
  },
});

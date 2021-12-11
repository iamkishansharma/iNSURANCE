import React from 'react';
import {StyleSheet, View, TouchableOpacity, Image} from 'react-native';
import Snackbar from 'react-native-snackbar';

export function ShowSnackBar(type, message) {
  switch (type) {
    case 'error':
      Snackbar.show({
        text: '🤷‍♂️ ' + message,
        textColor: 'white',
        backgroundColor: 'red',
        duration: Snackbar.LENGTH_LONG,
      });
      break;
    case 'success':
      Snackbar.show({
        text: message,
        textColor: 'white',
        backgroundColor: 'green',
      });
      break;

    default:
      break;
  }
}

export const options = {
  title: 'Select your profile pic',
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};

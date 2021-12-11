import React from 'react';
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

export const GENDER_LIST = [
  {name: 'Male', value: 'Male'},
  {name: 'Female', value: 'Female'},
  {name: 'Other', value: 'Other'},
];
export const MARITAL_STATUS_LIST = [
  {name: 'Unmarried', value: 'Unmarried'},
  {name: 'Married', value: 'Married'},
  {name: 'Divorced', value: 'Divorced'},
  {name: 'Widowed', value: 'Widowed'},
  {name: 'Other', value: 'Other'},
];
const COUNTRY_LIST = [
  {name: 'Nepal', value: 'Nepal'},
  {name: 'India', value: 'India'},
  {name: 'USA', value: 'USA'},
  {name: 'Bhutan', value: 'Bhutan'},
  {name: 'Mexico', value: 'Mexico'},
  {name: 'China', value: 'China'},
  {name: 'Pakistan', value: 'Pakistan'},
];

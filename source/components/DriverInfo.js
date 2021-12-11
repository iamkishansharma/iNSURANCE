import React from 'react';
import {Keyboard, View, StyleSheet} from 'react-native';
import {TextInput, Text, useTheme, Divider} from 'react-native-paper';
import {MARITAL_STATUS_LIST, GENDER_LIST} from '../utils/Constants';
import PickDate from '../components/PickDate';
import DropDown from '../components/DropDown';
const DriverInfo = ({
  name,
  setName,
  gender,
  setGender,
  isOpen,
  setIsOpen,
  dob,
  setDob,
  dol,
  setDol,
  isOpenDol,
  setIsOpenDol,
  ssn,
  setSsn,
  maritalStatus,
  setMaritalStatus,
  licenseNo,
  setLicenseNo,
  state,
  setState,
}) => {
  return (
    <>
      <Text style={styles.heading}>Driver Info</Text>
      <Divider style={{backgroundColor: 'gray', height: 1}} />
      <TextInput
        label="Full Name*"
        mode="outlined"
        value={name}
        onChangeText={text => setName(text)}
      />
      <TextInput
        label="SSN*"
        mode="outlined"
        value={ssn}
        onChangeText={text => setSsn(text)}
      />

      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <TextInput
          style={{flex: 1, marginEnd: 5}}
          label="DOL*"
          mode="outlined"
          value={`${dol.getFullYear()}/${dol.getMonth() + 1}/${dol.getDate()}`}
          onFocus={() => {
            Keyboard.dismiss();
            setIsOpenDol(true);
          }}
        />
        <PickDate
          isOpen={isOpenDol}
          setIsOpen={setIsOpenDol}
          setValue={dol}
          setSelectedValue={setDol}
        />
        <TextInput
          style={{flex: 1}}
          label="DOB*"
          mode="outlined"
          value={`${dob.getFullYear()}/${dob.getMonth() + 1}/${dob.getDate()}`}
          onFocus={() => {
            Keyboard.dismiss();
            setIsOpen(true);
          }}
        />
        <PickDate
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          setValue={dob}
          setSelectedValue={setDob}
        />
      </View>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <DropDown
          iconColor={useTheme().colors.onSurface}
          backgroundColor={useTheme().colors.background}
          itemColor={useTheme().colors.onSurface}
          listItems={GENDER_LIST}
          marginEnd={5}
          selectedValue={gender}
          setSelectedValue={setGender}
        />
        <DropDown
          iconColor={useTheme().colors.onSurface}
          backgroundColor={useTheme().colors.background}
          itemColor={useTheme().colors.onSurface}
          listItems={MARITAL_STATUS_LIST}
          selectedValue={maritalStatus}
          setSelectedValue={setMaritalStatus}
        />
      </View>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <TextInput
          style={{flex: 1, marginEnd: 5}}
          label="License No*"
          mode="outlined"
          value={licenseNo}
          onChangeText={text => {
            setLicenseNo(text);
          }}
        />
        <TextInput
          style={{flex: 1}}
          label="State*"
          mode="outlined"
          value={state}
          onChangeText={text => {
            setState(text);
          }}
        />
      </View>
    </>
  );
};
export default DriverInfo;

const styles = StyleSheet.create({
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

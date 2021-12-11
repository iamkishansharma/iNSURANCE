import React, {useState, useEffect} from 'react';
import {Keyboard, View, StyleSheet, ScrollView} from 'react-native';
import {TextInput, Text, Avatar, useTheme, Divider} from 'react-native-paper';

// firebase
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import DriverInfo from '../../components/DriverInfo';
export default function StepOne({navigation, route}) {
  const paperTheme = useTheme();
  const [company, setCompany] = useState({});
  const [userDetail, setUserDetail] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenDol, setIsOpenDol] = useState(false);

  // driver details var start
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [maritalStatus, setMaritalStatus] = useState('');
  const [dob, setDob] = useState(new Date());
  const [gender, setGender] = useState('');
  const [licenseNo, setLicenseNo] = useState('');
  const [dol, setDol] = useState(new Date());
  const [state, setState] = useState('');
  const [ssn, setSsn] = useState('');
  // driver details var ends

  function fetchUserDetails() {
    const user = auth().currentUser;
    database()
      .ref(`/users/${user.uid}`)
      .once('value')
      .then(snapshot => {
        console.log('User data: ', snapshot.val());
        setUserDetail(snapshot.val());
      });
  }
  useEffect(() => {
    const {company} = route.params;
    setCompany(company);
    fetchUserDetails();
  }, []);
  return (
    <ScrollView>
      <View
        style={[
          styles.container,
          {
            backgroundColor: paperTheme.colors.backgroundColor,
          },
        ]}>
        <DriverInfo
          name={name}
          setName={setName}
          gender={gender}
          setGender={setGender}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          dob={dob}
          setDob={setDob}
          isOpenDol={isOpenDol}
          setIsOpenDol={setIsOpenDol}
          dol={dol}
          setDol={setDol}
          ssn={ssn}
          setSsn={setSsn}
          maritalStatus={maritalStatus}
          setMaritalStatus={setMaritalStatus}
          licenseNo={licenseNo}
          setLicenseNo={setLicenseNo}
          state={state}
          setState={setState}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

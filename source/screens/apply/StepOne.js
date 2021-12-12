import React, {useState, useEffect} from 'react';
import {View, StyleSheet, ScrollView, Alert} from 'react-native';
import {
  TextInput,
  Text,
  Avatar,
  useTheme,
  Divider,
  Button,
} from 'react-native-paper';

import DriverInfo from '../../components/DriverInfo';
import {LoadingScreen} from '..//../components/LoadingScreen';
import {USAGE_LIST, ANTILOCK_LIST, ShowSnackBar} from '../../utils/Constants';
import CheckBox from '../../components/CheckBox';

// firebase
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

// ui component
export default function StepOne({navigation, route}) {
  const paperTheme = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [company, setCompany] = useState({});
  const [userDetail, setUserDetail] = useState({});
  // driver details var start
  const [name, setName] = useState('');
  const [maritalStatus, setMaritalStatus] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [dob, setDob] = useState(new Date());
  const [gender, setGender] = useState('');
  const [licenseNo, setLicenseNo] = useState('');
  const [isOpenDol, setIsOpenDol] = useState(false);
  const [dol, setDol] = useState(new Date());
  const [state, setState] = useState('');
  const [ssn, setSsn] = useState('');
  // driver details var ends

  // vehicle details var start
  const [vehicleId, setVehicleId] = useState('');
  const [modelYear, setModelYear] = useState('');
  const [annualMileage, setAnnualMileage] = useState('');
  const [usage, setUsage] = useState({});
  const [uList, setUList] = useState(USAGE_LIST);
  const [antiList, setAntiList] = useState(ANTILOCK_LIST);
  // vehicle details var ends

  // current details var start
  const [carrier, setCarrier] = useState('');
  const [yearWithCarrier, setYearWithCarrier] = useState('');
  const [bil, setBil] = useState('');
  const [pdl, setPdl] = useState('');
  const [collisionD, setCollisionD] = useState('');
  const [comprehensiveD, setComprehensiveD] = useState('');
  // current details var ends

  function handleRemove(id) {
    const newList = uList.filter(item => item.id !== id);
    setUList(newList);
  }
  // bring the user information
  function fetchUserDetails() {
    const user = auth().currentUser;
    database()
      .ref(`/users/${user.uid}`)
      .once('value')
      .then(snapshot => {
        // console.log('User data: ', snapshot.val());
        setUserDetail(snapshot.val());
        setIsLoading(false);
      });

    firestore()
      .collection('applications')
      .get()
      .then(querySnapshot =>
        querySnapshot.forEach(documentSnapshot => {
          console.log('User ID: ', documentSnapshot.id);
          if (documentSnapshot.id.includes(user.uid)) {
            ShowSnackBar(
              'error',
              'You have already applied for this insurance.',
            );
            navigation.pop();
          }
        }),
      );
  }

  function submitApplication() {
    setIsLoading(true);
    // firestore database save as new documents
    firestore()
      .collection('applications')
      .doc(`${auth().currentUser.uid}+appliedTo${company.name}`)
      .set({
        agreed: true,
        message: `${userDetail.fullName} applied for ${company.name}`,
        application: {
          insured: {
            profilePic: userDetail.profilePic,
            fullName: userDetail.fullName,
            email: userDetail.email,
            address: userDetail.address,
            pinCode: userDetail.pinCode,
            country: userDetail.country,
          },
          driver: {
            fullName: name,
            ssn,
            dol: `${dol.getFullYear()}/${dol.getMonth() + 1}/${dol.getDate()}`,
            dob: `${dob.getFullYear()}/${dob.getMonth() + 1}/${dob.getDate()}`,
            gender,
            maritalStatus,
            licenseNo,
            state,
          },
          vehicle: {
            vehicleId,
            modelYear,
            annualMileage,
            usage: uList,
            antiLockBrakes: antiList,
          },
          current: {
            carrier,
            yearWithCarrier,
            bil,
            pdl,
            collisionD,
            comprehensiveD,
          },
        },
      })
      .then(() => {
        setIsLoading(false);
        console.log('Application details saved....');
        navigation.navigate('Home');
        ShowSnackBar('success', 'Application submitted successfully');
      })
      .catch(error => {
        ShowSnackBar('error', error.message);
        setIsLoading(false);
      });
  }
  function showAlertAndCheckError() {
    return Alert.alert(
      'Are you sure?',
      'Please re-check your details before submitting the application?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: () => {
            // check for empty or null
            if (
              name !== null ||
              ssn !== null ||
              licenseNo !== null ||
              state !== null ||
              vehicleId !== null ||
              modelYear !== null ||
              annualMileage !== null ||
              carrier !== null ||
              yearWithCarrier !== null ||
              bil !== null ||
              pdl !== null ||
              collisionD !== null ||
              comprehensiveD !== null ||
              name.length != 0 ||
              ssn.length != 0 ||
              licenseNo.length != 0 ||
              state.length != 0 ||
              vehicleId.length != 0 ||
              modelYear.length != 0 ||
              annualMileage.length != 0 ||
              carrier.length != 0 ||
              yearWithCarrier.length != 0 ||
              bil.length != 0 ||
              pdl.length != 0 ||
              collisionD.length != 0 ||
              comprehensiveD.length != 0
            ) {
              console.log('Error not fount in inputs');
              submitApplication();
            } else {
              ShowSnackBar('error', 'Check your inputs');
            }
          },
        },
      ],
    );
  }
  useEffect(() => {
    const {company} = route.params;
    setCompany(company);
    fetchUserDetails();
  }, []);
  return isLoading ? (
    <LoadingScreen msg="Loading..." isAutomatic={true} />
  ) : (
    <ScrollView>
      <View
        style={[
          styles.container,
          {backgroundColor: paperTheme.colors.backgroundColor},
        ]}>
        {/* First Section */}
        <View style={{marginBottom: 15}}>
          <Avatar.Image
            source={{uri: userDetail.profilePic}}
            size={100}
            style={{elevation: 5, alignSelf: 'center'}}
          />
          <Text style={styles.heading}>Insured Info</Text>
          <Divider style={{backgroundColor: 'gray', height: 1}} />
          <TextInput
            label="Full Name*"
            mode="outlined"
            value={userDetail.fullName}
          />
          <TextInput label="Email*" mode="outlined" value={userDetail.email} />
          <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
            <TextInput
              style={{flex: 1, marginEnd: 5}}
              label="Address*"
              mode="outlined"
              value={userDetail.address}
            />
            <TextInput
              style={{flex: 1}}
              label="Pin Code*"
              mode="outlined"
              value={userDetail.pinCode}
            />
          </View>
          <TextInput
            label="Country*"
            mode="outlined"
            value={userDetail.country}
          />
        </View>

        {/* 2nd Section */}
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
        {/* 3rd Section */}
        <View style={{marginBottom: 15}}>
          <Text style={styles.heading}>Vehicle Info</Text>
          <Divider style={{backgroundColor: 'gray', height: 1}} />
          <TextInput
            label="Vehicle Id*"
            mode="outlined"
            value={vehicleId}
            onChangeText={text => setVehicleId(text)}
          />
          <TextInput
            label="Model Year*"
            mode="outlined"
            value={modelYear}
            keyboardType="number-pad"
            onChangeText={text => setModelYear(text)}
          />
          <TextInput
            label="Annual Mileage*"
            mode="outlined"
            value={annualMileage}
            onChangeText={text => setAnnualMileage(text)}
          />
          <View
            style={{
              padding: 10,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View>
              <Text style={{fontWeight: 'bold'}}>Usage</Text>
              {uList.map(e => (
                <CheckBox
                  key={e.id}
                  e={e}
                  uList={uList}
                  setUList={setUList}
                  title={e.title}
                  isChecked={e.isChecked}
                />
              ))}
            </View>
            <View style={{flexDirection: 'column'}}>
              <Text style={{fontWeight: 'bold'}}>Anti-Lock Brakes</Text>
              {antiList.map(e => (
                <CheckBox
                  e={e}
                  key={e.id}
                  uList={antiList}
                  setUList={setAntiList}
                  title={e.title}
                  isChecked={e.isChecked}
                />
              ))}
            </View>
          </View>
        </View>
        {/* 4th Section */}
        <View style={{marginBottom: 15}}>
          <View style={{flexDirection: 'column'}}>
            <Text style={styles.heading}>Current Insurance Info</Text>
            <Divider style={{backgroundColor: 'gray', height: 1}} />
            <TextInput
              label="Carrier*"
              mode="outlined"
              value={carrier}
              onChangeText={text => setCarrier(text)}
            />
            <TextInput
              label="Years with Carrier*"
              mode="outlined"
              value={yearWithCarrier}
              keyboardType="number-pad"
              onChangeText={text => setYearWithCarrier(text)}
            />
            <View
              style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
              <TextInput
                style={{flex: 1, marginEnd: 5}}
                label="Badly Injury Limit*"
                mode="outlined"
                value={bil}
                keyboardType="number-pad"
                onChangeText={text => setBil(text)}
              />
              <TextInput
                style={{flex: 1}}
                label="Prop. Damage Limit*"
                mode="outlined"
                value={pdl}
                keyboardType="number-pad"
                onChangeText={text => setPdl(text)}
              />
            </View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
              <TextInput
                style={{flex: 1, marginEnd: 5}}
                label="Collision Deductable*"
                mode="outlined"
                value={collisionD}
                onChangeText={text => setCollisionD(text)}
              />
              <TextInput
                style={{flex: 1}}
                label="Comprehensive Deductable*"
                mode="outlined"
                value={comprehensiveD}
                onChangeText={text => setComprehensiveD(text)}
              />
            </View>
          </View>
        </View>
        <Button
          style={[
            styles.button,
            {
              backgroundColor: paperTheme.dark
                ? paperTheme.colors.primary
                : paperTheme.colors.foregroundColor,
            },
          ]}
          onPress={() => {
            console.log('======================');
            // setIsDialogVisible(true);
            // check error and save
            showAlertAndCheckError();
          }}>
          <Text style={{fontWeight: 'bold'}}>Submit Application</Text>
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  button: {
    elevation: 3,
    margin: 20,
    padding: 5,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

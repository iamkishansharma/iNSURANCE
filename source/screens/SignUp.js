import React, {useState, useRef, useEffect} from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import {
  Text,
  Avatar,
  TextInput,
  Button,
  useTheme,
  Divider,
} from 'react-native-paper';
import BottomSheet from 'react-native-gesture-bottom-sheet';
import {ShowSnackBar, options} from '../utils/Constants';
import * as ImagePicker from 'react-native-image-picker';
import {Picker} from '@react-native-picker/picker';
// Firebase
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import storage from '@react-native-firebase/storage';
import {LoadingScreen} from '../components/LoadingScreen';
import {useIsFocused} from '@react-navigation/native';
const SignUp = ({navigation, route}) => {
  // Needed in order to use .show()
  const bottomSheet = useRef(null);
  // state variables
  const isFocused = useIsFocused();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [country, setCountry] = useState('np');

  const [isLoading, setIsLoading] = useState(false);
  const [profilePic, setProfilePic] = useState(
    'https://image.shutterstock.com/image-vector/image-upload-icon-260nw-1062480539.jpg',
  );
  const [imageUploading, setImageUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(0);
  // choose image from dir
  const chooseImage = async () => {
    console.log('Image picker called....');
    // open
    ImagePicker.launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancled ImagePicker..>' + response);
      } else {
        console.log('ImagePicker Not error.....' + response);
        // uploadImage(response);
        console.log(response.assets[0].uri);
        setProfilePic(response.assets[0].uri);
      }
    });
  };
  // check for inputs error
  const checkInput = () => {
    if (
      fullName == null ||
      fullName.trim().length == 0 ||
      address == null ||
      address.trim().length == 0 ||
      email == null ||
      password == null ||
      email.trim().length == 0 ||
      password.trim().length == 0
    ) {
      // stop loading
      setIsLoading(false);
      ShowSnackBar(
        'error',
        'Invalid email or password. Please check your inputs.',
      );
    } else {
      // show loading
      setIsLoading(true);
      // call signin method after input check
      signUp({email, password, address, profilePic, fullName});
    }
  };

  const signUp = async () => {
    // create a new user
    setImageUploading(true);
    auth()
      .createUserWithEmailAndPassword(email.trim(), password.trim())
      .then(response => {
        console.log('Signup Success.... ' + response);
        // save details of new user to firebase database
        database()
          .ref('/users/' + response.user.uid)
          .set({
            profilePic,
            fullName,
            email,
            password,
            address,
          })
          .then(res => {
            // save image to firebase storage
            uploadImage(profilePic);
          });
      })
      .catch(error => {
        ShowSnackBar('error', error.message);
        setImageUploading(false);
      });
  };

  const uploadImage = async picUri => {
    console.log('uploading....');
    const storageRefrence = storage().ref(
      `/users/${auth().currentUser.uid}/profile.png`,
    );

    // upload task for firebase storage
    const task = storageRefrence.putFile(picUri, {cacheControl: 'no-store'});

    task.on('state_changed', taskSnapshot => {
      const percentage =
        (taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) * 1000;
      // setting upload status for progressbar
      setUploadStatus(percentage / 10);
    });
    // after task complete get url and set it to profilePic var
    task.then(async () => {
      storageRefrence
        .getDownloadURL()
        .then(url => {
          setProfilePic(url);
          setImageUploading(false);
          // show user created and data uploaded
          ToastAndroid.show('Sign in to your account', ToastAndroid.LONG);
          // navigate to signin screen
          navigation.navigate('SignIn');
        })
        .catch(e => {
          ShowSnackBar('error', e.message);
          setImageUploading(false);
        });
    });
  };

  // get theme from rnp
  const paperTheme = useTheme();
  useEffect(() => {
    const {image} = route.params;
    if (isFocused) {
      if (image !== null && image.length != 0) {
        setProfilePic(image);
      }
    }
  }, [isFocused]);
  return imageUploading ? (
    <LoadingScreen
      isAutomatic={false}
      progress={uploadStatus}
      msg="Please wait..."
    />
  ) : (
    <ScrollView
      style={{backgroundColor: paperTheme.colors.backgroundColor}}
      showsVerticalScrollIndicator={false}>
      <Text style={styles.heading}>Sign up</Text>
      <View style={{margin: 16}}>
        <TouchableOpacity onPress={() => bottomSheet.current.show()}>
          <Avatar.Image
            style={{alignSelf: 'center', marginBottom: '5%', elevation: 5}}
            source={{
              uri: profilePic,
            }}
            size={150}
          />
        </TouchableOpacity>

        <TextInput
          label="Full Name"
          mode="outlined"
          keyboardType="default"
          value={fullName}
          onChangeText={text => {
            setFullName(text);
          }}
        />
        <TextInput
          label="Email"
          mode="outlined"
          keyboardType="email-address"
          value={email}
          onChangeText={text => {
            setEmail(text);
          }}
        />
        <TextInput
          label="Password"
          mode="outlined"
          keyboardType="default"
          value={password}
          onChangeText={text => {
            setPassword(text);
          }}
        />
        <TextInput
          label="Address"
          mode="outlined"
          keyboardType="default"
          value={address}
          onChangeText={text => {
            setAddress(text);
          }}
        />
        <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
          <TextInput
            style={{flex: 1, marginEnd: 5}}
            label="Pincode"
            mode="outlined"
            keyboardType="number-pad"
            value={pinCode.toString()}
            onChangeText={text => {
              setPinCode(text);
            }}
          />
          <CountrySelector
            countries={COUNTRY_LIST}
            selectedValue={country}
            setSelectedValue={setCountry}
            itemColor={paperTheme.colors.text}
            backgroundColor={
              paperTheme.dark
                ? paperTheme.colors.background
                : paperTheme.colors.background
            }
          />
        </View>
        <Button
          style={{
            backgroundColor: paperTheme.dark
              ? paperTheme.colors.foregroundColor
              : paperTheme.colors.foregroundColor,
            elevation: 3,
            margin: 20,
            padding: 5,
          }}
          onPress={() => {
            checkInput();
          }}>
          <Text style={{fontWeight: 'bold'}}>SignUp</Text>
        </Button>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('SignIn');
          }}>
          <Text style={{textAlign: 'center'}}>Already have an account?</Text>
          <Text
            style={{
              textAlign: 'center',
              fontWeight: 'bold',
              color: paperTheme.colors.accent,
            }}>
            Login
          </Text>
        </TouchableOpacity>
      </View>

      <BottomSheet
        hasDraggableIcon
        ref={bottomSheet}
        height={240}
        sheetBackgroundColor={
          paperTheme.dark
            ? paperTheme.colors.foregroundColor
            : paperTheme.colors.background
        }>
        <View style={{marginHorizontal: 10}}>
          <Text style={styles.subHeading}>Upload image via</Text>

          <TouchableOpacity
            style={styles.bsItemBox}
            onPress={() => {
              // open camera
              navigation.navigate('ClickPhoto');
              bottomSheet.current.close();
            }}>
            <Avatar.Icon icon="camera" size={50} />
            <Text style={styles.bsItemText}>Open camera</Text>
          </TouchableOpacity>
          <Divider style={styles.divider} />
          <TouchableOpacity
            style={styles.bsItemBox}
            onPress={() => {
              // open gallery
              bottomSheet.current.close();
              chooseImage();
            }}>
            <Avatar.Icon icon="wallpaper" size={50} />
            <Text style={styles.bsItemText}>Select from gallery</Text>
          </TouchableOpacity>
        </View>
      </BottomSheet>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'left',
    marginHorizontal: 16,
  },
  subHeading: {
    fontWeight: 'bold',
    fontSize: 16,
    margin: 20,
    textAlign: 'left',
  },
  bsItemBox: {
    flexDirection: 'row',
    marginBottom: 5,
    padding: 5,
    alignItems: 'center',
  },
  bsItemText: {
    marginStart: 20,
  },
  divider: {
    height: 1,
    marginHorizontal: 20,
  },
});

export default SignUp;

const CountrySelector = ({
  countries,
  selectedValue,
  setSelectedValue,
  itemColor,
  backgroundColor,
}) => {
  return (
    <View
      style={{
        flex: 1,
        marginTop: 5,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'gray',
        height: 59,
        backgroundColor: backgroundColor,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
      }}>
      <Picker
        selectedValue={selectedValue}
        style={{
          flex: 1,
          color: itemColor,
          borderRadius: 5,
          height: '100%',
          fontSize: 18,
          padding: 10,
        }}
        onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}>
        {countries.map(b => (
          <Picker.Item key={b.value} label={b.name} value={b.value} />
        ))}
      </Picker>
    </View>
  );
};
const COUNTRY_LIST = [
  {name: 'Nepal', value: 'np'},
  {name: 'India', value: 'in'},
  {name: 'USA', value: 'us'},
  {name: 'Bhutan', value: 'bh'},
  {name: 'Mexico', value: 'mx'},
  {name: 'China', value: 'ch'},
  {name: 'Pakistan', value: 'pk'},
];

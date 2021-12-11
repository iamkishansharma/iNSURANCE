import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';
import {Text, TextInput, Button, useTheme} from 'react-native-paper';
// Firebase
import auth from '@react-native-firebase/auth';
import {LoadingScreen} from '../components/LoadingScreen';
import {ShowSnackBar} from '../utils/Constants';

// :: main screen/component starts :: //
const SignIn = ({navigation, route}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // check for inputs error
  const checkInput = () => {
    if (
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
      signIn({email, password});
    }
  };
  // sign in to firebase auth
  const signIn = async ({email, password}) => {
    await auth()
      .signInWithEmailAndPassword(email.trim(), password.trim())
      .then(response => {
        // stop loading
        setIsLoading(false);
        // navigate to home
        navigation.replace('Home');
        // show success snackbar
        ShowSnackBar('success', 'Sign in successful.');
      })
      .catch(error => {
        // show error snackbar
        ShowSnackBar('error', error.message);
        // stop loading
        setIsLoading(false);
      });
  };

  // get the selected theme from rnp
  const paperTheme = useTheme();

  // show loading screen if isLoading else show screen
  return isLoading ? (
    <LoadingScreen isAutomatic={true} msg="Loading..." />
  ) : (
    <View
      style={[
        styles.container,
        {backgroundColor: paperTheme.colors.backgroundColor},
      ]}>
      <StatusBar
        backgroundColor={
          paperTheme.dark ? paperTheme.colors.backgroundColor : 'white'
        }
        barStyle={paperTheme.dark ? 'light-content' : 'dark-content'}
      />
      <Text style={styles.heading}>Sign in</Text>
      <Image
        source={require('../assets/login.png')}
        width={1}
        height={1}
        style={{
          width: '100%',
          height: '40%',
          resizeMode: 'contain',
        }}
      />
      <View style={{margin: 16}}>
        <TextInput
          left={<TextInput.Icon icon="email" />}
          label="Email"
          mode="outlined"
          keyboardType="email-address"
          value={email}
          onChangeText={text => {
            setEmail(text);
          }}
        />
        <TextInput
          left={<TextInput.Icon icon="lock" />}
          label="Password"
          mode="outlined"
          keyboardType="default"
          value={password}
          onChangeText={text => {
            setPassword(text);
          }}
        />
        <Button
          style={[
            styles.button,
            {
              backgroundColor: paperTheme.dark
                ? paperTheme.colors.foregroundColor
                : paperTheme.colors.foregroundColor,
            },
          ]}
          onPress={() => {
            checkInput();
          }}>
          <Text style={{fontWeight: 'bold'}}>SignIn</Text>
        </Button>

        <TouchableOpacity
          onPress={() => {
            const image = '';
            navigation.navigate('SignUp', {image});
          }}>
          <Text style={{textAlign: 'center'}}>Don't have an account?</Text>
          <Text style={{textAlign: 'center', color: paperTheme.colors.accent}}>
            Create account.
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
  },
  button: {
    elevation: 3,
    margin: 20,
    padding: 5,
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'left',
    margin: 16,
  },
});

export default SignIn;

import React, {useState} from 'react';

// important imports for navigation
import 'react-native-gesture-handler';
import {
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
// All screene is stack
import Home from './screens/Home';
import SignIn from './screens/SignIn';
import SignUp from './screens/SignUp';
import ClickPhoto from './screens/ClickPhoto';
import StepOne from './screens/apply/StepOne';
import {StatusBar, TouchableOpacity, View, BackHandler} from 'react-native';
const Stack = createNativeStackNavigator();

// paper
import {
  Text,
  Avatar,
  Portal,
  Dialog,
  Paragraph,
  Button,
  DarkTheme as PaperDarkTheme,
  DefaultTheme as PaperDefaultTheme,
  Provider as PaperProvider,
  Switch,
} from 'react-native-paper';
// Firebase
import auth from '@react-native-firebase/auth';
const App = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  // themes start
  const customDefaultTheme = {
    ...DefaultTheme,
    ...PaperDefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      ...PaperDefaultTheme.colors,
      backgroundColor: 'white',
      foregroundColor: '#ff6584',
    },
  };
  const customDarkTheme = {
    ...DarkTheme,
    ...PaperDarkTheme,
    colors: {
      ...DarkTheme.colors,
      ...PaperDarkTheme.colors,
      backgroundColor: 'black',
      foregroundColor: '#444444',
    },
  };
  const theme = isDarkTheme ? customDarkTheme : customDefaultTheme;
  // themes end

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };
  // dialog for signOut
  const [visible, setVisible] = React.useState(false);
  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);
  const signOutUser = () => {
    auth().signOut();
  };

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer theme={theme}>
        <StatusBar
          backgroundColor={isDarkTheme ? theme.colors.background : 'white'}
          barStyle={isDarkTheme ? 'light-content' : 'dark-content'}
        />
        <Stack.Navigator
          initialRouteName={auth().currentUser == null ? 'SignIn' : 'Home'}>
          <Stack.Screen
            name="SignIn"
            component={SignIn}
            options={{
              headerShown: false,
              title: 'SignIn',
              headerTitleStyle: {
                fontSize: 20,
                fontWeight: 'bold',
              },
              headerTitleAlign: 'center',
            }}
          />

          <Stack.Screen
            name="Home"
            component={Home}
            options={{
              headerShown: true,
              title: 'Home',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
              headerRight: () => (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Switch
                    color="red"
                    value={isDarkTheme}
                    onValueChange={() => toggleTheme()}
                  />
                  <TouchableOpacity
                    onPress={() => {
                      showDialog();
                    }}>
                    <Avatar.Icon
                      icon="power"
                      style={{backgroundColor: 'transparent'}}
                      size={40}
                      color="red"
                    />
                    {visible ? (
                      <Portal>
                        <Dialog visible={visible} onDismiss={hideDialog}>
                          <Dialog.Title>Sign out</Dialog.Title>
                          <Dialog.Content>
                            <Paragraph>Are you sure?</Paragraph>
                          </Dialog.Content>
                          <Dialog.Actions>
                            <Button
                              onPress={() => {
                                signOutUser();
                                BackHandler.exitApp();
                              }}>
                              Done
                            </Button>
                          </Dialog.Actions>
                        </Dialog>
                      </Portal>
                    ) : null}
                  </TouchableOpacity>
                </View>
              ),
              headerTitleAlign: 'center',
            }}
          />

          <Stack.Screen
            name="SignUp"
            component={SignUp}
            options={{
              headerShown: false,
              title: 'SignUp',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
              headerRight: () => (
                <TouchableOpacity onPre>
                  <Avatar.Icon
                    icon="power"
                    style={{backgroundColor: theme.colors.foregroundColor}}
                    size={30}
                  />
                </TouchableOpacity>
              ),
              headerTitleAlign: 'center',
            }}
          />
          <Stack.Screen
            name="ClickPhoto"
            component={ClickPhoto}
            options={{
              headerShown: true,
              title: 'Camera',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
              headerTitleAlign: 'center',
            }}
          />
          <Stack.Screen
            name="StepOne"
            component={StepOne}
            options={{
              headerShown: true,
              title: 'Apply',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
              headerTitleAlign: 'center',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};

export default App;

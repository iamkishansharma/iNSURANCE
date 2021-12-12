import React, {useState} from 'react';
import {Image, View} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import * as Progress from 'react-native-progress';

export const LoadingScreen = ({msg, isAutomatic, progress}) => {
  const paperTheme = useTheme();
  return (
    <View
      style={{
        backgroundColor: paperTheme.colors.backgroundColor,
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}>
      <Image
        source={require('../assets/waiting.png')}
        width={10}
        height={10}
        style={{
          width: '100%',
          height: '50%',
          alignSelf: 'center',
          resizeMode: 'contain',
        }}
      />
      <View
        style={{
          backgroundColor: 'transparent',
          position: 'absolute',
          bottom: 100,
        }}>
        <Text style={{fontWeight: 'bold', fontSize: 30, textAlign: 'center'}}>
          {msg}
        </Text>
        <Progress.Bar
          width={200}
          color={paperTheme.colors.primary}
          borderWidth={2}
          indeterminate={isAutomatic}
          progress={progress}
        />
      </View>
    </View>
  );
};

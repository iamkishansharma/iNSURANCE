import React, {useState} from 'react';
import {View} from 'react-native';
import {Text, Checkbox} from 'react-native-paper';
const CheckBox = ({uList, e, setUList, isChecked, title, ...props}) => {
  
    function markUnmark(clickedItem) {
      if (clickedItem.isChecked) {
        const index = uList.findIndex(item => item.id == clickedItem.id);
        uList[index].isChecked = false;
        setUList(uList.slice());
      } else {
        const index = uList.findIndex(item => item.id == clickedItem.id);
        uList[index].isChecked = true;
        setUList(uList.slice());
      }
    }
  return (
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      <Checkbox
        status={isChecked ? 'checked' : 'unchecked'}
        onPress={() => {
          markUnmark(e);
        }}
      />
      <Text
        onPress={() => {
          markUnmark(e);
        }}>
        {title}
      </Text>
    </View>
  );
};
export default CheckBox;

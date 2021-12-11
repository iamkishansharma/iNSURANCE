import React from 'react';
import {Picker} from '@react-native-picker/picker';
import {View} from 'react-native';
const DropDown = ({
  listItems,
  selectedValue,
  setSelectedValue,
  itemColor,
  backgroundColor,
  iconColor,
  ...props
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
        ...props,
      }}>
      <Picker
        mode="dropdown"
        dropdownIconColor={iconColor}
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
        {listItems.map(b => (
          <Picker.Item key={b.value} label={b.name} value={b.value} />
        ))}
      </Picker>
    </View>
  );
};
export default DropDown;

import React from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
const PickDate = ({isOpen, setIsOpen, setValue, setSelectedValue}) => {
  return isOpen ? (
    <DateTimePicker
      testID="dateTimePicker"
      value={setValue}
      mode="date"
      display="default"
      onChange={(event, selectedDate) => {
        setIsOpen(false);
        const currentDate = selectedDate || setValue;
        setSelectedValue(currentDate);
      }}
    />
  ) : null;
};
export default PickDate;

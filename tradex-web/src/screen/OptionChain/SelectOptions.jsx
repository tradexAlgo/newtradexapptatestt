import {MdArrowDropDown} from 'react-icons/md';
import {Text, View} from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import {SelectList} from 'react-native-dropdown-select-list';
import {useState} from 'react';

const SelectOptions = ({options, bottomText, handleSelectChange}) => {
  const [selected, setSelected] = useState('');

  return (
    <>
      <SelectList
        setSelected={val => setSelected(val)}
        placeholder={bottomText}
        data={options}
        save="value"
        onChange={event => {
          console.log('event', event.target.value);
          handleSelectChange(event.target.value);
        }}
      />
    </>
  );
};

export default SelectOptions;

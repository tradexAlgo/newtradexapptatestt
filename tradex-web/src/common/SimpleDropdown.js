import React, { forwardRef, useImperativeHandle, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  Pressable,
} from 'react-native';

const SimpleDropdown = forwardRef(({ ModalValue = [], DefaultValue = 'Select', onSelect }, ref) => {
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(DefaultValue);

  useImperativeHandle(ref, () => ({
    show: () => setVisible(true),
  }));

  const handleSelect = (item) => {
    setSelected(item);
    onSelect?.(null, item);
    setVisible(false);
  };

  return (
    <>
      <Text style={{ color: '#fff' }}>{selected}</Text>

      <Modal visible={visible} transparent animationType="fade">
        <Pressable
          onPress={() => setVisible(false)}
          style={styles.overlay}>
          <View style={styles.dropdownContainer}>
            <FlatList
              data={ModalValue}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.option} onPress={() => handleSelect(item)}>
                  <Text style={styles.optionText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </>
  );
});

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#00000099', // transparent black background
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownContainer: {
    width: 200,
    backgroundColor: '#1c1e22', // 🔁 black background
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  option: {
    paddingVertical: 10,
  },
  optionText: {
    fontSize: 16,
    color: '#ffffff', // 🔁 white text
  },
});


export default SimpleDropdown;

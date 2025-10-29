// CustomAlert.js
import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { color } from './color';

const CustomAlert = ({ visible, onClose, onConfirm, message }) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ backgroundColor: '#1c1c1e', padding: 20, borderRadius: 10, width: '80%' }}>
          <Text style={{ color: 'white', fontSize: 16, marginBottom: 20 }}>{message}</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
            <TouchableOpacity onPress={onClose} style={{ marginRight: 15 }}>
              <Text style={{ color: 'white' }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onConfirm}>
              <Text style={{ color: color.Default_GREEN }}>Yes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CustomAlert;

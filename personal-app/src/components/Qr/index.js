import React, { Component } from 'react';
import {
  Text,
  TouchableOpacity,
} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';

const ScanScreen = ({ onScanned }) => {

  const onSuccess = (e) => {
    onScanned(e.data);
  }

  return (
      <QRCodeScanner
        onRead={onSuccess}
      />
  );
}

export default ScanScreen;
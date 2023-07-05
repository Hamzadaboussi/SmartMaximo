import React from 'react';
import { Snackbar } from 'react-native-paper';

interface MySnackbarProps {
  visible: boolean;
  onDismiss: () => void;
}

const MySnackbar: React.FC<MySnackbarProps> = ({ visible, onDismiss }) => {
  return (
    <Snackbar
      visible={visible}
      onDismiss={onDismiss}
      duration={Snackbar.DURATION_LONG}
    >
      Please wait for the Callee to accept The record
    </Snackbar>
  );
};

export default MySnackbar;

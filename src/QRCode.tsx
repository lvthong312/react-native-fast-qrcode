import React, { useState } from 'react';
// import QRCodeImpl from 'qrcode';
import {
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import QRCodeComponent from './QRCodeComponent';

export interface QRCodeProps {
  value: string;
  size?: number;
  color?: string;
  backgroundColor?: string;
  ecl?: 'L' | 'M' | 'Q' | 'H';
  logo?: string | number; // URL hoặc require()
  logoSize?: number;
  gradient?: {
    from: string;
    to: string;
    direction?: 'vertical' | 'horizontal';
  };
  style?: 'square' | 'circle' | 'diamond' | 'rounded';
  cornerRadius?: number;

  // Finder pattern style
  finderColor?: string;
  finderRadius?: number;
}

export const QRCode: React.FC<QRCodeProps> = ({ ...restProps }) => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      {/* Thumbnail QR */}
      <TouchableOpacity onPress={() => setVisible(true)}>
        <QRCodeComponent {...restProps} />
      </TouchableOpacity>

      {/* Fullscreen QR Modal */}
      <Modal visible={visible} transparent animationType="fade">
        <Pressable style={styles.modalBg} onPress={() => setVisible(false)}>
          <View style={styles.qrContainer}>
            <QRCodeComponent
              {...restProps}
              size={Dimensions.get('window').width - 82}
            />
          </View>
        </Pressable>
      </Modal>
    </>
  );
};

export default QRCode;

const styles = StyleSheet.create({
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrContainer: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 12,
  },
});

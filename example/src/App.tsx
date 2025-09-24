import { View, StyleSheet, ScrollView } from 'react-native';
import { QRCodeList, QRCode } from 'react-native-fast-qrcode';

export default function App() {
  return (
    <ScrollView>
      <View style={styles.container}>
        {/* Basic QR */}
        <QRCode value="https://example.com1" size={200} ecl="M" />

        {/* Circle style */}
        <QRCode
          value="https://example.com2"
          size={200}
          style="circle"
          gradient={{ from: '#ff512f', to: '#dd2476', direction: 'vertical' }}
        />

        {/* Diamond style + logo */}
        <QRCode
          value="https://example.com3"
          size={220}
          style="diamond"
          color="#0072ff"
          // logo={require('./assets/logo.png')}
          logoSize={50}
        />

        {/* Rounded + finder pattern custom */}
        <QRCode
          value="https://example.com4"
          size={240}
          style="rounded"
          cornerRadius={6}
          finderColor="#ff5722"
          finderRadius={8}
          gradient={{ from: '#43cea2', to: '#185a9d', direction: 'horizontal' }}
          // logo={require('./assets/logo.png')}
          logoSize={50}
          backgroundColor="white"
        />

        <QRCodeList
          values={['QR-111', 'QR-222', 'QR-333']}
          qrcodeProps={{ size: 160 }}
          showArrows
          showDots
          dotSize={10}
          dotColor="#bbb"
          activeDotColor="blue"
          paginationType="fraction"
        />
        <QRCodeList
          values={['QR-111', 'QR-222', 'QR-333']}
          qrcodeProps={{ size: 160 }}
          showArrows
          showDots
          dotSize={10}
          dotColor="#bbb"
          activeDotColor="blue"
          paginationType="fraction"
          animationType="none"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 50,
    marginTop: 100,
  },
});

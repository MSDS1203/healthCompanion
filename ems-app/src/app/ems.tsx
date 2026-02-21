import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import RedButton from '../components/RedButton';

export default function EmergencyScreen() {
   const handlePress = () => {
    alert('Button pressed!');
  };

  return (
    <View style={styles.container}>
      <RedButton onPress={handlePress} title="Red Button" color="green" />
      <RedButton onPress={handlePress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

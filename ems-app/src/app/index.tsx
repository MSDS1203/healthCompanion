import { StyleSheet, Text, View } from 'react-native';
import RedButton from '../components/RedButton';

export default function HomeScreen() {
  const handlePress = () => {
    alert('Button pressed!');
  };
  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
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

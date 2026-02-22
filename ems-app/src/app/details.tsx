import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { generateChecklist } from '../api/gemini';

export default function DetailsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text>Hello, world</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#274C77',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
});

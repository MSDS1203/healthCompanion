import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button} from 'react-native';
import { fetchAudio } from '../api/elevenlabs.mjs';

export default function ChecklistScreen() {
  return (
    <View style={styles.container}>
      <Text>Press to play audio</Text>

      <Button
        title="Play Audio"
        onPress={() => {
          fetchAudio();
        }}
      />

      <StatusBar style="auto" />
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

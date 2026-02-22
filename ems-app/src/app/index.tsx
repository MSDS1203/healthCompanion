import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Button } from 'react-native';
import { createAudioPlayer } from 'expo-audio';

export default function HomeScreen() {
  const playAudio = async () => {
    try {
      const player = createAudioPlayer(
        `http://${process.env.EXPO_PUBLIC_IP}:8000/generate-audio`
      );

      await player.play();
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Play audio" onPress={playAudio} />
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
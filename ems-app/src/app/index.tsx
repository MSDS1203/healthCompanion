import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { StyleSheet, View, Pressable, Button } from 'react-native';
import { useRouter } from 'expo-router';

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

    const router = useRouter();
  
  return (
    <View style={styles.container}>
      <Text style={{color: '#fff'}}>Welcome to your emergency response companion</Text>
      <Pressable 
        style={styles.emergencyBtn}
        onPress={() => {router.push("/ems")}}
      >
        <MaterialCommunityIcons name="alert-decagram" size={35} color="white" />        
        <Text style={styles.emergencyFont}>EMERGENCY</Text>
      </Pressable>
      <Pressable 
        style={styles.moreInfoBtn}
        onPress={() => {router.push("/get-info")}}
      >
        <Text style={styles.infoFont}>More Information</Text>
      </Pressable>
      <Pressable 
        style={styles.moreInfoBtn}
        onPress={() => {router.push("/chatbot")}}
      >
        <Text style={styles.infoFont}>Go to Chatbot</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#274C77',
    alignItems: 'center',
    justifyContent: 'center',
  gap: 20,
    padding: 20,
  },
  emergencyBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#CF0624',
    height: '50%',
    width: '100%',
    borderRadius: 20,
  },
  emergencyFont: {
    color: '#fff',
    fontSize: 30,
    textAlign: 'center',
  },
  moreInfoBtn: {
    backgroundColor: '#A3CEF1',
    borderRadius: 20,
    padding: 20,
  },
  infoFont: {
    color: '#274C77',
    fontSize: 20,
  }
});

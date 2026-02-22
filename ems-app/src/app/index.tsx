import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';


export default function HomeScreen() {
    const router = useRouter();
  
  return (
    <View style={styles.container}>
      <Text>Welcome to your emergency response companion</Text>
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
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    margin: 20,
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
    backgroundColor: '#AAE0FA',
    borderRadius: 20,
    padding: 20,
  },
  infoFont: {
    color: '#021552',
    fontSize: 20,
  }
});

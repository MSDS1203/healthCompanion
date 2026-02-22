import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { StyleSheet, View, Pressable, Image, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function HomeScreen() {

    const router = useRouter();
  
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Image
        source={require('../../assets/vital-logo.png')}
        style={styles.image}
        />
        <Text style={styles.bodyText}>Welcome to VITAL, your emergency care companion</Text>
      </View>
      <Pressable 
        style={styles.emergencyBtn}
        onPress={() => {router.push("/ems")}}
      >
        <MaterialCommunityIcons name="alert-decagram" size={60} color="white" />        
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
    </SafeAreaView>
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
  image: {
    width: 150,
    resizeMode: 'contain',
    margin: "auto",
  },
  bodyText: {
    color: '#fff',
    fontSize: 20,
    lineHeight: 25,
    textAlign: 'center',
  },
  emergencyBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#CF0624',
    height: '40%',
    width: '100%',
    borderRadius: 20,
  },
  emergencyFont: {
    color: '#fff',
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  moreInfoBtn: {
    backgroundColor: '#A3CEF1',
    borderRadius: 20,
    padding: 20,
    width: '100%',
  },
  infoFont: {
    color: '#274C77',
    fontSize: 20,
    textAlign: 'center',
  }
});

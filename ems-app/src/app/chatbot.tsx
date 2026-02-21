import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { GeminiChatbot } from '../api/gemini';

export default function ChatbotScreen() {
  return (
    <View style={styles.container}>
      <Text>AI Medical Consultant</Text>
      <StatusBar style="auto" />
      <ScrollView>
        <View>
          <Text>
            {GeminiChatbot("Tell me more about epileptic episodes.")}
          </Text>
        </View>
      </ScrollView>
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

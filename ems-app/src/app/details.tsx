import { StatusBar } from 'expo-status-bar';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GeminiDisplay, generateChecklist } from '../api/gemini';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import Markdown from 'react-native-markdown-display';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function DetailsScreen() {
  const router = useRouter();
  const { search } = useLocalSearchParams<{ search?: string }>();
  const [response, setResponse] = useState('');
  const [inputValue, setInputValue] = useState('');

  function handleSearch() {
    router.push({
      pathname: "/chatbot",
      params: { search: inputValue }
    });
  }

  async function fetchResponse() {
    try {
      let message = "";
      if (search) {
        message = await GeminiDisplay(search) ?? "";
      }
      else {
        message = "Error with display. Please search again.";
      }
      setResponse(message);

    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchResponse();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.titleBar}>
          <Pressable onPress={() => { router.push("/get-info") }}>
            <Ionicons name="arrow-back-outline" style={styles.titleIcon} size={30} color="#fff" />
          </Pressable>
          <Text style={styles.title}>{search}</Text>
        </View>
        <ScrollView style={styles.container}>
            <Markdown style={{
              body: { color: 'white' }
            }}>
              {response}
            </Markdown>
        </ScrollView>
        <View style={styles.searchBar}>
          <FontAwesome name="search" size={24} color="#274C77" />
          <TextInput
            style={styles.input}
            onChangeText={setInputValue}
            value={inputValue}
            placeholder="Ask your AI medical consultant..."
            onSubmitEditing={handleSearch}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#274C77',
    padding: 30,
  },
  title: {
    flex: 1,
    color: "#fff",
    fontSize: 25,
    textAlign: 'center',
  },
  titleIcon: {
    marginRight: 'auto',
  },
  titleBar: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6096BA',
    paddingHorizontal: 20,
    paddingVertical: 20,
    // Shadows
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 3,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  bodyText: {
    color: '#fff',
    fontSize: 15,
    lineHeight: 20,
  },
  button: {
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',

    padding: 20,
    backgroundColor: '#AAE0FA',
    width: '100%',
    borderRadius: 20,
  },
  buttonText: {
    color: '#274C77',
    fontSize: 20,
    textAlign: 'center',
  },
  searchBar: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    color: "#274C77",
    backgroundColor: '#E7ECEF',
    padding: 10,
    paddingHorizontal: 30,
  },
  input: {
    color: "#274C77",
    fontSize: 15,
    backgroundColor: '#E7ECEF',
    width: '100%',
    padding: 20,
  },
  spacer: {
    height: 20,
  }
});


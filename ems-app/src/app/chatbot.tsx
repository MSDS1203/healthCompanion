import { StatusBar } from 'expo-status-bar';
import { FlatList, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { GeminiChatbot } from '../api/gemini';
import { useEffect, useState } from 'react';
import Markdown from 'react-native-markdown-display'
import { FontAwesome } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';

export default function ChatbotScreen() {

  const { search } = useLocalSearchParams();

  const [responses, setResponses] = useState<string[]>([]);

  const [response, setResponse] = useState("Loading...");

  useEffect(() => {
    async function fetchResponse() {
      try {
        const result = await GeminiChatbot("Tell me more about epileptic episodes.");
        setResponse(result ?? ""); // assuming GeminiChatbot returns text
        setResponses(prev => [...prev, result ?? ""]);
      } catch (error) {
        setResponse("Hi! How can I assist you today?");
        console.error(error);
      }
    }

    fetchResponse();
  }, []);

  const [inputValue, setInputValue] = useState('');

  function handleSearch() {
  }

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.title}>AI Medical Consultant</Text>
        <StatusBar style="auto" />
        <ScrollView>
          <View>
            <Markdown>{response}</Markdown>
          </View>
        </ScrollView>
        <FlatList
          data={responses}
          renderItem={({ index }) =>
            <View>
              <Markdown>
                {response[index]}
              </Markdown>
            </View>
          }
          keyExtractor={index => index.toString()}
          ItemSeparatorComponent={() => <View style={styles.spacer} />}
        />
      </View>
      <View style={styles.searchBar}>
        <FontAwesome name="search" size={24} color="#021552" />
        <TextInput
          style={styles.input}
          onChangeText={setInputValue}
          value={inputValue}
          placeholder="Ask your AI medical consultant..."
          onSubmitEditing={handleSearch}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'stretch',
    justifyContent: 'center',
    padding: 30,
  },
  title: {
    fontSize: 30,
    textAlign: 'center',
  },
  searchBar: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    color: "#021552",
    backgroundColor: '#f2f3f5',
    padding: 10,
    paddingHorizontal: 30,
  },
  input: {
    color: "#021552",
    fontSize: 15,
    backgroundColor: '#f2f3f5',
    width: '100%',
    padding: 20,
  },
  spacer: {
    height: 20,
  }
});

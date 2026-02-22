import { StatusBar } from 'expo-status-bar';
import { FlatList, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { GeminiChatbot } from '../api/gemini';
import { useEffect, useState } from 'react';
import Markdown from 'react-native-markdown-display'
import { FontAwesome } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';

type Message = {
  message: string;
  isUser: boolean;
}

export default function ChatbotScreen() {

  const { search } = useLocalSearchParams<{ search?: string }>();
  console.log(search);

  const [responses, setResponses] = useState<Message[]>([]);
  const [errorIsVisible, setErrorIsVisible] = useState<boolean>(false);
  const [thinking, setThinking] = useState<boolean>(false);

  async function fetchResponse(query: string) {
    setErrorIsVisible(false);
    setThinking(true);
    try {
      const userMessage: Message = { message: query, isUser: true };
      setResponses(prev => [...prev, userMessage]);

      const message = await GeminiChatbot(query);
      const result: Message = { message: message ?? "", isUser: false };
      setResponses(prev => [...prev, result ?? ""]);

      setThinking(false);
    } catch (error) {
      setErrorIsVisible(true);
      console.error(error);
    }
  }

  useEffect(() => {
    if (search === undefined) {
      setResponses(prev => [...prev, { message: "Hi! How can I assist you today?", isUser: false }]);
    }
    else {
      fetchResponse(search ?? '');
    }
  }, []);

  const [inputValue, setInputValue] = useState('');


  return (
    <>
      <View style={styles.container}>
        <Text style={styles.title}>AI Medical Consultant</Text>
        <FlatList
          data={responses}
          renderItem={({ item, index }) => {
            return(
              item.isUser
              ? <View style={styles.user}>
                <View style={styles.textBubble}>
                  <Text>Hello!</Text>
                </View>
              </View>
              : <View>
                <Markdown>
                  {responses[index].message}
                </Markdown>
              </View>
            );
          }}
          keyExtractor={index => index.toString()}
          ItemSeparatorComponent={() => <View style={styles.spacer} />}
        />
        {
          errorIsVisible
            ? <Text>I am having difficulty. Please try again.</Text>
            : null
        }
        {
          thinking
            ? <Text>Loading. . .</Text>
            : null
        }
      </View>
      <View style={styles.searchBar}>
        <FontAwesome name="search" size={24} color="#021552" />
        <TextInput
          style={styles.input}
          onChangeText={setInputValue}
          value={inputValue}
          placeholder="Ask your AI medical consultant..."
          onSubmitEditing={() => { 
            fetchResponse(inputValue);
            setInputValue("Ask your AI medical consultant...");
          }}
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
  user: {
    display: 'flex',
    flex: 1,
    alignItems: 'flex-end',
  },
  textBubble: {
    backgroundColor: 'blue',
    padding: 20,
    borderRadius: 20,
    marginRight: 20,
  },
  spacer: {
    height: 20,
  }
});

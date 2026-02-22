import { StatusBar } from 'expo-status-bar';
import { FlatList, Platform, KeyboardAvoidingView, StyleSheet, Text, TextInput, View, Pressable } from 'react-native';
import { GeminiChatbot } from '../api/gemini';
import { useEffect, useRef, useState } from 'react';
import Markdown from 'react-native-markdown-display';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

type Message = {
  message: string;
  isUser: boolean;
}

export default function ChatbotScreen() {
  const router = useRouter();

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
      setResponses(prev => [...prev, result]);

      setThinking(false);
    } catch (error) {
      setErrorIsVisible(true);
      setThinking(false);
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

  // Scroll to end of chat on new message
  const scrollRef = useRef<FlatList<Message>>(null);
  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [responses]);

  const [inputValue, setInputValue] = useState('');


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.titleBar}>
          <Pressable onPress={() => {router.push("/")}}>
            <Ionicons name="arrow-back-outline" style={styles.titleIcon} size={30} color="#fff" />
          </Pressable>
          <Text style={styles.title}>AI Medical Consultant</Text>
        </View>
        <View style={styles.container}>
          <FlatList
            data={responses}
            ref={scrollRef}
            renderItem={({ item, index }) => {
              return (
                item.isUser
                  ? <View style={styles.user}>
                    <View style={styles.textBubble}>
                      <Text>{item.message}</Text>
                      <View style={styles.rightArrow} />
                      <View style={styles.rightArrowOverlap} />
                    </View>
                  </View>
                  : <View>
                    <Markdown style={{
                      body: { color: 'white' }
                    }}
                    >
                      {item.message}
                    </Markdown>
                  </View>
              );
            }}
            keyExtractor={(_, index) => index.toString()}
            ItemSeparatorComponent={() => <View style={styles.spacer} />}
          />
          {
            errorIsVisible
              ? <Text style={styles.botText}>I am having difficulty. Please try again.</Text>
              : null
          }
          {
            thinking
              ? <Text style={styles.botText}>Loading. . .</Text>
              : null
          }
        </View>
        <View style={styles.searchBar}>
          <Ionicons name="chatbubble-ellipses" size={24} color="#274C77" />
          <TextInput
            style={styles.input}
            onChangeText={setInputValue}
            value={inputValue}
            placeholder="Ask your AI medical consultant..."
            onSubmitEditing={() => {
              fetchResponse(inputValue);
              setInputValue("");
            }}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#274C77',
    alignItems: 'stretch',
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
  botText: {
    color: '#fff',
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
  user: {
    display: 'flex',
    flex: 1,
    alignItems: 'flex-end',
  },
  textBubble: {
    backgroundColor: '#E7ECEF',
    padding: 20,
    borderRadius: 10,
    marginRight: 20,
  },
  rightArrow: {
    position: "absolute",
    backgroundColor: "#E7ECEF",
    width: 20,
    height: 25,
    bottom: 0,
    right: -10,
  },
  rightArrowOverlap: {
    position: "absolute",
    backgroundColor: "#274C77",
    width: 20,
    height: 35,
    bottom: -6,
    borderBottomLeftRadius: 50,
    right: -20,
  },
  spacer: {
    height: 20,
  }
});

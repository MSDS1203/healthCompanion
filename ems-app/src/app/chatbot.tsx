import { StatusBar } from 'expo-status-bar';
import { FlatList, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { GeminiChatbot } from '../api/gemini';
import { useEffect, useRef, useState } from 'react';
import Markdown from 'react-native-markdown-display'
import Ionicons from '@expo/vector-icons/Ionicons';
import { useLocalSearchParams } from 'expo-router';
import { createAudioPlayer } from 'expo-audio';

type Message = {
  message: string;
  isUser: boolean;
}

export default function ChatbotScreen() {
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  
  const audioPlayerRef = useRef<any>(null);
  const readAloud = async (text: string) => {
    if (!voiceEnabled || !text.trim()) return;
    try {
      const cleanText = text.replace(/[*#_~]/g, '');

      const shortText = cleanText.length > 500 
      ? cleanText.substring(0, 500) + "..." 
      : cleanText;

      const response = await fetch(`http://${process.env.EXPO_PUBLIC_IP}:8000/generate-audio`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: shortText }),
      });

      const data = await response.json();

    if (data.audio) {
      const player = createAudioPlayer(`data:audio/mpeg;base64,${data.audio}`);
      audioPlayerRef.current = player; 
      if (voiceEnabled) {
        player.play();
      }
    }
    } catch (error) {
      console.error("Audio error:", error);
    }
  };

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

      readAloud(result.message);
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
    <>
      <View style={styles.titleBar}>
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
                  <Ionicons
                  name={voiceEnabled ? "volume-medium-outline" : "volume-mute-outline"}
                  size={24}
                  color="white"
                  onPress={() => {
                  if (voiceEnabled) {
                    audioPlayerRef.current?.pause(); 
                  }
                  else{
                    audioPlayerRef.current?.play();
                  }
                  setVoiceEnabled(!voiceEnabled);
                  }}
                  />              
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
    backgroundColor: '#274C77',
    alignItems: 'stretch',
    justifyContent: 'center',
    padding: 30,
  },
  title: {
    color: "#fff",
    fontSize: 25,
    textAlign: 'center',
  },
  titleBar: {
    backgroundColor: '#6096BA',
    paddingHorizontal: 30,
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

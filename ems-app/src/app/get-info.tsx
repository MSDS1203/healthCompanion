import { StyleSheet, Text, View, FlatList, Pressable, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function InfoScreen() {
  const router = useRouter();

  const OPTIONS = [
    {
      title: "Cardiac Arrest",
      search: "Cardiac Arrest",
    },
    {
      title: 'Stroke',
      search: "Stroke"
    },
    {
      title: 'Allergic Reaction',
      search: "Anaphylaxis",
    },
    {
      title: 'Epilepsy/Seizures',
      search: "Epilepsy and Seizures"
    },
    {
      title: 'Choking',
      search: "Choking"
    },

  ];

  const [inputValue, setInputValue] = useState('');

  function handleSearch() {
    router.push({
      pathname: "/chatbot",
      params: { search: inputValue }
    });
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.titleBar}>
          <Pressable onPress={() => { router.push("/") }}>
            <Ionicons name="arrow-back-outline" style={styles.titleIcon} size={30} color="#fff" />
          </Pressable>
          <Text style={styles.title}>More Information</Text>
        </View>
        <View style={styles.container}>
          <Text style={styles.bodyText}>Explore emergency response information and aid!</Text>
          <View style={styles.spacer} />
          <FlatList
            data={OPTIONS}
            renderItem={({ item }) =>
              <Pressable
                style={styles.button}
                onPress={() => {
                  router.push({
                    pathname: "/details",
                    params: { search: item.search }
                  });
                }}
              >
                <Text style={styles.buttonText}>{item.title}</Text>
              </Pressable>
            }
            keyExtractor={item => item.title}
            ItemSeparatorComponent={() => <View style={styles.spacer} />}
          />
        </View>
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
    </SafeAreaView>
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

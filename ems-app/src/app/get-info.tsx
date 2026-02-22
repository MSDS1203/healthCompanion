import { StyleSheet, Text, View, FlatList, Pressable, TextInput } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import { useState } from 'react';

export default function InfoScreen() {
  const router = useRouter();

  const OPTIONS = [
    {
      title: "Cardiac Arrest",
      search: "Cardiac Arrest",
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

  function handleSearch () {
    router.push({
      pathname: "/chatbot",
      params: {search: inputValue}
    });
  }

  return (
    <>
      <View style={styles.container}>
        <Text>Explore emergency response information and aid!</Text>
        <View style={styles.spacer} />
        <FlatList
          data={OPTIONS}
          renderItem={({item}) => 
            <Pressable
              style={styles.button}
              onPress={() => {
                router.push({
                  pathname: "/details",
                  params: {search: item.search }
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
    margin: 20,
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
    color: '#021552',
    fontSize: 20,
    textAlign: 'center',
  },
  searchBar: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    color: "#021552",
    backgroundColor: '#f2f3f5',
    padding: 30,
  },
  input: {
    color: "#021552",
    fontSize: 15,
    backgroundColor: '#f2f3f5',
  },
  spacer: {
    height: 20,
  }
});

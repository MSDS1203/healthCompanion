import { ScrollView, View, StyleSheet, TouchableOpacity, Text, Pressable, Platform } from 'react-native';
import React, { useState } from 'react';
import EmergencyCard from '../components/NameOfEmergencyButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';


export default function EmergencyScreen() {
  const router = useRouter();

  type Question = {
    id: string;
    text: string;
  };

  type Emergency = {
    id: string;
    name: string;
    questions: Question[];
  };

  const [selectedEmergency, setSelectedEmergency] = useState<Emergency | null>(null);

  const emergencies = [
    {
      id: '1', name: "Cardiac Arrest", questions: [
        { id: '1', text: 'Is the person unconscious?' },
        { id: '2', text: 'Is the person breathing?' },
        { id: '3', text: 'Is there no pulse?' },
      ]
    },
    {
      id: '2', name: "Stroke", questions: [
        { id: '1', text: 'Is the face drooping on one side or numb? To test ask them to smile.' },
        { id: '2', text: 'Is one arm weak or numb? When raising their hands does one arm drift down?' },
        { id: '3', text: 'Is speech slurred? When asked to repeat a phrase, does the person have difficulty?' },
      ]
    },
    {
      id: '3', name: "Seizure/Epilepsy", questions: [
        { id: '1', text: 'Is the person unconscious?' },
        { id: '2', text: 'Is the person having difficulty breathing?' },
        { id: '3', text: 'Are you able to move the person in the area safely?' },
        { id: '4', text: 'Does the person have any medical identification?' },
      ]
    },
    {
      id: '4', name: "Allergic Reaction", questions: [
        { id: '1', text: 'Is the person unconscious?' },
        { id: '2', text: 'Does the person have a weak or rapid pulse?' },
        { id: '3', text: 'Does the person have trouble breathing?' },
        { id: '4', text: 'Does the person have pale, cool and clammy skin?' },
      ]
    },
    {
      id: '5', name: "Choking", questions: [
        { id: '1', text: 'Is the person unconscious?' },
        { id: '2', text: 'Is the person able to talk?' },
        { id: '3', text: 'Does the person have noisy or strained breathing?' },
        { id: '4', text: 'Is the person experiencing a change in color of the skin, lips and nails to blue or gray?' },
        { id: '5', text: 'Is the person an infant?' },
      ]
    },
    {
      id: '6', name: "Other", questions: [
        { id: '1', text: 'Is the person unconscious?' },
        { id: '2', text: 'Does the person have a pulse?' },
      ]
    },
    {
      id: '7', name: "I Don't Know", questions: [
        { id: '1', text: 'Is the person unconscious?' },
        { id: '2', text: 'Does the person have a pulse?' },
      ]
    },
  ];

  if (selectedEmergency) {
    return (
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.titleBar}>
          <Pressable onPress={() => setSelectedEmergency(null)}>
            <Ionicons name="arrow-back-outline" style={styles.titleIcon} size={30} color="#fff" />
          </Pressable>
          <Text style={styles.title}>{selectedEmergency.name}</Text>
        </View>
        <View style={styles.fullScreenContainer}>
          <View style={styles.focusedCard}>
            <EmergencyCard
              name={selectedEmergency.name}
              questions={selectedEmergency.questions}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={styles.fullScreenContainer}>
      <View style={styles.container}>
        {emergencies.map((item, index) => {
          const isLastItem = index === emergencies.length - 1;
          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.cardWrapper, isLastItem && styles.fullWidth]}
              onPress={() => setSelectedEmergency(item)}
            >
              <Text style={styles.cardTitle}>{item.name}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    padding: 30,
    backgroundColor: '#274C77',
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
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cardWrapper: {
    width: '49%',
    height: '28%',
    backgroundColor: '#A3CEF1',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullWidth: {
    width: '100%',
    backgroundColor: '#E7ECEF',
  },
  cardTitle: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 25,
  },
  /* Styles for the "Question Mode" */
  focusedCard: {
    flex: 1,
    marginTop: 20,
  },
  backButton: {
    padding: 5,
    backgroundColor: '#274C77',
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
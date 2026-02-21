import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type Question = {
  id: string;
  text: string;
};

type EmergencyCardProps = {
  name: string;
  questions: Question[];
};

export default function EmergencyCard({name, questions }: EmergencyCardProps) {
  const [expanded, setExpanded] = useState(true);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleSubmit = () => {
  // add logic for submit through gemini
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={() => setExpanded(!expanded)}>
        <Text style={styles.title}>{name}</Text>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.questionsContainer}>
          {questions.map((q) => (
            <View key={q.id} style={styles.questionBlock}>
              <Text style={styles.questionText}>{q.text}</Text>

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[
                    styles.answerButton,
                    answers[q.id] === 'Yes' && styles.selectedYes,
                  ]}
                  onPress={() => handleAnswer(q.id, 'Yes')}
                >
                  <Text>Yes</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.answerButton,
                    answers[q.id] === 'No' && styles.selectedNo,
                  ]}
                  onPress={() => handleAnswer(q.id, 'No')}
                >
                  <Text>No</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
    </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#aed6ffff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  questionsContainer: {
    marginTop: 10,
  },
  questionBlock: {
    marginBottom: 12,
  },
  questionText: {
    marginBottom: 5,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
  },
  answerButton: {
    padding: 8,
    borderWidth: 1,
    borderRadius: 6,
    width: 60,
    alignItems: 'center',
  },
  selectedYes: {
    backgroundColor: '#c8f7c5',
  },
  selectedNo: {
    backgroundColor: '#f7c5c5',
  },
  submitButton: {
    padding: 10,
    backgroundColor: '#0b55a3ff',
    borderRadius: 5,
    alignSelf: 'flex-end',
  },

  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    alignSelf: 'flex-end',
  },
});
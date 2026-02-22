import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { generateChecklist } from '../api/gemini';
import Markdown from 'react-native-markdown-display';

type Question = {
  id: string;
  text: string;
};

type EmergencyCardProps = {
  name: string;
  questions: Question[];
};

export default function EmergencyCard({ name, questions }: EmergencyCardProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [checklistVisible, setChecklistVisible] = useState<boolean>(false);
  const [geminiResponse, setGeminiResponse] = useState<string>("");


  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  // Call API
  const handleSubmit = async () => {
    const response = await generateChecklist({ emergencyType: name, answers });
    setChecklistVisible(true);
    setGeminiResponse(response ?? "");
  };

  return (
    <View >
      {!checklistVisible ?
        <View style={styles.questionsContainer}>
          {questions.map((q) => (
            <View key={q.id} style={styles.card}>
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
        : <Markdown style={{
            body: { color: 'white' }
          }}>
            {geminiResponse}
          </Markdown>
      }

      {!checklistVisible ?
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>SUBMIT</Text>
        </TouchableOpacity>
        : null}
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
    fontSize: 20,
    lineHeight: 20,
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
    padding: 20,
    backgroundColor: '#E7ECEF',
    borderRadius: 5,
    alignSelf: 'stretch',
  },

  submitButtonText: {
    color: '#274C77',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
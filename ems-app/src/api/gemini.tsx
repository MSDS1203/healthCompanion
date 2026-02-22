import { GoogleGenAI } from '@google/genai';

type AssessmentAnswers = {
  emergencyType: string; // e.g. "Cardiac Arrest"
  answers: Record<string, boolean | string>;
};

const sources = {
    cardiac_arrest: [
        "American Heart Association: Emergency Treatment of Cardiac Arrest - https://www.heart.org/en/health-topics/cardiac-arrest/emergency-treatment-of-cardiac-arrest",
        "American Red Cross: Bystander CPR - https://www.redcross.org/take-a-class/resources/articles/bystander-cpr"
    ],
    stroke: [
        "Mayo Clinic: First Aid for Stroke - http://mayoclinic.org/first-aid/first-aid-stroke/basics/art-20056602",
        "American Stroke Association: FAST Signs - https://www.stroke.org/en/fast-experience"
    ],
    seizure: [
        "CDC: First Aid for Seizures - https://www.cdc.gov/epilepsy/first-aid-for-seizures/index.html",
        "Epilepsy Foundation: First Aid Resources - https://www.epilepsy.com/recognition/first-aid-resources"
    ],
    allergic_reaction: [
        "American Red Cross: Anaphylaxis First Aid - https://www.redcross.org/take-a-class/resources/learn-first-aid/allergic-reaction-anaphylaxis",
        "FARE: Save a Life (Food Allergy) - https://www.foodallergy.org/our-initiatives/education-programs-training/fare-training-food-allergy-academy/save-life"
    ],
    choking: [
        "American Heart Association: CPR & Choking Response - https://www.heart.org/en/news/2026/01/20/cpr-and-knowing-how-to-help-someone-choking-could-prevent-a-heart-crisis",
        "American Red Cross: Adult & Child Choking - https://www.redcross.org/take-a-class/resources/learn-first-aid/adult-child-choking"
    ],
    other: [
        "American Red Cross: Severe Bleeding First Aid - https://www.redcross.org/take-a-class/resources/learn-first-aid/bleeding-life-threatening-external",
        "CDC HEADS UP: Concussion Recovery - https://www.cdc.gov/heads-up/guidelines/recovery-from-concussion.html",
        "APA: Bystander Intervention - https://www.apa.org/pi/health-equity/bystander-intervention"
    ]
};

const allSources = Object.values(sources).flat().join("\n");

const ai = new GoogleGenAI({ apiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY || '' });

export async function GeminiChatbot(request: string, retries = 3, delay = 1000) {
    const emergency = getEmergency(request);
    let selectedSources = allSources;
    if (emergency !== "unknown") {
        selectedSources = sources[emergency].join("\n");
    }

    const prompt = `
        You are a certified first-aid assistant.
        Your job is to converse with users about their questions, comments, or concerns of the selected medical emergency.

        CRITICAL RULES:
        - Assume that the user does not have any prior medical experience.
        - Use ONLY the medical sources provided.
        - Do NOT use outside knowledge.
        - If information is not in the sources, say "Refer to official medical sources."
        - Provide concise, safe, medically responsible guidance.
        - Never give risky speculative advice.

        MEDICAL SOURCES:
        ${selectedSources}

        USER QUERY:
        ${request}
    `

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const response = await ai.models.generateContent({
                model: "gemini-3-flash-preview",
                contents: prompt,
                config: {
                    systemInstruction: `
                        You are a medical first-aid chatbot for an emergency assistance mobile app.
                        Always prioritize safety, clarity, and evidence-based guidance.
                        Only rely on the provided trusted organizations (AHA, CDC, Red Cross, Mayo Clinic).
                    `
                }
            });

            const aiText = response?.candidates?.[0]?.content?.parts?.[0]?.text;

            if (!aiText) return "No response"

            return aiText;
        } catch (error: any) {
            if (attempt < retries && error?.message?.includes("503")) {
                await new Promise((resolve) => setTimeout(resolve, delay * Math.pow(2, attempt)));
            } else {
                throw error;
            }
        }
    }
}

export async function GeminiDisplay(context: string, retries = 3, delay = 1000) {
    const emergency = getEmergency(context);
    let selectedSources = allSources;
    if (emergency !== "unknown") {
        selectedSources = sources[emergency].join("\n");
    }

    const prompt = `
        You are a certified first-aid assistant.
        Your job is to display information to the user on the selected medical emergency.

        CRITICAL RULES:
        - Assume that the user does not have any prior medical experience.
        - Use ONLY the medical sources provided.
        - Do NOT use outside knowledge.
        - If information is not in the sources, say "Refer to official medical sources."
        - Provide concise, safe, medically responsible information.
        - Never give risky speculative advice.

        MEDICAL SOURCES:
        ${selectedSources}

        USER QUERY:
        ${context}
    `

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const response = await ai.models.generateContent({
                model: "gemini-3-flash-preview",
                contents: prompt,
                config: {
                    systemInstruction: `
                        You are a medical first-aid reporter for an emergency assistance mobile app.
                        Always prioritize safety, clarity, and evidence-based information.
                        Only rely on the provided trusted organizations (AHA, CDC, Red Cross, Mayo Clinic).
                    `
                }
            });

            const aiText = response?.candidates?.[0]?.content?.parts?.[0]?.text;

            if (!aiText) return "No response"

            return aiText;
        } catch (error: any) {
            if (attempt < retries && error?.message?.includes("503")) {
                await new Promise((resolve) => setTimeout(resolve, delay * Math.pow(2, attempt)));
            } else {
                throw error;
            }
        }
    }
}

export async function generateChecklist(assessment?: AssessmentAnswers, retries = 3, delay = 1000) {
    let selectedSources = allSources; /*
    if (assessment?.emergencyType !== "unknown") {
        selectedSources = sources[assessment?.emergencyType].join("\n");
    } */

    const assessmentSummary: string = assessment ? buildAssessmentSummary(assessment) : "No structured triage answers provided.";

    const prompt = `
        You are a certified first-aid assistant generating a STEP-BY-STEP emergency checklist.

        ROLE:
        - Guide a non-medical bystander helping someone in a medical emergency
        - Provide clear, numbered, actionable steps

        CRITICAL RULES:
        - Assume the user has ZERO medical training
        - Use ONLY the medical sources provided
        - Do NOT use outside knowledge
        - Prioritize life-saving actions first (breathing, pulse, consciousness)
        - If information is not in the sources, say "Refer to official medical sources"
        - Keep steps short, calm, and easy to follow
        - No paragraphs, ONLY numbered checklist steps

        MEDICAL SOURCES:
        ${selectedSources}

        TRIAGE ASSESSMENT DATA (HIGH PRIORITY):
        ${assessmentSummary}

        INSTRUCTIONS:
        Generate a prioritized emergency checklist based FIRST on the triage data,
        then the user description.
`

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const response = await ai.models.generateContent({
                model: "gemini-3-flash-preview",
                contents: prompt,
                config: {
                    systemInstruction: `
                        You are a medical first-aid triage assistant for an emergency mobile app.
                        You MUST prioritize:
                        1) Unconsciousness
                        2) Breathing status
                        3) Pulse
                        4) Immediate danger

                        If the person is unconscious or not breathing, escalate urgency immediately.
                        Provide calm, step-by-step, safety-focused instructions.
                        Only rely on trusted sources (AHA, CDC, Red Cross, Mayo Clinic).
                    `
                }
            });

            const aiText = response?.candidates?.[0]?.content?.parts?.[0]?.text;

            if (!aiText) return "No response"

            return aiText;
        } catch (error: any) {
            if (attempt < retries && error?.message?.includes("503")) {
                await new Promise((resolve) => setTimeout(resolve, delay * Math.pow(2, attempt)));
            } else {
                throw error;
            }
        }
    }
}

function getEmergency(context: string) {
    const c = context.toLowerCase();

    const strokeKeywords = ["stroke", "fast", "face drooping", "slurred speech"];
    const seizureKeywords = ["seizure", "epilepsy", "convulsion", "shaking"];
    const allergyKeywords = ["allergic", "anaphylaxis", "allergy", "epipen", "hives"];
    const chokingKeywords = ["choking", "heimlich", "can't breathe", "airway blocked"];
    const cardiacKeywords = ["cpr", "cardiac", "heart attack", "cardiac arrest", "collapsed", "no pulse"];
    const bleedingKeywords = ["bleeding", "blood loss", "severe bleeding", "wound"];
    const concussionKeywords = ["concussion", "head injury", "hit head"];

    const match = (keywords: string[]) =>
        keywords.some((keyword) => c.includes(keyword));

    if (match(strokeKeywords)) return "stroke";
    if (match(seizureKeywords)) return "seizure";
    if (match(allergyKeywords)) return "allergic_reaction";
    if (match(chokingKeywords)) return "choking";
    if (match(cardiacKeywords)) return "cardiac_arrest";
    if (match(bleedingKeywords) || match(concussionKeywords)) return "other";

    const vagueEmergencyPhrases = [
        "help",
        "emergency",
        "what should i do",
        "someone collapsed",
        "not breathing",
        "unconscious",
        "medical emergency"
    ];

    if (match(vagueEmergencyPhrases)) {
        return "unknown";
    }

    return "unknown";
}

function buildAssessmentSummary(assessment: AssessmentAnswers): string {
  const formattedAnswers = Object.entries(assessment.answers)
    .map(([key, value]) => `- ${key}: ${value}`)
    .join("\n");

  return `
    PATIENT CONDITION ASSESSMENT:
    Emergency Suspected: ${assessment.emergencyType}

    Observed Symptoms:
    ${formattedAnswers}

    IMPORTANT:
    These observations come from a non-medical bystander answering guided triage questions.
`;
}
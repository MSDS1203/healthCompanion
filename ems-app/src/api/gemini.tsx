import React, { useState, useEffect } from 'react';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';

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

const ai = new GoogleGenAI({ apiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY || '' });

export async function GeminiChatbot(request: string, retries = 3, delay = 1000) {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const response = await ai.models.generateContent({
                model: "gemini-3-flash-preview",
                contents: `
                    You are a certified first-aid assistant.

                    CRITICAL RULES:
                    - Assume that the user does not have any prior medical experience.
                    - Use ONLY the medical sources provided.
                    - Do NOT use outside knowledge.
                    - If information is not in the sources, say "Refer to official medical sources."
                    - Provide concise, safe, medically responsible guidance.
                    - Never give risky speculative advice.

                    Sources:
                    ${sources}

                    Query:
                    ${request}
                `,
                config: {
                    maxOutputTokens: 500,
                    temperature: 0.1,
                    topP: 0.8,
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
    const selectedSources = sources[emergency].join("\n");

    const prompt = `
        You are a certified first-aid assistant.

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
        ${context}
    `

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const response = await ai.models.generateContent({
                model: "gemini-3-flash-preview",
                contents: prompt,
                config: {
                    maxOutputTokens: 180,
                    temperature: 0.1,
                    topP: 0.8,
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

function getEmergency(context: string) {
    const c = context.toLowerCase();

    if (c.includes("stroke") || c.includes("fast")) return "stroke";
    if (c.includes("seizure") || c.includes("epilepsy")) return "seizure";
    if (c.includes("allergic") || c.includes("anaphylaxis")) return "allergic_reaction";
    if (c.includes("choking")) return "choking";
    if (c.includes("cardiac") || c.includes("cpr") || c.includes("heart")) return "cardiac_arrest";

    return "other";
}
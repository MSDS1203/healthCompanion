import React, { useState, useEffect } from 'react';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';

const ai = new GoogleGenAI({apiKey: ""});

export async function GeminiChatbot(request: string, retries = 3, delay = 1000) {
    for (let attempt = 1; attempt <= retries; attempt++ ) {
        try {
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: request,
                /* config: {
                    systemInstruction: ""
                } */
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


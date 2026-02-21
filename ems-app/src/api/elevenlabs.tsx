import { ElevenLabsClient, play } from '@elevenlabs/elevenlabs-js';
import { Readable } from 'stream';
import 'dotenv/config';


export default async function ElevenLabsScreen(query: string) {
    try{
        const elevenlabs = new ElevenLabsClient({
            apiKey: process.env.ELEVENLABS_API_KEY, // Defaults to process.env.ELEVENLABS_API_KEY
        });

        const audio = await elevenlabs.textToSpeech.convert(
        'JBFqnCBsd6RMkjVDRZzb', // voice_id
        {
            text: query,
            modelId: 'eleven_multilingual_v2',
            outputFormat: 'mp3_44100_128', // output_format
        }
        );

        const reader = audio.getReader();
        const stream = new Readable({
        async read() {
            const { done, value } = await reader.read();
            if (done) {
            this.push(null);
            } else {
            this.push(value);
            }
        },
        });

        await play(stream);
    } catch (error) {
        throw new Error(`Error in ElevenLabsScreen: ${error}`);
    }
}
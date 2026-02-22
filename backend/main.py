import io
import os
import base64
from dotenv import load_dotenv
from elevenlabs.client import ElevenLabs
from elevenlabs.play import play
from flask import Flask, send_file, request, jsonify
from flask_cors import CORS

load_dotenv()
app = Flask(__name__)
CORS(app)

elevenlabs = ElevenLabs(
  api_key=os.getenv("ELEVENLABS_API_KEY"),
)

@app.route("/generate-audio", methods=["POST"])
def generate_audio():
    data = request.json
    text = data.get("text") if data else None

    if not text:
        return {"error": "No text provided"}, 400

    audio_stream = elevenlabs.text_to_speech.stream(
        text=text,
        voice_id="JBFqnCBsd6RMkjVDRZzb",
        model_id="eleven_multilingual_v2",
        output_format="mp3_44100_128",
    )

    audio_bytes = b"".join(audio_stream)
    base64_audio = base64.b64encode(audio_bytes).decode('utf-8')

    return jsonify({
        "audio": base64_audio
    })

    return send_file(
        audio_io,
        mimetype="audio/mpeg",
    )
    
    
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
import io
import os
from dotenv import load_dotenv
from elevenlabs.client import ElevenLabs
from elevenlabs.play import play
from flask import Flask, send_file
from flask_cors import CORS

load_dotenv()
app = Flask(__name__)
CORS(app)

elevenlabs = ElevenLabs(
  api_key=os.getenv("ELEVENLABS_API_KEY"),
)

@app.route("/generate-audio")
def generate_audio():
    audio_stream = elevenlabs.text_to_speech.stream(
        text="The first move is what sets everything in motion.",
        voice_id="JBFqnCBsd6RMkjVDRZzb",
        model_id="eleven_multilingual_v2",
        output_format="mp3_44100_128",
    )

    audio_bytes = b"".join(audio_stream)
    audio_io = io.BytesIO(audio_bytes)
    audio_io.seek(0)

    return send_file(
        audio_io,
        mimetype="audio/mpeg",
        as_attachment=False,
        download_name="speech.mp3",
    )

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
import sys
import uuid
import os
import requests
from gtts import gTTS
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
from google.oauth2.service_account import Credentials
import json

# Load sensitive constants from environment variables
FOLDER_ID = os.getenv("GOOGLE_DRIVE_FOLDER_ID", "16FJ3cjCFcqbXXqi2YkUsx3lMzF9jXNdJ")
SERVICE_ACCOUNT_FILE = os.getenv("SERVICE_ACCOUNT_FILE", "/home/cpow/Desktop/video-generator-1/autocreate/app/gen-lang-client-0507264739-d75d11dcb90d.json")
OUTPUT_DIR = "output_audio_files"

# Ensure text input is provided
if len(sys.argv) < 2:
    print(json.dumps({"success": False, "error": "No text provided for TTS."}))
    sys.exit(1)

# Generate a unique UUID and create the output file path
text = sys.argv[1]
unique_id = str(uuid.uuid4())
os.makedirs(OUTPUT_DIR, exist_ok=True)
output_file = os.path.join(OUTPUT_DIR, f"{unique_id}.mp3")

# Generate TTS
try:
    tts = gTTS(text)
    tts.save(output_file)
except Exception as e:
    print(json.dumps({"success": False, "error": f"Failed to generate TTS: {e}"}))
    sys.exit(1)

# Function to upload file to Google Drive
def upload_to_google_drive(file_path, folder_id, service_account_file):
    try:
        credentials = Credentials.from_service_account_file(
            service_account_file,
            scopes=["https://www.googleapis.com/auth/drive"]
        )
        drive_service = build("drive", "v3", credentials=credentials)

        file_metadata = {"name": os.path.basename(file_path), "parents": [folder_id]}
        media = MediaFileUpload(file_path, mimetype="audio/mpeg")
        file = drive_service.files().create(
            body=file_metadata, media_body=media, fields="id, webContentLink"
        ).execute()

        drive_service.permissions().create(
            fileId=file["id"], body={"role": "reader", "type": "anyone"}
        ).execute()

        return {"file_id": file["id"], "web_content_link": file["webContentLink"]}
    except Exception as e:
        return {"error": f"Failed to upload to Google Drive: {e}"}

# Upload to Google Drive
drive_link_info = upload_to_google_drive(output_file, FOLDER_ID, SERVICE_ACCOUNT_FILE)
if "error" in drive_link_info:
    print(json.dumps({"success": False, "error": drive_link_info["error"]}))
    sys.exit(1)

# Upload to File.io
file_io_link = None
try:
    with open(output_file, "rb") as file_data:
        response = requests.post("https://file.io", files={"file": file_data})
        if response.status_code == 200:
            result = response.json()
            if result.get("success"):
                file_io_link = result["link"]
except requests.exceptions.RequestException as e:
    print(f"Error during file.io upload: {e}")

# Construct the final response
final_response = {
    "success": True,
    "filePath": os.path.abspath(output_file),
    "google_drive_link": drive_link_info.get("web_content_link"),
    "file_io_link": file_io_link,
}

# Ensure only JSON is printed
print(json.dumps(final_response))

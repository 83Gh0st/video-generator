import os
import requests
import uuid
import time
import json
import sys
from dotenv import load_dotenv
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
from google.oauth2.service_account import Credentials
from mimetypes import guess_type
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

# Load environment variables
load_dotenv("/home/cpow/Desktop/video-generator-1/autocreate/.env.local")

HF_API_TOKEN = os.getenv("HUGGING_FACE_API_KEY")
if not HF_API_TOKEN:
    logging.error("HUGGING_FACE_API_KEY is not set in the .env file.")
    sys.exit(1)

headers = {"Authorization": f"Bearer {HF_API_TOKEN}"}
API_URLS = [
    "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2",  # Stable Diffusion (as fallback)
    "https://api-inference.huggingface.co/models/CompVis/stable-diffusion-v1-4",  # Stable Diffusion 1.4
    "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5",  # Stable Diffusion 1.5
    "https://api-inference.huggingface.co/models/prompthero/openjourney-v4",  # OpenJourney (Stable Diffusion fine-tune)
    "https://api-inference.huggingface.co/models/nitrosocke/Ghibli-Diffusion",  # Ghibli-style model

]

# Google Drive credentials and folder ID
SERVICE_ACCOUNT_FILE = "/home/cpow/Desktop/video-generator-1/autocreate/app/gen-lang-client-0507264739-4028a1f616d8.json"
FOLDER_ID = "1GUK9KpNB1wwswIFcuO8hskElDUA7rf6B"
OUTPUT_DIR = "/home/cpow/Desktop/video-generator-1/autocreate/generated_images"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Generate image with retries
def generate_image(prompt, retries=5):
    for attempt in range(retries):
        for api_url in API_URLS:
            try:
                logging.info(f"Attempt {attempt + 1}/{retries} using {api_url}...")
                response = requests.post(api_url, headers=headers, json={"inputs": prompt}, timeout=60)
                if response.status_code == 200:
                    image_path = os.path.join(OUTPUT_DIR, f"{uuid.uuid4()}.png")
                    with open(image_path, "wb") as f:
                        f.write(response.content)
                    logging.info(f"Image saved: {image_path}")
                    return image_path
                elif response.status_code == 503:
                    logging.warning("Model loading, retrying in 30 seconds...")
                    time.sleep(30)
                else:
                    logging.error(f"API Error {response.status_code}: {response.text}")
            except requests.exceptions.RequestException as e:
                logging.error(f"Request failed: {e}")
    logging.error("Failed to generate an image after retries.")
    return None

# Upload image to Google Drive
def upload_to_google_drive(file_path):
    try:
        credentials = Credentials.from_service_account_file(SERVICE_ACCOUNT_FILE, scopes=["https://www.googleapis.com/auth/drive"])
        drive_service = build("drive", "v3", credentials=credentials)
        mime_type = guess_type(file_path)[0] or "application/octet-stream"
        file_metadata = {"name": os.path.basename(file_path), "parents": [FOLDER_ID]}
        media = MediaFileUpload(file_path, mimetype=mime_type)
        file = drive_service.files().create(body=file_metadata, media_body=media, fields="id, webContentLink").execute()
        drive_service.permissions().create(fileId=file["id"], body={"role": "reader", "type": "anyone"}).execute()
        logging.info(f"Uploaded to Google Drive: {file['webContentLink']}")
        return file["webContentLink"]
    except Exception as e:
        logging.error(f"Failed to upload {file_path}: {e}")
        return None

def main():
    if len(sys.argv) < 2:
        logging.error("Usage: python script.py <prompt>")
        sys.exit(1)

    prompt = sys.argv[1]
    generated_image = generate_image(prompt)
    if generated_image:
        image_google_url = upload_to_google_drive(generated_image)
        if image_google_url:
            # Print the URL to stdout so it can be captured by the caller
            print(image_google_url)
            return image_google_url
        else:
            logging.error("Failed to upload image to Google Drive.")
            sys.exit(1)
    else:
        logging.error("Failed to generate image.")
        sys.exit(1)

if __name__ == "__main__":
    main()
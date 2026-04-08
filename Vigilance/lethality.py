import cv2
import numpy as np
from ultralytics import YOLO
import cohere
from gtts import gTTS
import pygame
import os

# Initialize Cohere API

co = cohere.Client(COHERE_API_KEY)

# Object detection
def detect_objects(image, model):
    results = model(image)
    detections = results[0].boxes.data.cpu().numpy()

    labels_map = {
        0: "Shotguns",
        1: "Assault Rifle",
        2: "LMGs",
        3: "Pistols",
        4: "SMGs",
        5: "Snipers",
        6: "Throwables"
    }

    detected_labels = []

    for detection in detections:
        _, _, _, _, confidence, class_id = detection
        label = labels_map.get(int(class_id), "Unauthorized")
        detected_labels.append(f"{label} ({confidence:.2f})")

    return detected_labels

# Process image and detect weapons
def process_image(image_path, model_path="final_weapons.pt"):
    model = YOLO(model_path)  
    image = cv2.imread(image_path)
    
    if image is None:
        print("Error: Unable to load image.")
        return None

    detected_labels = detect_objects(image, model)
    return detected_labels

# Generate tactical defense guidance
def generate_defense_guidance(weapon):
    try:
        prompt = (f"I am a soldier spotting an enemy armed with a {weapon}. Provide a rapid, effective response including, make entire sentences, within 200 words: "
                  "tactical escape strategies, and survival techniques to neutralize or evade the threat.")        
        response = co.generate(
            model="command-xlarge-nightly",
            prompt=prompt,
            max_tokens=500,  # Increased max tokens for better completion
            temperature=0.5,
            stop_sequences=["###"]
        )
        
        return response.generations[0].text.strip()
    
    except Exception as e:
        return f"Error generating guidance: {str(e)}"

# Translate guidance to Hindi (Ensuring completeness)
def translate_to_hindi(text):
    try:
        prompt = (f"Translate the following English text to Hindi in a complete, fluent, and structured manner. Ensure no information is lost:\n\n{text}")
        
        response = co.generate(
            model="command-xlarge-nightly",
            prompt=prompt,
            max_tokens=500  # Increased to prevent incomplete translations
        )
        return response.generations[0].text.strip()
    
    except Exception as e:
        return f"Error translating: {str(e)}"

# Summarize Hindi guidance to 100 words
def summarize_text(text):
    try:
        response = co.generate(
            model="command-xlarge-nightly",
            prompt=f"Summarize the following text in 100 words in Hindi while keeping all key details:\n\n{text}",
            max_tokens=250  # Adjusted for better summarization
        )
        return response.generations[0].text.strip()
    
    except Exception as e:
        return f"Error summarizing: {str(e)}"

# Convert Hindi text to speech and play it
def speak_text_hindi(text):
    try:
        temp_audio_path = "temp_audio.mp3"
        tts = gTTS(text=text, lang="hi", slow=False)  # Ensure normal speed
        tts.save(temp_audio_path)  # Save the audio file

        # Initialize pygame mixer
        pygame.mixer.init()
        pygame.mixer.music.load(temp_audio_path)
        pygame.mixer.music.play()

        # Wait for audio to finish
        while pygame.mixer.music.get_busy():
            pygame.time.Clock().tick(10)

        # Quit mixer and remove file after playing
        pygame.mixer.quit()
        os.remove(temp_audio_path)

    except Exception as e:
        print(f"Error in playing audio: {str(e)}")

if __name__ == "__main__":
    detected_weapons = process_image("armysniper.jpeg")
    
    if detected_weapons:
        weapon = detected_weapons[0]  # Take first detected weapon
        print("Detected Weapon:", weapon)
        
        guidance = generate_defense_guidance(weapon)
        print("\nEnglish Guidance:\n", guidance)
        
        hindi_guidance = translate_to_hindi(guidance)  # More complete translation
        summarized_hindi = summarize_text(hindi_guidance)
        
        print("\nHindi Summary (100 words):\n", summarized_hindi)
        
        speak_text_hindi(summarized_hindi)  # Convert to speech and play
    else:
        print("No weapons detected.")

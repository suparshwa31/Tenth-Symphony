from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from urllib.parse import urljoin
import requests

# This is a simple api's which we have created but once all the models are 
# generated we will updated the functionality accordingly.

# Importing deps for image prediction
from tensorflow.keras.preprocessing import image
from PIL import Image
import numpy as np
from tensorflow.keras.models import load_model

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}) # url where the forntend is hosted

@app.route("/")
def home():
    return {"message": "Hello from backend"}

@app.route("/upload", methods=['POST'])
def upload():
    file = request.files['file']
    file.save('uploads/' + file.filename)

    # Load the image to predict
    img_path = f"./uploads/{file.filename}"
    img = image.load_img(img_path, target_size=(150, 150))
    x = image.img_to_array(img)
    x = np.expand_dims(x, axis=0)
    x /= 255

    loaded_model = load_model('')  #moidel path

    # Make the prediction
    prediction = loaded_model.predict(x)
    if os.path.exists(f"./uploads/{file.filename}"):
        os.remove(f"uploads/{file.filename}")
    print(prediction)

@app.route('/download/<file.filename>', methods=['GET'])
def download():
    video_url = ""  # Replace with your video URL
    file_name = file.filename  # The desired file name for the downloaded video

    # Send an HTTP GET request to the video URL
    response = requests.get(video_url, stream=True)

    if response.status_code == 200:
        # Open the file with the desired file name in binary write mode
        with open(file_name, 'wb') as f:
            for chunk in response.iter_content(chunk_size=1024):
                if chunk:
                    f.write(chunk)
        print(f"Video downloaded as {file_name}")
    else:
        print("Failed to download the video")


if __name__ == '__main__':
    app.run(debug=True)
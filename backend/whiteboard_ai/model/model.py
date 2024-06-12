import cv2
import numpy as np
import tensorflow as tf

CLASSES = {0: "other", 1: "ellipse", 2: "rectangle", 3: "triangle"}


class ModelLoader:
    def __init__(self, model_path: str):
        self.model = tf.keras.models.load_model(model_path)

    def classify(self, image_path: str) -> tuple[str, float]:
        image = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
        # Export image to check
        cv2.imwrite("temp/loaded_img.png", image)

        # Normalize image and expand dimensions
        image = image / 255.0
        image_expanded = np.expand_dims(image, axis=[0, -1])

        predictions = self.model.predict(image_expanded)

        class_id = np.argmax(predictions, axis=1)[0]
        likelihood = predictions[0][class_id]

        class_name = CLASSES[class_id]

        print(f"Predicted class: {class_name}, Likelihood: {likelihood}")

        return class_name, float(likelihood)

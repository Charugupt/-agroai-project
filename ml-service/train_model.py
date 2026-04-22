import tensorflow as tf
from tensorflow.keras import layers, models
import os

def build_model(input_shape=(128, 128, 3), num_classes=6):
    model = models.Sequential([
        layers.Conv2D(32, (3, 3), activation='relu', input_shape=input_shape),
        layers.MaxPooling2D((2, 2)),
        layers.Conv2D(64, (3, 3), activation='relu'),
        layers.MaxPooling2D((2, 2)),
        layers.Conv2D(128, (3, 3), activation='relu'),
        layers.MaxPooling2D((2, 2)),
        layers.Flatten(),
        layers.Dense(128, activation='relu'),
        layers.Dropout(0.5),
        layers.Dense(num_classes, activation='softmax')
    ])
    
    model.compile(optimizer='adam',
                  loss='sparse_categorical_crossentropy',
                  metrics=['accuracy'])
    return model

if __name__ == "__main__":
    print("Building AgroAI CNN Model...")
    model = build_model()
    model.summary()
    
    # Save the model
    model_path = os.path.join(os.path.dirname(__file__), 'plant_disease_model.h5')
    model.save(model_path)
    print(f"Model saved to {model_path}")
    print("Note: This is an architectural shell. In a production environment, you would train this on the PlantVillage dataset.")

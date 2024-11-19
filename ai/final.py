import os
from time import sleep

import cv2
import matplotlib.pyplot as plt
import numpy as np
import tensorflow as tf
from tensorflow.keras.callbacks import ReduceLROnPlateau
from tensorflow.keras.layers import (
    Activation,
    BatchNormalization,
    Conv2D,
    Dense,
    Dropout,
    Flatten,
    Input,
    MaxPooling2D,
)
from tensorflow.keras.models import Model
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.utils import to_categorical

main_dir = "data/"
img_size = 70

train_images = []
train_labels = []
validation_images = []
validation_labels = []
test_images = []
test_labels = []
class_names = {}
class_index = 0

# Classes and their corresponding indexes
shape_classes = {
    "other": 0,
    "ellipse": 1,
    "rectangle": 2,
    "triangle": 3,
}
num_classes = len(shape_classes)


# Owner recommends to use the following users
validation_users = ["crt", "il1", "lts", "mrt", "nae"]
test_users = ["u01", "u17", "u18", "u19"]


def pre_process_image(image_path):
    """Pre-process the image, load it, grayscale it, and resize it"""
    image = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
    image = cv2.resize(image, (img_size, img_size))
    return image


def process_directory(directory, images, labels):
    """Process the directory and add images to the specified set"""
    print(f"Processing directory: {directory}")
    for shape_type in os.listdir(directory):
        for img in os.listdir(directory + shape_type):
            if not img.endswith(".png") and not img.endswith(".jpg"):
                continue
            full_path = os.path.join(directory, shape_type, img)
            image = pre_process_image(full_path)
            images.append(image)
            labels.append(shape_classes[os.path.basename(shape_type)])


def walk_training_data():
    """Walk on the data directory and process the images"""
    print("Walking on the data directory...")
    # input("Press enter to continue...")
    for directory in os.listdir(main_dir):
        if directory in validation_users or directory in test_users:
            continue
        process_directory(main_dir + directory + "/images/", train_images, train_labels)


def prepare_data_for_training():
    """Prepare the whole data for training"""
    print("Preparing data for training...")
    # input("Press enter to continue...")
    global train_images, train_labels, validation_images, validation_labels, test_images, test_labels
    train_images = np.array(train_images) / 255.0
    train_labels = np.array(train_labels)

    validation_images = np.array(validation_images) / 255.0
    validation_labels = np.array(validation_labels)

    test_images = np.array(test_images) / 255.0
    test_labels = np.array(test_labels)


def prepare_validation_data():
    """Prepare data for validation"""
    print("Preparing data for validation...")
    # input("Press enter to continue...")
    for directory in validation_users:
        process_directory(
            main_dir + "user." + directory + "/images/",
            validation_images,
            validation_labels,
        )


def prepare_test_data():
    """Prepare data for testing"""
    print("Preparing data for testing...")
    # input("Press enter to continue...")
    for directory in test_users:
        process_directory(
            main_dir + "user." + directory + "/images/", test_images, test_labels
        )


def test_model(model):
    # Test the model and build confusion matrix
    print("Testing model...")
    X_test = test_images.reshape(-1, img_size, img_size, 1)
    Y_test = to_categorical(test_labels, num_classes=num_classes)

    test_loss, test_acc = model.evaluate(X_test, Y_test)

    print("Test accuracy:", test_acc)


def visualize_tests(model):
    import matplotlib.pyplot as plt
    import seaborn as sns
    from sklearn.metrics import confusion_matrix  # type: ignore

    X_test = test_images.reshape(-1, img_size, img_size, 1)
    Y_test = to_categorical(test_labels, num_classes=num_classes)

    Y_pred = model.predict(X_test)
    Y_pred_classes = np.argmax(Y_pred, axis=1)
    Y_true = np.argmax(Y_test, axis=1)

    cm = confusion_matrix(Y_true, Y_pred_classes)

    sorted_classes = sorted(shape_classes.items(), key=lambda item: item[1])
    class_labels = [item[0] for item in sorted_classes]

    plt.figure(figsize=(10, 8))
    ax = sns.heatmap(
        cm,
        annot=True,
        fmt="d",
        cmap="Blues",
        xticklabels=class_labels,
        yticklabels=class_labels,
    )
    ax.invert_yaxis()
    plt.xlabel("Predicted Label")
    plt.ylabel("True Label")
    plt.title("Confusion Matrix")
    plt.show()


def mish(x):
    # Mish Activation Function
    # Mish is a novel activation function proposed by Misra (2019). It is defined as x * tanh(softplus(x)).
    # The function aims to provide better performance by facilitating smoother and deeper information propagation without saturation.
    # Its non-monotonic nature helps in reducing the risk of dead neurons and encourages a more efficient learning process.
    return x * tf.math.tanh(tf.math.softplus(x))


def build_model():
    # Define the input layer with the shape of the images
    # This is the first layer of the network, where we specify the dimensions of the input images (height, width, channels).
    # img_size should match the dimensions of the images in your dataset, and '1' indicates grayscale images. For RGB images, this would be 3.
    input_img = Input(shape=(img_size, img_size, 1))

    # First Convolutional Block
    # Convolutional layers are the core building blocks of a CNN. They perform convolution operations, learning features from the input images.
    # A 32 filter with a (3,3) kernel size is a common choice for the first layer, aiming to capture basic patterns such as edges and corners.
    # Padding="same" ensures the output has the same width and height as the input, providing a way to preserve spatial dimensions after convolution.
    x = Conv2D(32, (3, 3), padding="same")(input_img)

    # Batch Normalization
    # Batch normalization is used to normalize the inputs of each layer. It stabilizes the learning process and dramatically reduces the number of training epochs required to train deep networks.
    x = BatchNormalization()(x)

    # Activation - Mish
    # After normalization, we apply the Mish activation function to introduce non-linearity, allowing the network to learn complex patterns.
    # Mish is a novel activation function and provides better performance compared to traditional functions like ReLU or Sigmoid.
    x = Activation(mish)(x)

    # MaxPooling
    # MaxPooling reduces the spatial dimensions (height and width) of the input volume for the next convolutional layer. It helps in reducing computation, and it also helps in extracting robust features.
    x = MaxPooling2D(pool_size=(2, 2))(x)

    # Dropout
    # Dropout is a regularization technique where randomly selected neurons are ignored during training, reducing the risk of overfitting.
    # A rate of 0.25 means 25% of the nodes are dropped out, chosen empirically to balance between regularization and retaining network capacity.
    x = Dropout(0.25)(x)

    # Subsequent Convolutional Blocks
    # Similar blocks are stacked, with increasing filter sizes to capture more complex patterns. A common practice is to double the number of filters, this provided better performance.
    # This increase reflects the idea that the higher up we go in the network, the more complex and abstract the features should become.
    # The choices of kernel sizes, padding, activation functions, and dropout rates follow the same rationale as above.
    filters = [32, 64, 64, 128, 128]
    for f in filters:
        x = Conv2D(f, (3, 3), padding="same")(x)
        x = BatchNormalization()(x)
        x = Activation(mish)(x)

        # Only apply MaxPooling and Dropout for more complex patterns
        # We don't apply MaxPooling and Dropout for the first two blocks to keep the basic features of the image (edges, corners, etc.) intact.
        # For the subsequent blocks, we apply MaxPooling and Dropout to reduce the spatial dimensions and prevent overfitting.
        # The maxpooling is more effective for larger filter sizes, as they are the ones which require more computation.
        if f in [64, 128]:
            x = MaxPooling2D(pool_size=(2, 2))(x)
            x = Dropout(0.25)(x)

    # Flatten
    # Before connecting to a fully connected (Dense) layer, the feature maps must be flattened into a single vector.
    x = Flatten()(x)

    # Fully Connected Layer
    # Dense layers perform classification based on the features extracted and downsampled by the convolutional and pooling layers.
    # A size of 200 neurons is chosen as a balance between model complexity and computational efficiency.
    x = Dense(200)(x)
    x = BatchNormalization()(x)
    x = Activation(mish)(x)
    x = Dropout(0.3)(x)

    # Output Layer
    # The final layer is a Dense layer with a number of neurons equal to the number of classes in the dataset. Softmax activation is used for multi-class classification.
    output = Dense(num_classes, activation="softmax")(x)

    # Model Compilation
    # Adam optimizer is used with its default learning rate, which is found to be effective across a variety of tasks.
    # The choice of the loss function, categorical_crossentropy, is standard for multi-class classification problems.
    model = Model(inputs=input_img, outputs=output)
    optimizer = Adam(
        learning_rate=2e-3,
        beta_1=0.9,
        beta_2=0.999,
        epsilon=1e-08,
        amsgrad=False,
    )
    model.compile(
        optimizer=optimizer, loss="categorical_crossentropy", metrics=["accuracy"]
    )

    # Model Summary
    model.summary()

    return model


def train_model(model):
    # Data Augmentation
    # Data augmentation is crucial for training deep learning models. It helps in making the model robust to slight variations and prevents overfitting.
    # The chosen parameters for rotation, zoom, and flips are standard practices to introduce variability in the training data without altering the semantics of the images.
    datagen = ImageDataGenerator(
        rotation_range=180,
        zoom_range=[0.98, 1.02],
        width_shift_range=0.1,
        height_shift_range=0.1,
        horizontal_flip=True,
        vertical_flip=True,
    )

    # Learning Rate Scheduler
    # ReduceLROnPlateau reduces the learning rate when a metric has stopped improving, which in this case is the validation loss.
    # This helps in fine-tuning the model when it's close to convergence, avoiding overshooting minima due to a high learning rate.
    reduce_lr = ReduceLROnPlateau(
        monitor="val_loss", factor=0.2, patience=5, min_lr=0.001
    )

    train_X = train_images
    train_y = train_labels

    val_X = validation_images
    val_y = validation_labels

    X_train = train_X.reshape(-1, img_size, img_size, 1)
    X_val = val_X.reshape(-1, img_size, img_size, 1)

    Y_train = to_categorical(train_y, num_classes=num_classes)
    Y_val = to_categorical(val_y, num_classes=num_classes)

    print("Training model...")
    epochs = 10
    # Add the reduce_lr callback to model.fit()
    model.fit(
        datagen.flow(X_train, Y_train),
        epochs=epochs,
        validation_data=(X_val, Y_val),
        callbacks=[reduce_lr],
    )

    print("Model trained successfully!")

    return model


def save_model(model):
    model_save_path = "save/final.keras"
    model.save(model_save_path)
    print(f"Model saved in SavedModel format at: {model_save_path}")


def main():
    walk_training_data()
    prepare_validation_data()
    prepare_test_data()
    prepare_data_for_training()
    model = build_model()
    model = train_model(model)
    save_model(model)
    test_model(model)


if __name__ == "__main__":
    main()

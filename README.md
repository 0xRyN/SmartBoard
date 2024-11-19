Noté **meilleur projet de master de l'année**
[Soutenance et présentation en français ici](https://github.com/0xRyN/SmartBoard/blob/master/SmartBoard%20-%20Pr%C3%A9sentation.pdf)

# Academic Project - Masters Degree at U-Paris

**Awarded best student project of the year**

# Detailed Project Breakthrough

### Installation instructions :

This project consists of 3 subprojects. Every subproject has their own installation instructions in an INSTALLATION.md inside every specific subdirectory.

## I. AI Model and Training

### Specific subdirectory : ai

This is the subproject responsible of extracting, transforming and loading the training data in an acceptable format, building the model, training it, and testing it.

This is meant to be ran once, to build the model, train weights and biases, and export it into a .keras format in the "save" directory.

After training the model, specify the exported model + weights and biases path, MODEL_PATH to the backend project.

**The model uses state of the art techniques to classify shapes, thought process, ETL, scientific research, training, testing and everything related to the AI is explained and can be done interactively, step by step, in the `ai\Whiteboard CNN Model.ipynb` notebook.**

### Technologies used:

- Tensorflow for building, training and testing the model.

- OpenCV2 for loading the images into Python and exporting them easily.

- Matplotlib to display data visually. Only used for testing, not needed for functionnality.

## II. Websocket Backend Server with Model Connection

### Specific subdirectory : backend

This is the subproject responsible of starting a blazingly fast websocket server to communicate with the frontend.

It will, asynchronously :

1. Load the model exported by the first subproject.

2. Start a fast websocket server.

3. Receive shape data from the client as a list of `points(x, y)`.

4. Transform the points from the client's coordinate system (different for each device) to it's own coordinate system (final image size that the user chooses in `utils/consts.py`), transform them to `Stroke` objects (using `Point` class).

5. Scale the points to the specified size, acceptable for the model.

6. Creates an image based on the specified size and the scaled points.

7. Grayscale, normalize and apply middleware to the image to make model prediction easier.

8. Ask the model for a predicion on the final image. Parse the prediction data to get the likelihood of a prediction and the predicted class.

9. Send the predicted class and it's likelyhood back to the client, and prepare for the next request.

There are no magic numbers. You can customize functionality using the `util/consts.py`.

### Technologies used:

- Tensorflow for loading the model and asking it for predictions.

- OpenCV2 for loading the images into Python and exporting them easily.

- Pillow to export a .png image from a 2D array of pixels.

- Websockets to allow for blazingly fast client response and communication.

## III. Frontend Whiteboard App

This is the bread and butter of this project. Using Canvas2D (low level graphics library), build a whiteboard, and makes it interactive for the user.

**Every functionality is built from scratch, a Canvas2D just allows for drawing on pixels.**

The architecture and the model are extensive, starting from a Stroke which is just a set of points to multiple kinds of shapes, interoperable interfaces like Achorable (shapes) and Linkable (strokes) that connect together, middleware applied after every drawing etc...

- Contains the UI that allows the user to draw, erase, select, undo, redo, and all the functions you would like to see on a professional whiteboard.

- Performs all the necessary math, be it basic math like calculating distances a and angles and performing trigonometry between points, or more complicated stuff like angle standard derivation and linear regression to adjust a line that is almost straight for example.

- Implements PCA (Principal Component Analysis) to use the AI classification model to detect the size and the rotation of the detected shape. This is done by applying PCA to the points of the detected shape. The output shape is extremely close to the hand-drawn shape, no matter the size and the rotation of the shape.

- Performs all the necessary re-rendering and state management like a basic OpenGL game loop does, needed for having an interactive whiteboard (instant feedback when drawing) that allows for limitless functionality.

- Has a global custom written event listener that uses the Observer pattern and allows any part of the whiteboard to interact with the user input. Works with mouse inputs and keyboard inputs, registering an event with a callback is done very easily.

- Has a tool model, uses BoardTool to allow changing to tools like Pen, Eraser, Selector, Text instantly and instantly giving them access to the user's actions, making use of the event listener above.

- Has a middleware system, that applies a set of middleware in order after the user is finished drawing a stroke. For example, it may apply a classifiying middleware to check with the backend if the stroke looks like a shape, then if not done, apply an anchoring middleware to connect a stroke to another shape if applicable, then if not done, apply a stroke adjuster middleware to adjust a stroke to a line if it is "almost" a line.

- Model is large and expendable, makes use of interfaces, abstract classes, inheritence and composition a lot. Some interfaces / abstract classes include Anchorable, Linkable, Drawable, Movable, Rotatable. Some primitive classes include Point, Segment, Stroke, Shape, Rectangle and others that inherit from Shape.

- No magic numbers. All constants are in the `util/consts.ts`. Useful math functions are in `util/math.ts`.

- Uses TypeScript with no `Any` types. Every function and every class is properly typed and statically checked for correctness.

- Uses React to offer the user a better user experience. React is only used for the UI, it has no relation with the model.

### Technologies used:

- Typescript was used for the type correctness and the static analysis of code.

- Canvas2D - Low level graphics library for the browser. Allows for drawing pixels, changing colors, and basic lines.

- Websockets to allow for blazingly fast classification and server communcation.

- React to design a beautiful UI and improve UX.

import asyncio
import base64
import json
import traceback

import socketio
from whiteboard_ai.core.ImageGenerator import ImageGenerator
from whiteboard_ai.core.primitives.Point import Point
from whiteboard_ai.core.primitives.Stroke import Stroke
from whiteboard_ai.model.model import ModelLoader


class WebSocketServer:
    def __init__(self, host: str, port: int, model_loader: ModelLoader):
        self.host = host
        self.port = port
        self.model_loader = model_loader
        self.sio = socketio.AsyncServer(
            async_mode="asgi", cors_allowed_origins="*"
        )  # Disable CORS
        self.app = socketio.ASGIApp(self.sio)

    async def connect(self, sid, environ, auth):
        print("Client connected:", sid)
        await self.sio.emit("message", {"data": "Connected"}, to=sid)

    async def disconnect(self, sid):
        print("Client disconnected:", sid)

    async def classify(self, sid, data):
        try:
            response = await self.handle_classify(data)
        except Exception as e:
            response = {"error": str(e)}
            traceback.print_exc()
        await self.sio.emit("classification", response, to=sid)

    async def handle_classify(self, data):
        point_list = [Point(point["x"], point["y"]) for point in data["points"]]

        stroke = Stroke(point_list)

        # Generate image from stroke
        image_generator = ImageGenerator(dimensions=(70, 70))
        image = image_generator.generate_image(stroke)
        exported_path = image_generator.export_image(image)
        print(f"Exported image to {exported_path}")

        # Load image and classify
        prediction, likelihood = self.model_loader.classify(exported_path)

        # Return response
        return {"classification": {"prediction": prediction, "confidence": likelihood}}

    def run(self):
        self.sio.event(self.connect)
        self.sio.event(self.disconnect)
        self.sio.event(self.classify)
        import uvicorn

        uvicorn.run(self.app, host=self.host, port=self.port)

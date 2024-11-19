from whiteboard_ai.model.model import ModelLoader
from whiteboard_ai.server.WebsocketServer import WebSocketServer

MODEL_PATH = "../ai/save/final.keras"


def main():
    model = ModelLoader(MODEL_PATH)
    server = WebSocketServer("localhost", 8765, model)
    server.run()


if __name__ == "__main__":
    main()

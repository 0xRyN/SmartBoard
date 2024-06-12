import os
from typing import Tuple

from PIL import Image, ImageDraw
from whiteboard_ai.core.primitives.Point import Point
from whiteboard_ai.core.primitives.Stroke import Stroke
from whiteboard_ai.util.consts import (
    GEN_IMG_BG_COLOR,
    GEN_IMG_HEIGHT,
    GEN_IMG_PADDING,
    GEN_IMG_STROKE_COLOR,
    GEN_IMG_STROKE_WIDTH,
    GEN_IMG_WIDTH,
)


class ImageGenerator:
    def __init__(
        self,
        dimensions: Tuple[int, int] = (GEN_IMG_WIDTH, GEN_IMG_HEIGHT),
        background_color: str = GEN_IMG_BG_COLOR,
        stroke_color: str = GEN_IMG_STROKE_COLOR,
        stroke_width: int = GEN_IMG_STROKE_WIDTH,
    ):

        self.dimensions = dimensions
        self.background_color = background_color
        self.stroke_color = stroke_color
        self.stroke_width = stroke_width

    def _scale_stroke(self, stroke) -> Stroke:
        """
        Scales the stroke to adapt it to the model's input dimensions
        """
        points = list(stroke)
        max_x = max(point.x for point in points)
        max_y = max(point.y for point in points)
        min_x = min(point.x for point in points)
        min_y = min(point.y for point in points)

        target_width = self.dimensions[0] - GEN_IMG_PADDING
        target_height = self.dimensions[1] - GEN_IMG_PADDING

        scale_x = target_width / (max_x - min_x + 1)  # Avoid division by zero
        scale_y = target_height / (max_y - min_y + 1)
        scale_factor = min(scale_x, scale_y)

        translate_x = (self.dimensions[0] - (max_x - min_x) * scale_factor) / 2
        translate_y = (self.dimensions[1] - (max_y - min_y) * scale_factor) / 2

        scaled_points = [
            Point(
                (point.x - min_x) * scale_factor + translate_x,
                (point.y - min_y) * scale_factor + translate_y,
            )
            for point in points
        ]

        return Stroke(scaled_points)

    def generate_image(self, stroke):
        image = Image.new("RGB", self.dimensions, self.background_color)
        draw = ImageDraw.Draw(image)

        if len(stroke) > 1:
            scaled_stroke = self._scale_stroke(stroke)
            scaled_points = [(point.x, point.y) for point in scaled_stroke]
            draw.line(scaled_points, fill=self.stroke_color, width=self.stroke_width)

        return image

    def export_image(self, image: Image.Image, path: str = "temp/gen_img.png"):
        # Ensure the directory exists
        os.makedirs(os.path.dirname(path), exist_ok=True)
        image.save(path)
        return path

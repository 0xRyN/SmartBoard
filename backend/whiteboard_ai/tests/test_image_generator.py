import os
import unittest

from whiteboard_ai.core.ImageGenerator import ImageGenerator
from whiteboard_ai.core.primitives.Point import Point
from whiteboard_ai.core.primitives.Stroke import Stroke
from whiteboard_ai.util.consts import (
    GEN_IMG_BG_COLOR,
    GEN_IMG_HEIGHT,
    GEN_IMG_STROKE_COLOR,
    GEN_IMG_STROKE_WIDTH,
    GEN_IMG_WIDTH,
)


class TestImageGenerator(unittest.TestCase):
    def test_initialization(self):
        generator = ImageGenerator()
        self.assertEqual(generator.dimensions, (GEN_IMG_WIDTH, GEN_IMG_HEIGHT))
        self.assertEqual(generator.background_color, GEN_IMG_BG_COLOR)
        self.assertEqual(generator.stroke_color, GEN_IMG_STROKE_COLOR)
        self.assertEqual(generator.stroke_width, GEN_IMG_STROKE_WIDTH)

    def test_scale_stroke(self):
        points = [Point(0, 0), Point(50, 50)]
        stroke = Stroke(points)
        generator = ImageGenerator()

        scaled_stroke = generator._scale_stroke(stroke)
        expected_scale_factor = GEN_IMG_WIDTH / 51
        expected_points = [
            Point(0 * expected_scale_factor, 0 * expected_scale_factor),
            Point(50 * expected_scale_factor, 50 * expected_scale_factor),
        ]

        for original, expected in zip(scaled_stroke, expected_points):
            self.assertAlmostEqual(original.x, expected.x)
            self.assertAlmostEqual(original.y, expected.y)

    def test_generate_image(self):
        points = [Point(0, 0), Point(50, 50)]
        stroke = Stroke(points)
        generator = ImageGenerator()

        image = generator.generate_image(stroke)
        self.assertEqual(image.size, generator.dimensions)

    def test_export_image(self):
        # Draw a stroke in the browser, copy the points and paste them for util/point_parser_from_browser.py
        # It will generate a string that you can copy and paste here

        points = [
            Point(389, 534),
            Point(389, 533),
            Point(388, 529),
            Point(388, 522),
            Point(388, 515),
            Point(390, 505),
            Point(392, 496),
            Point(395, 486),
            Point(399, 475),
            Point(404, 462),
            Point(411, 449),
            Point(419, 435),
            Point(426, 422),
            Point(437, 408),
            Point(448, 394),
            Point(461, 380),
            Point(477, 366),
            Point(487, 358),
            Point(499, 349),
            Point(510, 343),
            Point(526, 335),
            Point(538, 330),
            Point(549, 327),
            Point(562, 324),
            Point(571, 322),
            Point(584, 322),
            Point(593, 322),
            Point(604, 323),
            Point(611, 326),
            Point(620, 330),
            Point(630, 336),
            Point(639, 344),
            Point(649, 355),
            Point(659, 367),
            Point(671, 384),
            Point(678, 395),
            Point(687, 412),
            Point(696, 428),
            Point(705, 445),
            Point(714, 462),
            Point(723, 477),
            Point(731, 488),
            Point(742, 501),
            Point(755, 511),
            Point(765, 516),
            Point(775, 519),
            Point(788, 522),
            Point(801, 522),
            Point(819, 521),
            Point(831, 519),
            Point(850, 513),
            Point(867, 505),
            Point(884, 496),
            Point(899, 486),
            Point(911, 477),
            Point(926, 464),
            Point(935, 455),
            Point(946, 443),
            Point(958, 426),
            Point(966, 412),
            Point(974, 399),
            Point(980, 387),
            Point(987, 373),
            Point(991, 364),
            Point(995, 353),
            Point(998, 344),
            Point(1001, 336),
            Point(1003, 328),
            Point(1004, 322),
            Point(1005, 318),
            Point(1006, 314),
            Point(1006, 313),
            Point(1006, 312),
            Point(1006, 313),
            Point(1006, 314),
            Point(1005, 316),
            Point(1003, 322),
            Point(1001, 328),
            Point(1000, 336),
            Point(1000, 344),
            Point(999, 356),
            Point(999, 364),
            Point(999, 376),
            Point(999, 389),
            Point(1001, 401),
            Point(1003, 414),
            Point(1006, 429),
            Point(1009, 440),
            Point(1014, 458),
            Point(1019, 471),
            Point(1023, 485),
            Point(1029, 500),
            Point(1033, 508),
            Point(1036, 515),
            Point(1039, 519),
            Point(1041, 522),
            Point(1042, 524),
        ]

        stroke = Stroke(points)
        generator = ImageGenerator((200, 200))
        image = generator.generate_image(stroke)
        generator.export_image(image, "temp/test_export_image.png")

        self.assertTrue(os.path.exists("temp/test_export_image.png"))


if __name__ == "__main__":
    unittest.main()

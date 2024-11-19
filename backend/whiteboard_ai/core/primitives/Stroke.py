from typing import Iterator, List

from whiteboard_ai.core.primitives.Point import Point


class Stroke:
    def __init__(self, points: List[Point]) -> None:
        self.points = points

    def __str__(self) -> str:
        return f"Stroke({self.points})"

    def __repr__(self) -> str:
        return f"Stroke({self.points})"

    def __len__(self) -> int:
        return len(self.points)

    def __getitem__(self, item: int) -> Point:
        return self.points[item]

    def __setitem__(self, key: int, value: Point) -> None:
        self.points[key] = value

    def __iter__(self) -> Iterator[Point]:
        return iter(self.points)

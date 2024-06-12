import { Point } from '../primitives/Point';
import { Vector2 } from '../util/maths';
import Movable from './Movable';

export default abstract class Drawable implements Movable {
    abstract draw(ctx: CanvasRenderingContext2D): void;
    abstract hasPoint(point: Point): boolean;
    abstract getCenter(): Point;
    abstract move(vector: Vector2): void;
    abstract getBoundingBox(): {
        x: number;
        y: number;
        width: number;
        height: number;
    };
}

import Anchorable from '../interfaces/Anchorable';
import Drawable from '../interfaces/Drawable';
import { ANCHOR_COLOR, ANCHOR_RADIUS } from '../util/consts';
import { Vector2 } from '../util/maths';
import { Point } from './Point';

// TODO: Shape implements drawable
export abstract class Shape implements Anchorable, Drawable {
    anchors: Array<Point> = [];
    static count = 0;
    protected id: number;
    constructor(public startPoint: Point) {
        this.id = Shape.count++;
    }

    abstract toString(): string;

    abstract draw(ctx: CanvasRenderingContext2D): void;
    abstract hasPoint(point: Point): boolean;
    abstract getCenter(): Point;
    abstract getBoundingBox(): {
        x: number;
        y: number;
        width: number;
        height: number;
    };

    abstract setupAnchors(): void;
    protected drawAnchors(ctx: CanvasRenderingContext2D): void {
        this.anchors.forEach((anchor) => {
            ctx.save();
            ctx.fillStyle = ANCHOR_COLOR;
            ctx.beginPath();
            ctx.arc(anchor.x, anchor.y, ANCHOR_RADIUS, 0, 2 * Math.PI);
            ctx.fill();
            ctx.restore();
        });
    }

    getAnchors(): Array<Point> {
        return Array.from(this.anchors);
    }

    move(vector: Vector2): void {
        this.startPoint.x += vector.x;
        this.startPoint.y += vector.y;

        this.setupAnchors();
    }

    equals(shape: Shape): boolean {
        return this.startPoint.equals(shape.startPoint);
    }
}

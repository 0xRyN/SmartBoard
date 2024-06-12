import Anchorable from '../interfaces/Anchorable';
import Drawable from '../interfaces/Drawable';
import Linkable from '../interfaces/Linkable';
import { Vector2 } from '../util/maths';
import { Point } from './Point';

export class Arrow implements Linkable, Drawable {
    private startPoint: Point;
    private endPoint: Point;

    constructor(startPoint: Point, endPoint: Point) {
        this.startPoint = startPoint.getCopy();
        this.endPoint = endPoint.getCopy();
    }

    setStartPoint(point: Point): void {
        this.startPoint = point;
    }

    setEndPoint(point: Point): void {
        this.endPoint = point;
    }

    getStartPoint(): Point {
        return this.startPoint;
    }

    getEndPoint(): Point {
        return this.endPoint;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        ctx.strokeStyle = 'orange';
        ctx.fillStyle = 'orange';
        ctx.beginPath();
        ctx.moveTo(this.startPoint.x, this.startPoint.y);
        ctx.lineTo(this.endPoint.x, this.endPoint.y);
        ctx.stroke();

        this.drawArrowhead(ctx);
        ctx.restore();
    }

    private drawArrowhead(ctx: CanvasRenderingContext2D): void {
        const angle = Math.atan2(
            this.endPoint.y - this.startPoint.y,
            this.endPoint.x - this.startPoint.x
        );
        const headLength = 10;

        ctx.beginPath();
        ctx.moveTo(this.endPoint.x, this.endPoint.y);
        ctx.lineTo(
            this.endPoint.x - headLength * Math.cos(angle - Math.PI / 6),
            this.endPoint.y - headLength * Math.sin(angle - Math.PI / 6)
        );
        ctx.lineTo(
            this.endPoint.x - headLength * Math.cos(angle + Math.PI / 6),
            this.endPoint.y - headLength * Math.sin(angle + Math.PI / 6)
        );
        ctx.lineTo(this.endPoint.x, this.endPoint.y);
        ctx.lineTo(
            this.endPoint.x - headLength * Math.cos(angle - Math.PI / 6),
            this.endPoint.y - headLength * Math.sin(angle - Math.PI / 6)
        );
        ctx.fill();
    }

    getBoundingBox(): { x: number; y: number; width: number; height: number } {
        const minX = Math.min(this.startPoint.x, this.endPoint.x);
        const minY = Math.min(this.startPoint.y, this.endPoint.y);
        const maxX = Math.max(this.startPoint.x, this.endPoint.x);
        const maxY = Math.max(this.startPoint.y, this.endPoint.y);

        return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
    }

    move(vector: Vector2): void {
        this.startPoint.x += vector.x;
        this.startPoint.y += vector.y;
        this.endPoint.x += vector.x;
        this.endPoint.y += vector.y;
    }

    getCenter(): Point {
        return new Point(
            (this.startPoint.x + this.endPoint.x) / 2,
            (this.startPoint.y + this.endPoint.y) / 2
        );
    }

    linkTo(anchorable: Anchorable, anchorIndex: number): void {
        this.endPoint = anchorable.anchors[anchorIndex];
    }

    getLinkingPoint(): Point {
        return this.endPoint;
    }

    hasPoint(point: Point): boolean {
        const PIXEL_TOLERANCE = 5;
        const distanceToLine =
            Math.abs(
                (this.endPoint.y - this.startPoint.y) * point.x -
                    (this.endPoint.x - this.startPoint.x) * point.y +
                    this.endPoint.x * this.startPoint.y -
                    this.endPoint.y * this.startPoint.x
            ) /
            Math.sqrt(
                Math.pow(this.endPoint.y - this.startPoint.y, 2) +
                    Math.pow(this.endPoint.x - this.startPoint.x, 2)
            );

        return (
            distanceToLine < PIXEL_TOLERANCE &&
            point.x >= Math.min(this.startPoint.x, this.endPoint.x) &&
            point.x <= Math.max(this.startPoint.x, this.endPoint.x) &&
            point.y >= Math.min(this.startPoint.y, this.endPoint.y) &&
            point.y <= Math.max(this.startPoint.y, this.endPoint.y)
        );
    }
}

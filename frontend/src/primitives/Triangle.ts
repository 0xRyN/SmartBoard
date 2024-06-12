import { Shape } from './Shape';
import { Point } from './Point';
import { Stroke } from './Stroke';
import { Vector2 } from '../util/maths';
import { Segment } from './Segment';
import Rotatable from '../interfaces/Rotatable';

export class Triangle extends Shape implements Rotatable {
    public points: Point[];

    constructor(point1: Point, point2: Point, point3: Point) {
        super(point1);
        this.points = [point1, point2, point3];
        this.setupAnchors();
    }

    static buildShape(stroke: Stroke): Shape {
        const boundingBox = stroke.getBoundingBox();
        return new Triangle(
            new Point(boundingBox.x + boundingBox.width / 2, boundingBox.y),
            new Point(boundingBox.x, boundingBox.y + boundingBox.height),
            new Point(
                boundingBox.x + boundingBox.width,
                boundingBox.y + boundingBox.height
            )
        );
    }

    draw(ctx: CanvasRenderingContext2D): void {
        if (this.points.length < 3) return;

        ctx.beginPath();
        ctx.moveTo(this.points[0].x, this.points[0].y);
        for (let i = 1; i < this.points.length; i++) {
            ctx.lineTo(this.points[i].x, this.points[i].y);
        }
        ctx.closePath();
        ctx.stroke();

        this.drawAnchors(ctx);
    }

    setupAnchors(): void {
        this.anchors = this.points.map((point) => point.getCopy());
        this.anchors.push(this.getCenter().getCopy());
    }

    hasPoint(point: Point): boolean {
        const segments = [
            new Segment(this.points[0], this.points[1]),
            new Segment(this.points[1], this.points[2]),
            new Segment(this.points[2], this.points[0]),
        ];

        return segments.some((segment) => segment.hasPoint(point));
    }

    move(vector: Vector2): void {
        this.points.forEach((point) => {
            point.x += vector.x;
            point.y += vector.y;
        });

        this.setupAnchors();
    }

    getCenter(): Point {
        const centroid = new Point(
            (this.points[0].x + this.points[1].x + this.points[2].x) / 3,
            (this.points[0].y + this.points[1].y + this.points[2].y) / 3
        );
        return centroid;
    }

    getBoundingBox(): { x: number; y: number; width: number; height: number } {
        const minX = Math.min(...this.points.map((p) => p.x));
        const maxX = Math.max(...this.points.map((p) => p.x));
        const minY = Math.min(...this.points.map((p) => p.y));
        const maxY = Math.max(...this.points.map((p) => p.y));
        return {
            x: minX,
            y: minY,
            width: maxX - minX,
            height: maxY - minY,
        };
    }

    toString(): string {
        return `[${this.id}] Triangle: ${this.points
            .map((p) => p.toString())
            .join(', ')}`;
    }

    rotate(angle: number): void {
        const center = this.getCenter();
        this.points.forEach((point) => {
            const x = point.x - center.x;
            const y = point.y - center.y;
            const x1 =
                x * Math.cos((angle * Math.PI) / 180) -
                y * Math.sin((angle * Math.PI) / 180);
            const y1 =
                x * Math.sin((angle * Math.PI) / 180) +
                y * Math.cos((angle * Math.PI) / 180);
            point.x = center.x + x1;
            point.y = center.y + y1;
        });

        this.setupAnchors();
    }
}

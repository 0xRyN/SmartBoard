import { Shape } from './Shape';
import { Point } from './Point';
import { Stroke } from './Stroke';
import { Vector2 } from '../util/maths';
import { Segment } from './Segment';
import Rotatable from '../interfaces/Rotatable';
import { ShapeSizeRotationDetector } from '../util/ShapeSizeRotationDetector';
export class Rectangle extends Shape implements Rotatable {
    private points: Point[];

    constructor(
        startPoint: Point,
        public width: number,
        public height: number
    ) {
        super(startPoint);
        this.points = [
            startPoint,
            new Point(startPoint.x + width, startPoint.y),
            new Point(startPoint.x + width, startPoint.y + height),
            new Point(startPoint.x, startPoint.y + height),
        ];
        this.setupAnchors();
    }

    static buildShape(stroke: Stroke): Shape {
        const rectangle = ShapeSizeRotationDetector.detectBestRectangle(stroke);
        return rectangle;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        if (this.points.length < 4) return;

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
            new Segment(this.points[2], this.points[3]),
            new Segment(this.points[3], this.points[0]),
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

    getCenter(): Point {
        const cx = (this.points[0].x + this.points[2].x) / 2;
        const cy = (this.points[0].y + this.points[2].y) / 2;
        return new Point(cx, cy);
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
        return `[${this.id}] Rectangle: ${this.points
            .map((p) => p.toString())
            .join(', ')}`;
    }
}

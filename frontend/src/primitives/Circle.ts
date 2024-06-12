import { Shape } from './Shape';
import { Point } from './Point';
import { Stroke } from './Stroke';

export class Circle extends Shape {
    constructor(startPoint: Point, public radius: number) {
        super(startPoint);
        this.setupAnchors();
    }

    static buildShape(stroke: Stroke): Shape {
        const boundingBox = stroke.getBoundingBox();
        const radius = Math.max(boundingBox.width, boundingBox.height) / 2;
        return new Circle(
            new Point(
                boundingBox.x + boundingBox.width / 2,
                boundingBox.y + boundingBox.height / 2
            ),
            radius
        );
    }

    setupAnchors(): void {
        this.anchors = [
            new Point(this.startPoint.x, this.startPoint.y), // center
            new Point(this.startPoint.x + this.radius, this.startPoint.y), // right
            new Point(this.startPoint.x, this.startPoint.y + this.radius), // bottom
            new Point(this.startPoint.x - this.radius, this.startPoint.y), // left
            new Point(this.startPoint.x, this.startPoint.y - this.radius), // top
        ];
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();
        ctx.arc(
            this.startPoint.x,
            this.startPoint.y,
            this.radius,
            0,
            2 * Math.PI
        );
        ctx.stroke();

        this.drawAnchors(ctx);
    }

    hasPoint(point: Point): boolean {
        const dx = this.startPoint.x - point.x;
        const dy = this.startPoint.y - point.y;
        return dx * dx + dy * dy <= this.radius * this.radius;
    }

    getCenter(): Point {
        return this.startPoint;
    }

    getBoundingBox(): { x: number; y: number; width: number; height: number } {
        return {
            x: this.startPoint.x - this.radius,
            y: this.startPoint.y - this.radius,
            width: this.radius * 2,
            height: this.radius * 2,
        };
    }

    toString(): string {
        return `[${this.id}] Circle: ${this.startPoint.toString()} r=${
            this.radius
        }`;
    }
}

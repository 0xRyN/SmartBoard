import Anchorable from '../interfaces/Anchorable';
import Drawable from '../interfaces/Drawable';
import Linkable from '../interfaces/Linkable';
import { Vector2 } from '../util/maths';
import { Point } from './Point';
import { Segment } from './Segment';

export class Stroke implements Linkable, Drawable {
    private points: Point[] = [];

    constructor(points?: Point[]) {
        if (points) {
            this.points = points;
        }
    }

    addPoint(point: Point): void {
        this.points.push(point);
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();
        this.points.forEach((point, index) => {
            if (index === 0) {
                ctx.moveTo(point.x, point.y);
            } else {
                ctx.lineTo(point.x, point.y);
            }
        });
        ctx.stroke();
    }

    hasPointSegment(point: Point): boolean {
        const segment = new Segment(this.points[0], this.points[1]);
        return segment.hasPoint(point);
    }

    hasPoint(point: Point): boolean {
        if (this.points.length === 2) {
            return this.hasPointSegment(point);
        }

        const PIXEL_TOLERANCE = 5;
        return this.points.some(
            (strokePoint) =>
                Math.abs(strokePoint.x - point.x) < PIXEL_TOLERANCE &&
                Math.abs(strokePoint.y - point.y) < PIXEL_TOLERANCE
        );
    }

    getBoundingBox(): { x: number; y: number; width: number; height: number } {
        const xValues = this.points.map((point) => point.x);
        const yValues = this.points.map((point) => point.y);

        const x = Math.min(...xValues);
        const y = Math.min(...yValues);
        const width = Math.max(...xValues) - x;
        const height = Math.max(...yValues) - y;

        return { x, y, width, height };
    }

    getPoints(): Point[] {
        return Array.from(this.points);
    }

    setPoints(points: Point[]): void {
        this.points = points;
    }

    removePoint(point: Point): void {
        const index = this.points.findIndex(
            (strokePoint) =>
                strokePoint.x === point.x && strokePoint.y === point.y
        );
        this.points.splice(index, 1);
    }

    linkTo(anchorable: Anchorable, anchorIndex: number): void {
        const anchor = anchorable.getAnchors()[anchorIndex];
        // this.addPoint(anchor);

        this.points = [this.points[0].getCopy(), anchor.getCopy()];
    }

    getLinkingPoint(): Point {
        return this.points[this.points.length - 1];
    }

    getCenter(): Point {
        // Center of the bounding box
        const boundingBox = this.getBoundingBox();
        return new Point(
            boundingBox.x + boundingBox.width / 2,
            boundingBox.y + boundingBox.height / 2
        );
    }

    move(vector: Vector2): void {
        this.points.forEach((point) => {
            point.x += vector.x;
            point.y += vector.y;
        });
    }
}

export function isStroke(object: Drawable): object is Stroke {
    return 'addPoint' in object;
}

import { Point } from './Point';

export class Segment {
    private start: Point;
    private end: Point;

    constructor(start: Point, end: Point) {
        this.start = start;
        this.end = end;
    }

    getStart(): Point {
        return this.start;
    }

    getEnd(): Point {
        return this.end;
    }

    getLength(): number {
        return Math.sqrt(
            Math.pow(this.end.x - this.start.x, 2) +
                Math.pow(this.end.y - this.start.y, 2)
        );
    }

    hasPoint(point: Point): boolean {
        console.log(
            'Checking if point is on segment ' + point.x + ' ' + point.y
        );
        const segment = new Segment(this.start, point);
        return (
            Math.abs(
                this.getLength() -
                    segment.getLength() -
                    new Segment(point, this.end).getLength()
            ) < 0.01
        );
    }
}

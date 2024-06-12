import { Point } from '../primitives/Point';

export class Vector2 {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

export class MathUtils {
    static distance(p1: Point, p2: Point): number {
        return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
    }

    static calculateAngle(A: Point, B: Point, C: Point) {
        const AB = Math.sqrt(Math.pow(B.x - A.x, 2) + Math.pow(B.y - A.y, 2));
        const BC = Math.sqrt(Math.pow(B.x - C.x, 2) + Math.pow(B.y - C.y, 2));
        const AC = Math.sqrt(Math.pow(C.x - A.x, 2) + Math.pow(C.y - A.y, 2));

        const cosToCompute = (BC * BC + AB * AB - AC * AC) / (2 * BC * AB);

        const boundCos = Math.max(-1, Math.min(1, cosToCompute));

        const rad = Math.acos(boundCos);

        return (rad * 180) / Math.PI;
    }
}

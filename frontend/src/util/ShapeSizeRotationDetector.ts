import { Point } from '../primitives/Point';
import { Rectangle } from '../primitives/Rectangle';
import { Stroke } from '../primitives/Stroke';
import { Triangle } from '../primitives/Triangle';
import { MathUtils } from './maths';

interface ShapeSizeRotation {
    angle: number;
    centroid: Point;
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
}

interface BoundingBox {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
}

interface DistanceTuple {
    point1: Point;
    point2: Point;
    distance: number;
}

export class ShapeSizeRotationDetector {
    static calculateCentroid(points: Point[]): Point {
        const n = points.length;
        let sumX = 0,
            sumY = 0;
        points.forEach((p) => {
            sumX += p.x;
            sumY += p.y;
        });
        return new Point(sumX / n, sumY / n);
    }

    static centerPoints(points: Point[], centroid: Point): Point[] {
        return points.map((p) => new Point(p.x - centroid.x, p.y - centroid.y));
    }

    static rotatePoints(points: Point[], angle: number): Point[] {
        const cosAngle = Math.cos(-angle);
        const sinAngle = Math.sin(-angle);
        return points.map((p) => {
            const x = p.x * cosAngle - p.y * sinAngle;
            const y = p.x * sinAngle + p.y * cosAngle;
            return new Point(x, y);
        });
    }

    static calculateCovarianceMatrix(
        points: Point[]
    ): [number, number, number] {
        let covXX = 0,
            covXY = 0,
            covYY = 0;
        const n = points.length;

        points.forEach((p) => {
            covXX += p.x * p.x;
            covXY += p.x * p.y;
            covYY += p.y * p.y;
        });
        covXX /= n;
        covXY /= n;
        covYY /= n;

        return [covXX, covXY, covYY];
    }

    static calculateEigenvaluesAndEigenvectors(
        covXX: number,
        covXY: number,
        covYY: number
    ): [[number, number], [number, number], number, number] {
        const trace = covXX + covYY;
        const det = covXX * covYY - covXY * covXY;
        const eigenValue1 = trace / 2 + Math.sqrt((trace * trace) / 4 - det);
        const eigenValue2 = trace / 2 - Math.sqrt((trace * trace) / 4 - det);

        const eigenvector1: [number, number] = [covXY, eigenValue1 - covXX];
        const eigenvector2: [number, number] = [covXY, eigenValue2 - covXX];

        return [eigenvector1, eigenvector2, eigenValue1, eigenValue2];
    }

    static calculateRotationAngle(
        eigenvector1: number[],
        eigenvector2: number[],
        eigenValue1: number,
        eigenValue2: number
    ): number {
        const primaryEigenvector =
            eigenValue1 > eigenValue2 ? eigenvector1 : eigenvector2;
        return Math.atan2(primaryEigenvector[1], primaryEigenvector[0]);
    }

    static getBoundingBox(points: Point[]): BoundingBox {
        const minX = Math.min(...points.map((p) => p.x));
        const maxX = Math.max(...points.map((p) => p.x));
        const minY = Math.min(...points.map((p) => p.y));
        const maxY = Math.max(...points.map((p) => p.y));

        return { minX, maxX, minY, maxY };
    }

    static findSizeAndRotation(stroke: Stroke): ShapeSizeRotation {
        const points = stroke.getPoints();
        const centroid = this.calculateCentroid(points);
        const centeredPoints = this.centerPoints(points, centroid);
        const [covXX, covXY, covYY] =
            this.calculateCovarianceMatrix(centeredPoints);
        const [eigenvector1, eigenvector2, eigenValue1, eigenValue2] =
            this.calculateEigenvaluesAndEigenvectors(covXX, covXY, covYY);
        const angle = this.calculateRotationAngle(
            eigenvector1,
            eigenvector2,
            eigenValue1,
            eigenValue2
        );
        const rotatedPoints = this.rotatePoints(centeredPoints, angle);
        const { minX, maxX, minY, maxY } = this.getBoundingBox(rotatedPoints);

        return { angle, centroid, minX, maxX, minY, maxY };
    }

    static findAllDistances(stroke: Stroke): DistanceTuple[] {
        const points = stroke.getPoints();
        const distances: DistanceTuple[] = [];
        for (let i = 0; i < points.length - 1; i++) {
            const point1 = points[i];
            const point2 = points[i + 1];
            const distance = MathUtils.distance(point1, point2);
            distances.push({ point1, point2, distance });
        }
        return distances;
    }

    static detectBestRectangle(stroke: Stroke): Rectangle {
        const { angle, centroid, minX, maxX, minY, maxY } =
            this.findSizeAndRotation(stroke);

        const width = maxX - minX;
        const height = maxY - minY;
        const rectStartPoint = new Point(minX + centroid.x, minY + centroid.y);
        const rectangle = new Rectangle(rectStartPoint, width, height);
        rectangle.rotate(angle * (180 / Math.PI));
        return rectangle;
    }

    static detectBestTriangle(stroke: Stroke): Triangle {
        const distances = this.findAllDistances(stroke);
        distances.sort((a, b) => b.distance - a.distance);

        const mostDistantPoints: Point[] = [];
        for (const { point1, point2 } of distances) {
            if (!mostDistantPoints.includes(point1)) {
                mostDistantPoints.push(point1);
            }
            if (!mostDistantPoints.includes(point2)) {
                mostDistantPoints.push(point2);
            }
            if (mostDistantPoints.length === 3) {
                break;
            }
        }

        const [point1, point2, point3] = mostDistantPoints;
        const triangle = new Triangle(point1, point2, point3);

        return triangle;
    }
}

import { RSQUARED_THRESHOLD, STD_DERV_MAX_STROKE } from '../../util/consts';
import { MathUtils } from '../../util/maths';
import Middleware from '../Middleware';

export default class StrokeAdjuster extends Middleware {
    standardDeviation(): Promise<boolean> {
        const stroke = this.whiteboardState.getCurrentStroke();
        const points = stroke.getPoints();
        if (points.length < 3) return Promise.resolve(false); // No adjustment needed for less than 3 points

        // Calculate standard deviation of the angles between each point
        const angles: number[] = [];
        for (let i = 0; i < points.length - 2; i++) {
            const angle = MathUtils.calculateAngle(
                points[i],
                points[i + 1],
                points[i + 2]
            );
            angles.push(angle);
        }

        const meanAngle =
            angles.reduce((acc, angle) => acc + angle, 0) / angles.length;

        const variance = angles.reduce(
            (acc, angle) => acc + Math.pow(angle - meanAngle, 2),
            0
        );

        const standardDeviation = Math.sqrt(variance / angles.length);

        // If the standard deviation is too low, the user intended to draw a straight line
        if (standardDeviation > STD_DERV_MAX_STROKE)
            return Promise.resolve(false);

        // Adjust the stroke
        stroke.setPoints([points[0], points[points.length - 1]]);

        this.whiteboardState.addDrawable(stroke);
        this.whiteboardState.clearCurrentStroke();

        return Promise.resolve(true);
    }

    linearRegression(): Promise<boolean> {
        const stroke = this.whiteboardState.getCurrentStroke();
        const points = stroke.getPoints();
        if (points.length < 3) return Promise.resolve(false); // No adjustment needed for less than 3 points

        const n = points.length;
        const sumX = points.reduce((acc, p) => acc + p.x, 0);
        const sumY = points.reduce((acc, p) => acc + p.y, 0);
        const sumXY = points.reduce((acc, p) => acc + p.x * p.y, 0);
        const sumXX = points.reduce((acc, p) => acc + p.x * p.x, 0);

        // Calculate slope and intercept of the best-fit line
        const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;

        // Total variance
        const meanY = sumY / n;
        const totalVariance = points.reduce(
            (acc, p) => acc + (p.y - meanY) ** 2,
            0
        );

        // Residual variance
        const residualVariance = points.reduce(
            (acc, p) => acc + (p.y - (slope * p.x + intercept)) ** 2,
            0
        );

        const rSquared = 1 - residualVariance / totalVariance;

        if (rSquared < RSQUARED_THRESHOLD) return Promise.resolve(false);

        // Adjust the stroke
        stroke.setPoints([points[0], points[points.length - 1]]);
        this.whiteboardState.addDrawable(stroke);
        this.whiteboardState.clearCurrentStroke();

        return Promise.resolve(true);
    }

    apply(): Promise<boolean> {
        const CHOSEN_FUNCTION = this.linearRegression.bind(this);
        return CHOSEN_FUNCTION();
    }
}

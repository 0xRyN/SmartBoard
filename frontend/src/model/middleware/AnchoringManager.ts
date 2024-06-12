import Anchorable, { isAnchorable } from '../../interfaces/Anchorable';
import Drawable from '../../interfaces/Drawable';
import { Arrow } from '../../primitives/Arrow';
import { Point } from '../../primitives/Point';
import { Stroke } from '../../primitives/Stroke';
import { LINKING_THRESHOLD } from '../../util/consts';
import { MathUtils } from '../../util/maths';
import Middleware from '../Middleware';

export default class AnchoringManager extends Middleware {
    private getDrawables(): Drawable[] {
        return this.whiteboardState.getDrawingHistory();
    }

    private getLastStroke(): undefined | Stroke {
        const stroke = this.whiteboardState.getCurrentStroke();
        if (!stroke) return undefined;
        return stroke;
    }

    private getAllAnchorables(): Anchorable[] {
        const drawables = this.getDrawables();
        const anchorables: Anchorable[] = drawables.filter(isAnchorable);
        return anchorables;
    }

    /**
     * Returns the closest anchorable to a given point within the linking threshold.
     * @param point
     * @returns [Anchorable, number] | undefined
     * @private
     */
    private getClosestAnchorableToPoint(
        point: Point
    ): undefined | [Anchorable, number] {
        const anchorables = this.getAllAnchorables();
        let minDistance = LINKING_THRESHOLD;
        let minAnchorable = undefined;
        let minAnchorIndex = 0;

        anchorables.forEach((anchorable) => {
            anchorable.getAnchors().forEach((anchor, index) => {
                const currentDist = MathUtils.distance(point, anchor);
                if (currentDist < minDistance) {
                    minDistance = currentDist;
                    minAnchorable = anchorable;
                    minAnchorIndex = index;
                }
            });
        });

        return minAnchorable ? [minAnchorable, minAnchorIndex] : undefined;
    }

    /**
     * Links two anchorables with an arrow.
     * @param startAnchorable
     * @param endAnchorable
     */
    private linkWithArrow(
        startAnchorable: [Anchorable, number],
        endAnchorable: [Anchorable, number]
    ): void {
        const [startAnchorableItem, startIndex] = startAnchorable;
        const [endAnchorableItem, endIndex] = endAnchorable;

        const startAnchorPoint = startAnchorableItem.getAnchors()[startIndex];
        const endAnchorPoint = endAnchorableItem.getAnchors()[endIndex];

        const arrow = new Arrow(startAnchorPoint, endAnchorPoint);
        this.whiteboardState.addDrawable(arrow);
    }

    apply(): Promise<boolean> {
        const lastStroke = this.getLastStroke();
        if (!lastStroke) return Promise.resolve(false);

        const startPoint = lastStroke.getPoints()[0];
        const endPoint =
            lastStroke.getPoints()[lastStroke.getPoints().length - 1];

        const startAnchorable = this.getClosestAnchorableToPoint(startPoint);
        const endAnchorable = this.getClosestAnchorableToPoint(endPoint);

        // If we can link two anchorables, we do so and clear the current stroke
        if (
            startAnchorable &&
            endAnchorable &&
            startAnchorable[0].getCenter() !== endAnchorable[0].getCenter()
        ) {
            this.linkWithArrow(startAnchorable, endAnchorable);
            this.whiteboardState.clearCurrentStroke();
            return Promise.resolve(true);
        }

        // If we find an end anchorable, we link the last stroke to it
        else if (endAnchorable) {
            const [endAnchorableItem, endIndex] = endAnchorable;
            lastStroke.linkTo(endAnchorableItem, endIndex);
            this.whiteboardState.addDrawable(lastStroke);
            this.whiteboardState.clearCurrentStroke();
            return Promise.resolve(true);
        }

        return Promise.resolve(false);
    }
}

import classifyStroke from '../../api/ClassifierAPI';
import { Circle } from '../../primitives/Circle';
import Drawable from '../../interfaces/Drawable';
import { Rectangle } from '../../primitives/Rectangle';
import { Stroke } from '../../primitives/Stroke';
import Middleware from '../Middleware';
import { Triangle } from '../../primitives/Triangle';

export type PossibleShape = 'circle' | 'triangle' | 'rectangle' | 'stroke';

export default class ShapeClassifier extends Middleware {
    async classify(stroke: Stroke): Promise<PossibleShape> {
        const result = await classifyStroke(stroke);
        return result;
    }

    async apply(): Promise<boolean> {
        const stroke = this.whiteboardState.getCurrentStroke();
        const result = await this.classify(stroke);
        if (result === 'stroke') {
            return false;
        }

        const start = performance.now();
        let drawable: Drawable;
        switch (result) {
            case 'circle':
                drawable = Circle.buildShape(stroke);
                break;
            case 'triangle':
                drawable = Triangle.buildShape(stroke);
                break;
            case 'rectangle':
                drawable = Rectangle.buildShape(stroke);
                break;
        }
        const end = performance.now();
        console.log(`Size / Rotation detection took ${end - start}ms.`);

        this.whiteboardState.addDrawable(drawable);
        this.whiteboardState.clearCurrentStroke();

        return true;
    }
}

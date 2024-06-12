import Middleware from './Middleware';
import WhiteboardState from './WhiteboardState';
import AnchoringManager from './middleware/AnchoringManager';
import ShapeClassifier from './middleware/ShapeClassifier';
import StrokeAdjuster from './middleware/StrokeAdjuster';

export default class MiddlewareManager {
    private whiteboardState: WhiteboardState;
    private middlewares: Middleware[];

    constructor(whiteboardState: WhiteboardState) {
        this.whiteboardState = whiteboardState;
        this.middlewares = [];

        this.initializeMiddlewares();
    }

    initializeMiddlewares() {
        // Order matters
        this.middlewares.push(new ShapeClassifier(this.whiteboardState));
        this.middlewares.push(new AnchoringManager(this.whiteboardState));
        this.middlewares.push(new StrokeAdjuster(this.whiteboardState));
    }

    async applyMiddlewares() {
        // We stop applying middlewares if one of them modifies the whiteboard state
        for (const middleware of this.middlewares) {
            if (await middleware.apply()) {
                return;
            }
        }

        // If no middleware modified the whiteboard state, we add the current stroke to the drawing history
        this.whiteboardState.addDrawable(
            this.whiteboardState.getCurrentStroke()
        );
        this.whiteboardState.clearCurrentStroke();
    }
}

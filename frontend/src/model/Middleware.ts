import WhiteboardState from './WhiteboardState';

export default abstract class Middleware {
    protected whiteboardState: WhiteboardState;

    constructor(whiteboardState: WhiteboardState) {
        this.whiteboardState = whiteboardState;
    }

    /*
     * Apply the middleware to the whiteboard state
     * @returns true if the whiteboard state was modified, false otherwise. Important!
     */
    abstract apply(): Promise<boolean>;
}

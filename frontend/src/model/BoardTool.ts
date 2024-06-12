import WhiteboardState from './WhiteboardState';

export default abstract class BoardTool {
    protected whiteboardState: WhiteboardState;

    constructor(whiteboardState: WhiteboardState) {
        this.whiteboardState = whiteboardState;
    }

    abstract onLeftMouseDown(event: MouseEvent): void;
    abstract onLeftMouseUp(event: MouseEvent): void;
    abstract onRightMouseDown(event: MouseEvent): void;
    abstract onRightMouseUp(event: MouseEvent): void;
    abstract onMouseMove(event: MouseEvent): void;
}

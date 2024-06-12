import { Point } from '../../primitives/Point';
import BoardTool from '../BoardTool';

export default class Pen extends BoardTool {
    private isDrawing: boolean = false;

    onLeftMouseDown(event: MouseEvent): void {
        this.isDrawing = true;
        this.whiteboardState.startStroke(
            new Point(event.offsetX, event.offsetY)
        );
    }
    onLeftMouseUp(event: MouseEvent): void {
        this.isDrawing = false;
        this.whiteboardState.endCurrentStrokeWithoutMiddleware();
    }
    onRightMouseDown(event: MouseEvent): void {
        throw new Error('Method not implemented.');
    }
    onRightMouseUp(event: MouseEvent): void {
        throw new Error('Method not implemented.');
    }
    onMouseMove(event: MouseEvent): void {
        if (!this.isDrawing) {
            return;
        }
        this.whiteboardState.addPointToCurrentStroke(
            new Point(event.offsetX, event.offsetY)
        );
    }
}

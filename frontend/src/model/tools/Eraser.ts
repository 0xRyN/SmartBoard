import { Point } from '../../primitives/Point';
import BoardTool from '../BoardTool';

export default class Eraser extends BoardTool {
    private isErasing: boolean = false;

    onLeftMouseDown(event: MouseEvent): void {
        this.isErasing = true;
        this.whiteboardState.clearAtPoint(
            new Point(event.offsetX, event.offsetY)
        );
    }
    onLeftMouseUp(_event: MouseEvent): void {
        this.isErasing = false;
    }
    onRightMouseDown(_event: MouseEvent): void {
        return;
    }
    onRightMouseUp(_event: MouseEvent): void {
        return;
    }
    onMouseMove(event: MouseEvent): void {
        if (!this.isErasing) {
            return;
        }
        this.whiteboardState.clearAtPoint(
            new Point(event.offsetX, event.offsetY)
        );
    }
}

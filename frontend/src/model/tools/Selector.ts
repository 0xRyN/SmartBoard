import Drawable from '../../interfaces/Drawable';
import { Point } from '../../primitives/Point';
import BoardTool from '../BoardTool';
// import { SELECTOR_PIXEL_TOLERANCE } from '../../util/consts';

export default class Selector extends BoardTool {
    private selected: Drawable[] = [];
    private isSelecting: boolean = false;
    private isMoving: boolean = false;
    private selectStartPosition: Point = new Point(0, 0);
    private moveStartPosition: Point = new Point(0, 0);

    private selectAvailableShapes(event: MouseEvent): void {
        const drawables = this.whiteboardState.getDrawingHistory();
        const centers = drawables.map((drawable) => drawable.getCenter());
        const point = new Point(event.offsetX, event.offsetY);

        for (let i = 0; i < centers.length; i++) {
            // Check if the point is within the rectangle from selectStartPosition to point
            // Could use a pixel tolerance here
            const center = centers[i];
            if (
                center.x >= this.selectStartPosition.x &&
                center.x <= point.x &&
                center.y >= this.selectStartPosition.y &&
                center.y <= point.y
            ) {
                this.selected.push(drawables[i]);
            }
        }
    }

    private drawSelectionBox(event: MouseEvent): void {
        this.whiteboardState.redrawCanvas();
        const ctx = this.whiteboardState.getCtx();
        const currentPoint = new Point(event.offsetX, event.offsetY);
        const width = currentPoint.x - this.selectStartPosition.x;
        const height = currentPoint.y - this.selectStartPosition.y;

        ctx.beginPath();
        ctx.rect(
            this.selectStartPosition.x,
            this.selectStartPosition.y,
            width,
            height
        );
        ctx.stroke();
    }

    private moveSelectedShapes(event: MouseEvent): void {
        const point = new Point(event.offsetX, event.offsetY);
        const vector = new Point(
            point.x - this.moveStartPosition.x,
            point.y - this.moveStartPosition.y
        );

        this.selected.forEach((shape) => shape.move(vector));
        this.moveStartPosition = point;
        this.whiteboardState.redrawCanvas();
    }

    private drawSelectedBoundingBox(): void {
        if (this.selected.length === 0) return;
        const ctx = this.whiteboardState.getCtx();
        // Find max and min x and y values
        const startxValues = this.selected.map(
            (shape) => shape.getBoundingBox().x
        );
        const startyValues = this.selected.map(
            (shape) => shape.getBoundingBox().y
        );

        const endxValues = this.selected.map(
            (shape) => shape.getBoundingBox().x + shape.getBoundingBox().width
        );
        const endyValues = this.selected.map(
            (shape) => shape.getBoundingBox().y + shape.getBoundingBox().height
        );

        const x = Math.min(...startxValues);
        const y = Math.min(...startyValues);
        const width = Math.max(...endxValues) - x;
        const height = Math.max(...endyValues) - y;

        ctx.save();
        ctx.strokeStyle = 'red';
        ctx.beginPath();
        ctx.rect(x, y, width, height);
        ctx.stroke();
        ctx.restore();
    }

    // Start drawing selection box
    onLeftMouseDown(event: MouseEvent): void {
        this.isSelecting = true;
        this.selectStartPosition = new Point(event.offsetX, event.offsetY);
    }

    // Finish drawing selection box and select shapes
    onLeftMouseUp(event: MouseEvent): void {
        this.isSelecting = false;
        this.selected = [];
        this.selectAvailableShapes(event);
        this.whiteboardState.redrawCanvas(); // Redraw to remove selection box
        this.selectStartPosition = new Point(0, 0);
        this.drawSelectedBoundingBox();
    }

    // Start moving selected shapes
    onRightMouseDown(event: MouseEvent): void {
        this.isMoving = true;
        this.moveStartPosition = new Point(event.offsetX, event.offsetY);
    }

    // Finish moving selected shapes
    onRightMouseUp(_event: MouseEvent): void {
        this.isMoving = false;
        this.moveStartPosition = new Point(0, 0);
    }

    onMouseMove(event: MouseEvent): void {
        if (!this.isSelecting && !this.isMoving) {
            return;
        }

        if (this.isSelecting) {
            this.drawSelectionBox(event);
        }

        if (this.isMoving) {
            this.moveSelectedShapes(event);
        }
    }
}

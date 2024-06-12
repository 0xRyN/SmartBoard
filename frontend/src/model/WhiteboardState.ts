import Drawable from '../interfaces/Drawable';
import { Point } from '../primitives/Point';
import { Stroke } from '../primitives/Stroke';
import EventManager from './EventManager';
import MiddlewareManager from './MiddlewareManager';

export default class WhiteboardState {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private eventManager: EventManager;
    private currentStroke: Stroke;
    private drawingHistory: Drawable[];
    private redoHistory: Drawable[];
    private stateHistory: Drawable[][];
    private middlewareManager: MiddlewareManager;

    constructor(canvas: HTMLCanvasElement, eventManager: EventManager) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d')!;
        this.eventManager = eventManager;
        this.drawingHistory = [];
        this.redoHistory = [];
        this.stateHistory = [];
        this.currentStroke = new Stroke();
        this.middlewareManager = new MiddlewareManager(this);

        this.ctx.strokeStyle = 'white';
        this.ctx.lineWidth = 3;

        this.registerKeybinds();
    }

    private _drawBoundingBox(): void {
        const { x, y, width, height } = this.currentStroke.getBoundingBox();
        const strokeColor = this.ctx.strokeStyle;
        this.ctx.strokeStyle = 'red';
        this.ctx.beginPath();
        this.ctx.rect(x, y, width, height);
        this.ctx.stroke();
        this.ctx.strokeStyle = strokeColor;
    }

    private registerKeybinds(): void {
        const keybinds: { [key: string]: () => void } = {
            'Ctrl+Z': () => this.undo(),
            'Ctrl+Shift+Z': () => this.redo(),
            'Ctrl+Y': () => this.redo(),
            'Shift+Backspace': () => this.clear(),
        };

        for (const key in keybinds) {
            this.eventManager.addKeybind(key, keybinds[key]);
        }
    }

    private saveState(): void {
        this.stateHistory.push(this.drawingHistory);
    }

    private restoreState(): void {
        this.drawingHistory = this.stateHistory.pop() || [];
        this.redrawCanvas();
    }

    redrawCanvas(): void {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.save();
        this.ctx.strokeStyle = 'red';
        this.currentStroke.draw(this.ctx);
        this.ctx.restore();

        this.drawingHistory.forEach((drawable) => drawable.draw(this.ctx));
    }

    clearAtPoint(point: Point): void {
        this.drawingHistory = this.drawingHistory.filter(
            (drawable) => !drawable.hasPoint(point)
        );
        this.redrawCanvas();
    }

    clearCurrentStroke(): void {
        this.currentStroke = new Stroke();
        this.redrawCanvas();
    }

    addDrawable(drawable: Drawable): void {
        this.drawingHistory.push(drawable);
        this.redrawCanvas();
    }

    startStroke(point: Point): void {
        this.currentStroke = new Stroke([point]);
    }

    addPointToCurrentStroke(point: Point): void {
        this.currentStroke.addPoint(point);
        this.redrawCanvas();
    }

    async endCurrentStroke(): Promise<void> {
        await this.middlewareManager.applyMiddlewares();
        this.redrawCanvas();
    }

    endCurrentStrokeWithoutMiddleware(): void {
        this.addDrawable(this.getCurrentStroke());
        this.clearCurrentStroke();
        this.redrawCanvas();
    }

    undo(): void {
        const lastAction = this.drawingHistory.pop();
        if (lastAction) {
            this.redoHistory.push(lastAction);
        }
        this.redrawCanvas();
    }

    redo = (): void => {
        const lastAction = this.redoHistory.pop();
        if (lastAction) {
            this.drawingHistory.push(lastAction);
        }
        this.redrawCanvas();
    };

    clear = (): void => {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawingHistory = [];
        this.redoHistory = [];
    };

    getDrawingHistory(): Drawable[] {
        return Array.from(this.drawingHistory);
    }

    getCurrentStroke(): Stroke {
        return this.currentStroke;
    }

    getCtx(): CanvasRenderingContext2D {
        return this.ctx;
    }
}

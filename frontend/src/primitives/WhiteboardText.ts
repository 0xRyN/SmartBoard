import Drawable from '../interfaces/Drawable';
import { Point } from './Point';
import { Vector2 } from '../util/maths';

export class WhiteboardText extends Drawable {
    private text: string;
    private position: Point;
    private font: string;
    private color: string;

    constructor(
        text: string,
        position: Point,
        font: string = '22px Montserrat',
        color: string = 'white'
    ) {
        super();
        this.text = text;
        this.position = position;
        this.font = font;
        this.color = color;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        ctx.font = this.font;
        ctx.fillStyle = this.color;
        ctx.fillText(this.text, this.position.x, this.position.y);
        ctx.restore();
    }

    hasPoint(point: Point): boolean {
        const { x, y, width, height } = this.getBoundingBox();
        return (
            point.x >= x &&
            point.x <= x + width &&
            point.y >= y &&
            point.y <= y + height
        );
    }

    getCenter(): Point {
        const { x, y, width, height } = this.getBoundingBox();
        return new Point(x + width / 2, y + height / 2);
    }

    move(vector: Vector2): void {
        this.position = new Point(
            this.position.x + vector.x,
            this.position.y + vector.y
        );
    }

    getBoundingBox(): { x: number; y: number; width: number; height: number } {
        const context = document.createElement('canvas').getContext('2d');
        if (context) {
            context.font = this.font;
            const metrics = context.measureText(this.text);
            const width = metrics.width;
            const height = parseInt(this.font, 10);
            return {
                x: this.position.x,
                y: this.position.y - height,
                width,
                height,
            };
        }
        return { x: this.position.x, y: this.position.y, width: 0, height: 0 };
    }
}

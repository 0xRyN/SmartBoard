import { Point } from '../../primitives/Point';
import { WhiteboardText } from '../../primitives/WhiteboardText';
import BoardTool from '../BoardTool';

export class Text extends BoardTool {
    private inputElement: HTMLInputElement | null = null;

    onLeftMouseDown(event: MouseEvent): void {
        if (this.inputElement) {
            this.removeInputElement();
        }

        this.createInputElement(event.offsetX, event.offsetY);
    }

    private createInputElement(x: number, y: number): void {
        this.inputElement = document.createElement('input');
        this.inputElement.type = 'text';
        this.inputElement.style.position = 'absolute';
        this.inputElement.style.left = `${x - 20}px`;
        this.inputElement.style.top = `${y - 20}px`;

        this.inputElement.classList.add('stylish-input');

        this.inputElement.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                this.submitText(x, y);
            }
        });

        document
            .getElementsByClassName('canvas-container')[0]
            .appendChild(this.inputElement);
        this.inputElement.focus();
    }

    private submitText(x: number, y: number): void {
        if (this.inputElement) {
            const text = new WhiteboardText(
                this.inputElement.value,
                new Point(x, y)
            );
            this.whiteboardState.addDrawable(text);
            this.removeInputElement();
        }
    }

    private removeInputElement(): void {
        if (this.inputElement) {
            document
                .getElementsByClassName('canvas-container')[0]
                .removeChild(this.inputElement);
            this.inputElement = null;
        }
    }

    onLeftMouseUp(event: MouseEvent): void {}
    onRightMouseDown(event: MouseEvent): void {
        throw new Error('Method not implemented.');
    }
    onRightMouseUp(event: MouseEvent): void {
        throw new Error('Method not implemented.');
    }
    onMouseMove(event: MouseEvent): void {}
}

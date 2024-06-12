import KeybindManager from './KeybindManager';

type MouseEventType =
    | 'mousedown'
    | 'mouseup'
    | 'mousemove'
    | 'click'
    | 'dblclick';
type MouseEventHandler = (event: MouseEvent) => void;
export default class EventManager {
    private canvas: HTMLCanvasElement;
    private mouseEventListeners: Map<MouseEventType, MouseEventHandler[]> =
        new Map();
    private keybindManager: KeybindManager;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.keybindManager = new KeybindManager();
        canvas.addEventListener('contextmenu', (event) =>
            event.preventDefault()
        );
    }

    private addCanvasMouseListener(eventType: MouseEventType): void {
        this.canvas.addEventListener(eventType, (event) => {
            event.preventDefault();
            this.triggerMouseEvent(eventType, event);
        });
    }

    registerMouseEvent(
        eventType: MouseEventType,
        handler: MouseEventHandler
    ): void {
        if (!this.mouseEventListeners.has(eventType)) {
            this.mouseEventListeners.set(eventType, []);
            this.addCanvasMouseListener(eventType);
        }
        this.mouseEventListeners.get(eventType)!.push(handler);
    }

    unregisterMouseEvent(
        eventType: MouseEventType,
        handler: MouseEventHandler
    ): void {
        const handlers = this.mouseEventListeners.get(eventType);
        if (handlers) {
            const index = handlers.indexOf(handler);
            if (index !== -1) {
                handlers.splice(index, 1);
            }
        }
    }

    triggerMouseEvent(eventType: MouseEventType, event: MouseEvent): void {
        const handlers = this.mouseEventListeners.get(eventType);
        if (handlers) {
            handlers.forEach((handler) => handler(event));
        }
    }

    addKeybind(keyCombination: string, action: () => void): void {
        this.keybindManager.addKeybind(keyCombination, action);
    }

    removeKeybind(keyCombination: string): void {
        this.keybindManager.removeKeybind(keyCombination);
    }

    clearListeners(): void {
        this.mouseEventListeners.clear();
        this.keybindManager.removeKeybindListeners();
    }
}

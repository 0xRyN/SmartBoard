import EventManager from './EventManager';
import ToolSelector from './ToolSelector';
import WhiteboardState from './WhiteboardState';

export default class WhiteboardMaster {
    private canvas: HTMLCanvasElement;
    private state: WhiteboardState;
    private eventManager: EventManager;
    private toolSelector: ToolSelector;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.eventManager = new EventManager(this.canvas);
        this.state = new WhiteboardState(this.canvas, this.eventManager);
        this.toolSelector = new ToolSelector(this.state, this.eventManager);
    }

    clearListeners(): void {
        this.eventManager.clearListeners();
    }

    getToolSelector(): ToolSelector {
        return this.toolSelector;
    }

    getState(): WhiteboardState {
        return this.state;
    }
}

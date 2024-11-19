import BoardTool from './BoardTool';
import EventManager from './EventManager';
import WhiteboardState from './WhiteboardState';
import Eraser from './tools/Eraser';
import SmartPen from './tools/SmartPen';
import Selector from './tools/Selector';
import { Text } from './tools/Text';
import Pen from './tools/Pen';

enum ToolKeybinds {
    KEYBIND_SMARTPEN = 'o',
    KEYBIND_PEN = 'p',
    KEYBIND_ERASER = 'e',
    KEYBIND_SELECTOR = 's',
    KEYBIND_TEXT = 't',
}

enum ToolIndices {
    INDEX_SMARTPEN = 0,
    INDEX_PEN = 1,
    INDEX_ERASER = 2,
    INDEX_SELECTOR = 3,
    INDEX_TEXT = 4,
}

export default class ToolSelector {
    private tools: Array<BoardTool>;
    private currentTool: number;
    private whiteboardState: WhiteboardState;
    private eventManager: EventManager;

    constructor(whiteboardState: WhiteboardState, eventManager: EventManager) {
        this.tools = [];
        this.currentTool = 0;
        this.whiteboardState = whiteboardState;
        this.eventManager = eventManager;

        this.registerKeybinds();
        this.registerEventListeners();
        this.initializeTools();
    }

    switchTool(index: number): void {
        if (index < 0 || index >= this.tools.length) return;
        this.currentTool = index;
        console.log(
            'Switched to tool:',
            this.getCurrentTool().constructor.name
        );
    }

    initializeTools(): void {
        const smartPenTool: BoardTool = new SmartPen(this.whiteboardState);
        const penTool: BoardTool = new Pen(this.whiteboardState);
        const eraserTool: BoardTool = new Eraser(this.whiteboardState);
        const selectorTool: BoardTool = new Selector(this.whiteboardState);
        const textTool: BoardTool = new Text(this.whiteboardState);

        this.tools.push(smartPenTool);
        this.tools.push(penTool);
        this.tools.push(eraserTool);
        this.tools.push(selectorTool);
        this.tools.push(textTool);
    }

    registerKeybinds(): void {
        this.eventManager.addKeybind(ToolKeybinds.KEYBIND_SMARTPEN, () =>
            this.switchTool(ToolIndices.INDEX_SMARTPEN)
        );
        this.eventManager.addKeybind(ToolKeybinds.KEYBIND_PEN, () =>
            this.switchTool(ToolIndices.INDEX_PEN)
        );
        this.eventManager.addKeybind(ToolKeybinds.KEYBIND_ERASER, () =>
            this.switchTool(ToolIndices.INDEX_ERASER)
        );
        this.eventManager.addKeybind(ToolKeybinds.KEYBIND_SELECTOR, () =>
            this.switchTool(ToolIndices.INDEX_SELECTOR)
        );
        this.eventManager.addKeybind(ToolKeybinds.KEYBIND_TEXT, () =>
            this.switchTool(ToolIndices.INDEX_TEXT)
        );
    }

    registerEventListeners(): void {
        this.eventManager.registerMouseEvent('mousedown', (event) => {
            if (event.button === 0) {
                this.getCurrentTool().onLeftMouseDown(event);
            } else if (event.button === 2) {
                this.getCurrentTool().onRightMouseDown(event);
            }
        });
        this.eventManager.registerMouseEvent('mouseup', (event) => {
            if (event.button === 0) {
                this.getCurrentTool().onLeftMouseUp(event);
            } else if (event.button === 2) {
                this.getCurrentTool().onRightMouseUp(event);
            }
        });
        this.eventManager.registerMouseEvent('mousemove', (event) => {
            this.getCurrentTool().onMouseMove(event);
        });
    }

    getCurrentTool(): BoardTool {
        return this.tools[this.currentTool];
    }

    getCurrentToolIndex(): number {
        return this.currentTool;
    }
}

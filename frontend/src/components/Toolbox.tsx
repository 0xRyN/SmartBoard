import './Toolbox.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPen,
    faPenFancy,
    faEraser,
    faMousePointer,
    faUndo,
    faRedo,
    faTrash,
    faFont,
} from '@fortawesome/free-solid-svg-icons';

import ToolSelector from '../model/ToolSelector';
import WhiteboardState from '../model/WhiteboardState';

type ToolboxProps = {
    toolSelector: ToolSelector | null;
    whiteboardState: WhiteboardState | null;
};

export default function Toolbox({
    toolSelector,
    whiteboardState,
}: ToolboxProps) {
    function selectTool(toolIndex: number) {
        if (!toolSelector) return;
        toolSelector.switchTool(toolIndex);
    }

    function undo() {
        if (!whiteboardState) return;
        whiteboardState.undo();
    }

    function redo() {
        if (!whiteboardState) return;
        whiteboardState.redo();
    }

    function clear() {
        if (!whiteboardState) return;
        whiteboardState.clear();
    }

    return (
        <div className="toolbox-wrapper">
            <div className="toolbox">
                <button className="tool-button" onClick={() => selectTool(0)}>
                    <FontAwesomeIcon icon={faPenFancy} />
                </button>
                <button className="tool-button" onClick={() => selectTool(1)}>
                    <FontAwesomeIcon icon={faPen} />
                </button>
                <button className="tool-button" onClick={() => selectTool(2)}>
                    <FontAwesomeIcon icon={faEraser} />
                </button>
                <button className="tool-button" onClick={() => selectTool(3)}>
                    <FontAwesomeIcon icon={faMousePointer} />
                </button>
                <button className="tool-button" onClick={() => selectTool(4)}>
                    <FontAwesomeIcon icon={faFont} />
                </button>

                <hr className="toolbox-separator" />

                <button className="tool-button" onClick={() => undo()}>
                    <FontAwesomeIcon icon={faUndo} />
                </button>
                <button className="tool-button" onClick={() => redo()}>
                    <FontAwesomeIcon icon={faRedo} />
                </button>
                <button className="tool-button" onClick={() => clear()}>
                    <FontAwesomeIcon icon={faTrash} />
                </button>
            </div>
        </div>
    );
}

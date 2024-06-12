import { useRef, useEffect, useState } from 'react';
import './Whiteboard.css';
import WhiteboardMaster from '../model/WhiteboardMaster';
import Toolbox from './Toolbox';
import ToolSelector from '../model/ToolSelector';
import WhiteboardState from '../model/WhiteboardState';

const Whiteboard = ({ width = 1400, height = 800 } = {}) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const whiteboardRef = useRef<WhiteboardMaster | null>(null);
    const [toolSelector, setToolSelector] = useState<ToolSelector | null>(null);
    const [whiteboardState, setWhiteboardState] =
        useState<WhiteboardState | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            whiteboardRef.current = new WhiteboardMaster(canvas);
            setToolSelector(whiteboardRef.current.getToolSelector());
            setWhiteboardState(whiteboardRef.current.getState());
        }

        return () => {
            if (whiteboardRef.current) {
                whiteboardRef.current.clearListeners();
            }
        };
    }, []);

    return (
        <div className="canvas-container">
            <Toolbox
                toolSelector={toolSelector}
                whiteboardState={whiteboardState}
            />
            <canvas ref={canvasRef} width={width} height={height} />
        </div>
    );
};

export default Whiteboard;

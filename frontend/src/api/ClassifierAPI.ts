import { io } from 'socket.io-client';
import { PossibleShape } from '../model/middleware/ShapeClassifier';
import { Stroke } from '../primitives/Stroke';
import { Point } from '../primitives/Point';

const socket = io('http://localhost:8765');

export default function classifyStroke(stroke: Stroke): Promise<PossibleShape> {
    // Check if the socket is connected
    if (!socket.connected) {
        // Return a default value if the socket is not connected
        return Promise.resolve('stroke');
    }

    const CONFIDENCE_THRESHOLD = 0.7;
    const pointList: Point[] = stroke.getPoints();

    const data = {
        points: pointList.map((point) => {
            return { x: point.x, y: point.y };
        }),
    };

    return new Promise((resolve, reject) => {
        // Benchmark the time taken to classify the stroke
        const start = performance.now();
        socket.emit('classify', data);

        socket.once('classification', (result) => {
            const end = performance.now();
            console.log(`Classification took ${end - start}ms.`);

            const prediction = result.classification;
            if (prediction.error) {
                console.error('Error classifying stroke:', result.error);
                resolve('stroke');
            } else if (prediction.confidence < CONFIDENCE_THRESHOLD) {
                console.log(
                    'Confidence below threshold, classifying as stroke.'
                );
                resolve('stroke');
            } else {
                switch (prediction.prediction) {
                    case 'ellipse':
                        resolve('circle');
                        break;
                    case 'triangle':
                        resolve('triangle');
                        break;
                    case 'rectangle':
                        resolve('rectangle');
                        break;
                    default:
                        resolve('stroke');
                }
            }
        });

        socket.once('disconnect', () =>
            reject('Disconnected before receiving a response.')
        );
        socket.once('connect_error', (err) =>
            reject(`Connection error: ${err.message}`)
        );
    });
}

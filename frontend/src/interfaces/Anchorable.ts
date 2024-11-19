import { Point } from '../primitives/Point';
import Drawable from './Drawable';

export default interface Anchorable extends Drawable {
    anchors: Array<Point>;
    getAnchors(): Array<Point>;
    setupAnchors(): void;
}

export function isAnchorable(drawable: Drawable): drawable is Anchorable {
    return 'getAnchors' in drawable;
}

import { Point } from '../primitives/Point';
import Anchorable from './Anchorable';

export default interface Linkable {
    linkTo(anchorable: Anchorable, anchorIndex: number): void;
    getLinkingPoint(): Point;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isLinkable(object: any): object is Linkable {
    return 'linkTo' in object;
}

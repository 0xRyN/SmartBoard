import { Vector2 } from '../util/maths';

export default interface Movable {
    move(vector: Vector2): void;
}

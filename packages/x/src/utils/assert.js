import { AssertionError } from '../errors';
export function assert(condition, message) {
    if (!condition) {
        throw new AssertionError(message);
    }
}
export function assertIsDefined(value) {
    if (value === undefined || value === null) {
        throw new Error(`Expected 'value' to be defined, but received ${value}`);
    }
}
//# sourceMappingURL=assert.js.map
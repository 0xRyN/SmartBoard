export default class KeybindManager {
    private keybindActions: Map<string, () => void>;

    constructor() {
        this.keybindActions = new Map();
        this.registerKeybindListeners();
    }

    private registerKeybindListeners(): void {
        document.addEventListener('keydown', (event) =>
            this.handleKeyDown(event)
        );
    }

    private handleKeyDown(event: KeyboardEvent): void {
        if (
            event.target instanceof HTMLInputElement ||
            event.target instanceof HTMLTextAreaElement
        ) {
            return; // Ignore keybinds if typing in an input or textarea
        }
        const keySignature = this.getKeySignature(event);

        if (this.keybindActions.has(keySignature)) {
            event.preventDefault();
            const action = this.keybindActions.get(keySignature);
            action?.();
        }
    }

    private getKeySignature(event: KeyboardEvent): string {
        const keys = [];

        if (event.ctrlKey) keys.push('CTRL');
        if (event.shiftKey) keys.push('SHIFT');
        if (event.altKey) keys.push('ALT');
        if (event.metaKey) keys.push('CTRL'); // Mac command key, treated as Ctrl

        keys.push(event.key.toUpperCase());
        return keys.join('+');
    }

    public addKeybind(keyCombination: string, action: () => void): void {
        this.keybindActions.set(keyCombination.toUpperCase(), action);
    }

    public removeKeybind(keyCombination: string): void {
        this.keybindActions.delete(keyCombination.toUpperCase());
    }

    public removeKeybindListeners(): void {
        document.removeEventListener('keydown', (event) =>
            this.handleKeyDown(event)
        );
    }
}

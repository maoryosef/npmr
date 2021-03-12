import logUpdate from 'log-update';
import InputHandler, { InputKey } from './input/inputHandler';
import * as terminal from './utils/terminal';
import * as renderer from './renderer';
import * as reader from './scriptsReader';
import { spawnSync } from 'child_process';
import fuzzyFind from './fuzzyFind';

const input = new InputHandler({ 
    stdin: process.stdin
})

terminal.clear();

const scripts = reader.readScripts();
let results = fuzzyFind(scripts, '', ['cmd', 'name'])
let selectedIdx = 0;

function render(handler: InputHandler) {
    logUpdate([
        renderer.renderSearchString(handler.value, handler.cursorPos),
        renderer.renderScripts(results, selectedIdx),
    ].join('\n')
    )
}

render(input);

function clamp(value: number, min: number, max: number) {
    if (value < min) {
        return min;
    }
    
    if (value > max) {
        return max;
    }
    
    return value;
}

input.on('change', (handler, key) => {
    switch (key) {
        case InputKey.DOWN: selectedIdx++; break;
        case InputKey.UP: selectedIdx--; break;
    }
    
    results = fuzzyFind(scripts, handler.value, ['cmd', 'name']);
    selectedIdx = clamp(selectedIdx, 0, results.length - 1);

    render(handler);
})

input.on('select', () => {
    terminal.clear();
    input.end();
    spawnSync('yarn', [scripts[selectedIdx].cmd], {stdio: 'inherit', shell: true});

    process.exit();
})

input.on('exit', () => {
    terminal.clear();
    input.end();
    process.exit();
})
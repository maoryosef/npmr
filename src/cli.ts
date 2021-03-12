import logUpdate from 'log-update';
import InputHandler, { InputKey } from './input/inputHandler';
import * as terminal from './utils/terminal';
import {clamp} from './utils/math';
import * as renderer from './renderer';
import * as reader from './scriptsReader';
import { spawnSync } from 'child_process';
import fuzzyFind from './fuzzyFind';

const input = new InputHandler({ 
    stdin: process.stdin
})

terminal.clear();

const scripts = reader.readScripts();
let results = fuzzyFind(scripts)
let selectedIdx = 0;

function render(handler: InputHandler) {
    logUpdate([
        renderer.renderSearchString(handler.value, handler.cursorPos),
        renderer.renderScripts(results, selectedIdx),
    ].join('\n')
    )
}

render(input);

input.on('change', (handler, key) => {
    switch (key) {
        case InputKey.DOWN: selectedIdx++; break;
        case InputKey.UP: selectedIdx--; break;
    }
    
    results = fuzzyFind(scripts, handler.value);
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
import chalk from 'chalk';
import figures from 'figures';

import { PackageJsonScript } from './scriptsReader';

export function renderValue(value: string, cursorPos: number): string {
    const prefix = chalk.cyan(`Search task${figures.pointer} `)
    
    if (value === '') {
        return prefix + value + chalk.dim.gray('Start typing to search...');
    }
    
    if (cursorPos === value.length) {
        return prefix + value + chalk.inverse(' ');
    }

    const firstChunk = value.slice(0, cursorPos);
    const corsurChar = value.slice(cursorPos, cursorPos + 1);
    const secondChunk = value.slice(cursorPos + 1);

    return prefix + firstChunk + chalk.inverse(corsurChar) + secondChunk;
}

export function renderScripts(scripts: PackageJsonScript[], selectedIdx: number): string {
    return scripts.map((script, idx) =>
        selectedIdx === idx ? 
            `${figures.play} ${chalk.bold(script.name)}\t ${chalk.white(script.cmd)}` :
            `  ${chalk.dim(script.name)}\t ${chalk.dim(script.cmd)}`
    ).join('\n');
}
import chalk from 'chalk';
import figures from 'figures';
import { SearchResult } from './fuzzyFind';

type SearchResultKey = keyof SearchResult['highlights']

export function renderSearchString(value: string, cursorPos: number): string {
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

function getStringToRender(result: SearchResult, key: SearchResultKey, padding = 0): string {
    const valueOrHighlight = result.highlights[key] ?? result.value[key]
    
    return valueOrHighlight.padEnd(padding, ' ')
}

export function renderScripts(scripts: SearchResult[], selectedIdx: number): string {
    const maxScriptLength = scripts.reduce((maxLen, v) => Math.max(maxLen, v.value.name.length), -Infinity)
    
    return scripts.map((script, idx) =>
        selectedIdx === idx ? 
            `${figures.play} ${chalk.bold(getStringToRender(script, 'name', maxScriptLength))}\t ${chalk.white(getStringToRender(script, 'cmd'))}` :
            `  ${chalk.dim(getStringToRender(script, 'name', maxScriptLength))}\t ${chalk.dim(getStringToRender(script, 'cmd'))}`
    ).join('\n');
}
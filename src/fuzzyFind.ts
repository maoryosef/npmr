import fuzzysort from 'fuzzysort';
import { PackageJsonScript } from './scriptsReader';

const KEYS = ['cmd', 'name']
const HIGHLIGHT_SPLIT_CHAR = '\x00'
export interface Highlight {
  value: string;
  highlighted: boolean;
}
export interface SearchResult {
    value: PackageJsonScript;
    score: number;
    highlights: {
      cmd?: Highlight[];
      name?: Highlight[];
    }
}

const packageJsonScriptToSearchResult = (value: PackageJsonScript) : SearchResult =>
  ({value, score: 0, highlights: {}})

const toHighlights = (highlightedString: string | null) : Highlight[] | null => {
    if (!highlightedString) {
      return null;
    }
    
    const highlights: Highlight[] = []
    let highlighted = false;
    let value = ''    
    
    for (const c of highlightedString) {
      if (c === HIGHLIGHT_SPLIT_CHAR) {
        highlights.push({
          highlighted,
          value
        })
        
        value = ''
        highlighted = !highlighted
      } else {
        value += c
      }
    }
    
    if (value.length > 0) {
      highlights.push({
        highlighted: false,
        value
      })
    }
    
    return highlights
}

const getHighlights = (result: Fuzzysort.Result[], idx: number): Highlight[] | null =>
  toHighlights(fuzzysort.highlight(result[idx], HIGHLIGHT_SPLIT_CHAR, HIGHLIGHT_SPLIT_CHAR))


const fuzzySortResultToSearchResult = (result: Fuzzysort.KeyResult<PackageJsonScript>) : SearchResult =>
 ({
  value: result.obj,
  score: result.score,
  highlights: KEYS.reduce((obj, key, idx) =>
    ({ ...obj, [key]: getHighlights(result as unknown as Fuzzysort.Result[], idx) }), {}),
})

const doFuzzySort = (list: Array<PackageJsonScript>, query: string): SearchResult[] =>
  fuzzysort
    .go(query, list, {
      keys: KEYS,
      limit: 16, // Don't return more results than this (lower is faster)
      allowTypo: true, // (false is faster)
    })
    // @ts-ignore
    .sort((a, b) => a.score < b.score)
    .map(fuzzySortResultToSearchResult)

export default (list: Array<PackageJsonScript>, query: string = ''): SearchResult[] => 
    query.trim().length > 0 ? 
      doFuzzySort(list, query) :
      list.map(packageJsonScriptToSearchResult)
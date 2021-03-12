import fuzzysort from 'fuzzysort';
import { PackageJsonScript } from './scriptsReader';

const KEYS = ['cmd', 'name']
const HIGHLIGHT_SPLIT_CHAR = '\x00'
export interface Highlight {
  before: string;
  hightlight: string;
  after: string;
}
export interface SearchResult {
    value: PackageJsonScript;
    score: number;
    highlights: {
      cmd?: Highlight;
      name?: Highlight;
    }
}

const packageJsinScriptToSearchResult = (value: PackageJsonScript) : SearchResult =>
  ({value, score: 0, highlights: {}})

const toHighlight = (highlightedString: string | null) : Highlight | null => {
    if (!highlightedString) {
      return null;
    }
    
    const [before, hightlight, after] = highlightedString.split(HIGHLIGHT_SPLIT_CHAR)
    
    return {
      before,
      hightlight,
      after
    }
}

const getHighlight = (result: Fuzzysort.Result[], idx: number): Highlight | null =>
  toHighlight(fuzzysort.highlight(result[idx], HIGHLIGHT_SPLIT_CHAR, HIGHLIGHT_SPLIT_CHAR))


const fuzzySortResultToSearchResult = (result: Fuzzysort.KeyResult<PackageJsonScript>) : SearchResult =>
 ({
  value: result.obj,
  score: result.score,
  highlights: KEYS.reduce((obj, key, idx) =>
    ({ ...obj, [key]: getHighlight(result as unknown as Fuzzysort.Result[], idx) }), {}),
})

const doFuzzySort = (list: Array<PackageJsonScript>, query: string): SearchResult[] =>
  fuzzysort
    .go(query, list, {
      keys: KEYS,
      threshold: -20, // Don't return matches worse than this (higher is faster)
      limit: 16, // Don't return more results than this (lower is faster)
      allowTypo: true, // (false is faster)
    })
    // @ts-ignore
    .sort((a, b) => a.score < b.score)
    .map(fuzzySortResultToSearchResult)

export default (list: Array<PackageJsonScript>, query: string = ''): SearchResult[] => 
    query.trim().length > 0 ? 
      doFuzzySort(list, query) :
      list.map(packageJsinScriptToSearchResult)
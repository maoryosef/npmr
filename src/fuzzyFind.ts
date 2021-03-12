import fuzzysort from 'fuzzysort';
import { PackageJsonScript } from './scriptsReader';

export interface SearchResult {
    value: PackageJsonScript;
    score: number;
    highlights: {
      cmd?: string;
      name?: string;
    }
}

const toSearchResult = (value: PackageJsonScript) : SearchResult =>
  ({value, score: 0, highlights: {}})
  
const doFuzzySort = (list: Array<PackageJsonScript>, query: string, keys: string[]): SearchResult[] =>
  fuzzysort
    .go(query, list, {
      keys,
      threshold: -20, // Don't return matches worse than this (higher is faster)
      limit: 16, // Don't return more results than this (lower is faster)
      allowTypo: true, // (false is faster)
    })
    // @ts-ignore
    .sort((a, b) => a.score < b.score)
    .map((result: Fuzzysort.KeyResult<PackageJsonScript>) => {
      return {
        value: result.obj,
        score: result.score,
        highlights: keys.reduce((obj, key, idx) =>
          ({ ...obj, [key]: fuzzysort.highlight((result as unknown as Fuzzysort.Result[])[idx], '\u001b[32m', '\u001b[39m') }), {}),
      };
    })

export default (list: Array<PackageJsonScript>, query: string = '', keys: string[]): SearchResult[] => 
    query.trim().length > 0 ? 
      doFuzzySort(list, query, keys) :
      list.map(toSearchResult)
import {setFixture, beforeAndAfter} from './fixtures'
import {PackageJsonScript, readScripts} from '../src/scriptsReader'
import fuzzyFind from '../src/fuzzyFind';

beforeAndAfter()

describe('fuzzyFind', () => {
    describe('when query is empty', () => {
        test('should return all scripts', () => {
            setFixture('simplePackage')
            const scripts = readScripts()
            
            expect(fuzzyFind(scripts)).toMatchSnapshot()
        })
    })

    describe('when query is not empty', () => {
        test.each(['webpack', 'tsc'])('should return matching scripts for query "%s"', query => {
            setFixture('simplePackage')
            const scripts = readScripts()
            
            expect(fuzzyFind(scripts, query)).toMatchSnapshot()
        })
    })
    
    describe('highilights', () => {
        test('should return highlighted object', () => {
            const scripts: PackageJsonScript[] = [{
                cmd: 'tsc --watch',
                name: 'build'
            }]
            
            const [result] = fuzzyFind(scripts, 'sc')
            
            expect(result.highlights.name).toBe(null)
            expect(result.highlights.cmd).toEqual([
                { highlighted: false, value: 't'},
                { highlighted: true, value: 'sc'},
                { highlighted: false, value: ' --watch'}
            ])
        })

        describe('when highlight contains multiple parts', () => {
            test('should return highlighted object', () => {
                const scripts: PackageJsonScript[] = [{
                    cmd: 'jest',
                    name: 'test'
                }]
                
                const [result] = fuzzyFind(scripts, 'ts')

                expect(result.highlights.name).toEqual([
                    { highlighted: false, value: ''},
                    { highlighted: true, value: 't'},
                    { highlighted: false, value: 'e'},
                    { highlighted: true, value: 's'},
                    { highlighted: false, value: 't'},
                ])
            })
        })
    })
})
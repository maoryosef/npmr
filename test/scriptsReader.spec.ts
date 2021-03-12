import {readScripts} from '../src/scriptsReader'
import {getFixtures, setFixture, beforeAndAfter} from './fixtures'

beforeAndAfter()

describe('scriptsReader', () => {
    test.each(getFixtures())('should read the scripts of "%s"', fixture => {

      setFixture(fixture)
      expect(readScripts()).toMatchSnapshot()
    });
})
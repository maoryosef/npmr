import {readdirSync} from 'fs'
import path from 'path'

const process = require('process'); //eslint-disable-line @typescript-eslint/no-var-requires

export const getFixtures = (): string[] =>
    readdirSync(__dirname, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)

export const setFixture = (fixture: string): void => {
    jest.spyOn(process, 'cwd').mockReturnValue(path.resolve(__dirname, fixture));
}

export const beforeAndAfter = (): void => {
    afterEach(() => {
        jest.clearAllMocks()
    })
}
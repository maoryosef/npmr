import {readdirSync} from 'fs'
import path from 'path'

const process = require('process');

export const getFixtures = () =>
readdirSync(__dirname, { withFileTypes: true })
.filter(dirent => dirent.isDirectory())
.map(dirent => dirent.name)

export const setFixture = (fixture: string) => {
    jest.spyOn(process, 'cwd').mockReturnValue(path.resolve(__dirname, fixture));
}

export const beforeAndAfter = () => {
    afterEach(() => {
        jest.clearAllMocks()
    })
}
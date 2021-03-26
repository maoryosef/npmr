import { join } from 'path';
import {readPackageJson} from './scriptsReader'

export const render = (): void => {
    const pkg = readPackageJson(join(__dirname, '..'))
    
    console.log(`
=============================================
    npmr version: ${pkg?.version}             
=============================================
`)
}

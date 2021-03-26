import pkg from '../package.json'

export const render = (): void => {
    console.log(`
=============================================
    npmr version: ${pkg.version}             
=============================================
`)
}

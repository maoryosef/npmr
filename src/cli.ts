import commandLineArgs from 'command-line-args'
import * as versionRenderer from './versionRenderer'
import npmr from './npmr'
interface CLIOptions {
    version: boolean
}

const optionsDefinitions: commandLineArgs.OptionDefinition[] = [
    { name: 'version', alias: 'v', type: Boolean, defaultValue: false}
]

try {
    const options = commandLineArgs(optionsDefinitions) as CLIOptions
 
    if (options.version) {
        versionRenderer.render()
    } else {
        npmr()
    }
} catch (e) {
    console.log(e.message)
}
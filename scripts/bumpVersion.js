'use strict'

const {spawnSync} = require('child_process')
const pkg = require('../package.json')
const {writeFileSync} = require('fs')
const {join} = require('path')

function calcNextVersion(publishedVersionStr, currentVersionStr) {
    const [pMajor, pMinor, pPatch] = publishedVersionStr.split('.').map(x => parseInt(x))
    const [cMajor, cMinor, cPatch] = currentVersionStr.split('.').map(x => parseInt(x))
    
    const nextVersion = [pMajor, pMinor, pPatch]
    
    if (pMajor < cMajor) {
        nextVersion[0] = cMajor
        nextVersion[1] = cMinor
        nextVersion[2] = cPatch
        
        return nextVersion.join('.')
    }

    if (pMinor < cMinor) {
        nextVersion[1] = cMinor
        nextVersion[2] = cPatch

        return nextVersion.join('.')
    }

    nextVersion[2]++
    
    return nextVersion.join('.')
}

const pkgName = pkg.name;
const currentVersionStr = pkg.version;

const value = spawnSync('npm' , ['show' , pkgName, '--json'], {encoding: 'utf-8'})
const currentPublished = JSON.parse(value.stdout)
const publishedVersionStr = currentPublished['dist-tags'].latest

const nextVersion = calcNextVersion(publishedVersionStr, currentVersionStr)

pkg.version = nextVersion

writeFileSync(join(__dirname, '..', 'package.json'), JSON.stringify(pkg, null, 2));

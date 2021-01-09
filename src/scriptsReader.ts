import { join } from 'path';
import { cwd } from 'process';
import { readFileSync } from 'fs';

interface PackageJson {
    scripts: Record<string, string>;
}

function readPackageJson(): PackageJson {
    const fileName = join(cwd(), 'package.json');
    
    return JSON.parse(readFileSync(fileName, 'utf-8'));
}

export interface PackageJsonScript {
    name: string;
    cmd: string;
}

export const readScripts = (): PackageJsonScript[] =>
    Object.entries(readPackageJson().scripts)
        .reduce<PackageJsonScript[]>((acc, [name, cmd]) => [...acc, { name, cmd }], [])

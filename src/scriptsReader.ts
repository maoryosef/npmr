import { join } from 'path';
import { cwd } from 'process';
import { readFileSync, existsSync } from 'fs';

interface PackageJson {
    scripts: Record<string, string>;
}

function readPackageJson(): PackageJson | null{
    const fileName = join(cwd(), 'package.json');
    
    if (existsSync(fileName)) {
        return JSON.parse(readFileSync(fileName, 'utf-8'));
    }
    
    return null;
}

export interface PackageJsonScript {
    name: string;
    cmd: string;
}

export const readScripts = (): PackageJsonScript[] =>
    Object.entries(readPackageJson()?.scripts || {})
        .reduce<PackageJsonScript[]>((acc, [name, cmd]) => [...acc, { name, cmd }], [])

import { join } from 'path';
import { cwd } from 'process';
import { readFileSync, existsSync } from 'fs';

interface PackageJson {
    version: string
    scripts: Record<string, string>;
}

export function readPackageJson(basePath = cwd()): PackageJson | null{
    const fileName = join(basePath, 'package.json');
    
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

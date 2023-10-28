import * as core from '@actions/core';
import * as minimatch from 'minimatch';
import { inspect } from 'util';

export function getFilteredPaths(paths: string[], includedGlob: string): string[] {
    const filteredPaths = minimatch.match(paths, includedGlob, { matchBase: true });
    core.startGroup('📂Filtered File paths');
    core.debug(`filteredPaths: ${inspect(filteredPaths)}`);
    core.endGroup();
    return filteredPaths;
}
/* eslint-disable no-useless-escape */
export function getRegexPattern(base: string, layers: number): string {
    let token = `([^./]*)\/`;
    for (let i = 1; i < layers; i++) {
        token += token;
    }
    const pattern = `^(?:${base})\/${token}`;
    core.debug(`🔍pattern: ${pattern}`);
    return pattern;
}
// return an array of tokens for each layer with the full path at the first index
// this will be used for output
export function getPathTokens(path: string, regexPattern: string): string[] {
    const regex = new RegExp(regexPattern);
    const found = path.match(regex);
    if (!found) {
        return [];
    }
    const allLayers = found.slice(1).join(':');
    // remove the tailing slash
    return [found[0].slice(0, -1), allLayers, ...found.slice(1)];
}
// first set is the full path
// second set is the all layers, eg: layer1:layer2:layer3
export function getTokenSets(filePaths: string[], pattern: string, layers: number, debugShowPaths: boolean): Set<string>[] {
    const labelTokenSets = [new Set<string>()];
    for (let i = 0; i <= layers; i++) {
        labelTokenSets.push(new Set<string>());
    }
    core.debug(`number of filePaths: ${filePaths.length}`);
    debugShowPaths && core.debug(`filePaths: ${inspect(filePaths)}`);
    for (const filePath of filePaths) {
        const tokens = getPathTokens(filePath, pattern);
        if (tokens.length !== layers + 2) {
            core.debug(`🔍Tokens: ${inspect(tokens)}`);
        }
        // convert to for ... of loop
        for (const [index, token] of tokens.entries()) {
            labelTokenSets[index].add(token);
        }
    }

    return labelTokenSets;
}

export function getLabels(prefixes: string, delimiter: string, labelTokenSets: Set<string>[]): string[] {
    let prefixArray = labelTokenSets.map(() => '');
    if (prefixes !== '') {
        if (prefixArray.length !== labelTokenSets.length) {
            core.error(`The number of prefixes (${prefixArray.length}) does not match the number of layers (${labelTokenSets.length})`);
        } else {
            prefixArray = prefixes.split('|');
        }
    }
    const labels = labelTokenSets.map((labelTokenSet, index) => {
        let prefix = prefixArray[index];
        if (prefix === 'skip') {
            return [];
        }
        if (prefix !== '') {
            prefix += delimiter;
        }
        const labelTokens = Array.from(labelTokenSet);
        return labelTokens.map(labelToken => `${prefix}${labelToken}`.trim());
    });
    return labels.flat();
}

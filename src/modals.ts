export enum INPUTS {
    authToken = 'authToken',
    prNumber = 'prNumber',
    prefixes = 'prefixes',
    delimiter = 'delimiter',
    layers = 'layers',
    basePaths = 'basePaths',
    debugShowPaths = 'debugShowPaths',
    skipLabels = 'skipLabels',
    includedGlob = 'includedGlob'
}

export interface IInputs {
    authToken: string;
    prNumber: number;
    prefixes: string;
    delimiter: string;
    layers: number;
    basePaths: string;
    debugShowPaths: boolean;
    skipLabels: boolean;
    includedGlob: string;
}

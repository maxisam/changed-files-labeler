import * as core from '@actions/core';
import { Octokit } from '@octokit/rest';
import { inspect } from 'util';
import { IInputs, INPUTS } from './modals';
export function getInputs(): IInputs {
    const inputs: IInputs = {
        authToken: core.getInput(INPUTS.authToken),
        prNumber: parseInt(core.getInput(INPUTS.prNumber), 10),
        prefixes: core.getInput(INPUTS.prefixes),
        delimiter: core.getInput(INPUTS.delimiter),
        layers: parseInt(core.getInput(INPUTS.layers), 10),
        basePaths: core.getInput(INPUTS.basePaths),
        includedGlob: core.getInput(INPUTS.includedGlob),
        debugShowPaths: core.getBooleanInput(INPUTS.debugShowPaths),
        skipLabels: core.getBooleanInput(INPUTS.skipLabels),
        maxLabels: parseInt(core.getInput(INPUTS.maxLabels), 10)
    };
    core.debug(`Inputs: ${inspect(inputs)}`);
    return inputs;
}

export function getGithubClient(authToken: string, userAgent = 'github-action'): Octokit {
    try {
        return new Octokit({
            auth: authToken,
            userAgent,
            baseUrl: 'https://api.github.com',
            log: {
                debug: () => {},
                info: () => {},
                warn: console.warn,
                error: console.error
            },
            request: {
                agent: undefined,
                fetch: undefined,
                timeout: 0
            }
        });
    } catch (error) {
        if (error instanceof Error) {
            core.setFailed(`Error creating octokit:\n${error.message}`);
        }
        throw error;
    }
}

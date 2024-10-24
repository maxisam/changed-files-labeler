import * as core from '@actions/core';
import { inspect } from 'util';
import { getGithubClient, getInputs } from './common';
import { addLabels, getPullRequestFiles } from './github-ops';
import { getFilteredPaths, getLabels, getRegexPattern, getTokenSets } from './utils';

async function run(): Promise<void> {
    const inputs = getInputs();
    core.debug(`🔍Inputs: ${inspect(inputs)}`);
    const githubClient = getGithubClient(inputs.authToken, 'github-action');
    try {
        const filePaths = await getPullRequestFiles(githubClient, inputs.prNumber);
        core.setOutput('changed', filePaths);
        const filteredPaths = getFilteredPaths(filePaths, inputs.includedGlob);
        const pattern = getRegexPattern(inputs.basePaths, inputs.layers);
        const tokenSets = getTokenSets(filteredPaths, pattern, inputs.layers, inputs.debugShowPaths);
        core.setOutput('paths', Array.from(tokenSets[0]));
        // only get sets for labels
        const labels = getLabels(inputs.prefixes, inputs.delimiter, tokenSets.slice(1), inputs.maxLabels);
        core.setOutput('labels', labels);
        if (!labels.length) {
            core.warning('No labels found');
            return;
        }
        !inputs.skipLabels && (await addLabels(githubClient, inputs.prNumber, labels));
    } catch (error) {
        if (error instanceof Error) {
            core.setFailed(`Fail to run this action: ${error.message}`);
        }
        throw error;
    }
}

run();

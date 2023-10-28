import * as core from '@actions/core';
import { context } from '@actions/github';
import { Octokit } from '@octokit/rest';
import { inspect } from 'util';

export async function getPullRequestFiles(githubClient: Octokit, prNumber: number): Promise<string[]> {
    // https://octokit.github.io/rest.js/v19#pagination
    // will get 3000 files at a time
    const paths = await githubClient.paginate(githubClient.pulls.listFiles, { ...context.repo, pull_number: prNumber }, response =>
        response.data.map(file => file.filename)
    );
    core.startGroup('📂File paths');
    core.debug(`filePaths: ${inspect(paths)}`);
    core.endGroup();
    return paths;
}

export async function addLabels(githubClient: Octokit, prNumber: number, labels: string[]): Promise<void> {
    await githubClient.issues.addLabels({
        ...context.repo,
        issue_number: prNumber,
        labels
    });
}

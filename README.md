[![🌞 CI](https://github.com/maxisam/changed-files-labeler/actions/workflows/CI.yml/badge.svg)](https://github.com/maxisam/changed-files-labeler/actions/workflows/CI.yml)

# Changed File Labeler

Create labels based on the path of the changed files.

This is very helpful for monorepo projects.

1. when you want to label PRs based on the changed files.
2. when you want to trigger actions based on the changed files' path.

This action is heavily inspired by https://github.com/TinkurLab/monorepo-pr-labeler-action

It is for the case like

a file changed at `base/foo/bar/cat.ts`

and you want to create labels like `prefix1:foo:bar` and `prefix2:foo` and `prefix3:bar` with the output like `base/foo/bar` and a list of added labels. It is also possible to have prefix1 and prefix2 only.

It allows you to define how many layers of the path you want to use to create labels.

## Usage

```yaml
labeler:
    name: Labeler
    runs-on: ubuntu-latest
    steps:
        - uses: actions/checkout@v3
        - uses: maxisam/changed-files-labeler@main
          with:
              authToken: ${{ secrets.GITHUB_TOKEN }}
              basePaths: 'base1|base2'
              prefixes: 'prefix1|prefix2|prefix3'
              delimiter: ':'
              layers: 2
```

## Inputs

READ [Action YAML](./action.yml)

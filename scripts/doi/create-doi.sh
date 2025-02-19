#!/bin/bash

files=$(git diff --diff-filter=AMR --name-only ${VERCEL_GIT_PREVIOUS_SHA} ${VERCEL_GIT_COMMIT_SHA} -- content/**/*.mdx | xargs)

for file in $files; do
	node --experimental-strip-types ./scripts/doi/create-doi.ts --resource $file
	git add $file
done

if [[ -n "$(git diff --staged)" ]]; then
	git config user.name "${GITHUB_USERNAME}"
	git config user.email "${GITHUB_EMAIL}"
	git commit -m "content: add doi [skip ci]"
	git push origin
fi

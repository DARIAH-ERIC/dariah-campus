#!/bin/bash

if [[ ${VERCEL_ENV} != "production" || ${VERCEL_GIT_COMMIT_REF} != "main" ]]; then
  echo "Skipping handle generation."
	exit 0
fi

files=$(git diff --diff-filter=AMR --name-only ${VERCEL_GIT_PREVIOUS_SHA} ${VERCEL_GIT_COMMIT_SHA} -- content/**/*.mdx | xargs)

for file in $files; do
  echo "Processing ${file}..."

  pnpm tsx ./scripts/handle/create-handle.ts --resource ${file}

  git add ${file}
done

if [[ -n "$(git diff --staged)" ]]; then
  echo "Pushing changes to github..."

  if ! git remote | grep -q origin; then
    git remote add origin https://$GITHUB_TOKEN@github.com/$VERCEL_GIT_REPO_OWNER/$VERCEL_GIT_REPO_SLUG.git
  fi

  git config user.name "${GITHUB_USERNAME}"
  git config user.email "${GITHUB_EMAIL}"

  git add -A
  git commit -m "content: add handle [skip ci]"
  git push origin HEAD:main
fi



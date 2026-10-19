#!/bin/bash

if [[ ${VERCEL_ENV} != "production" || ${VERCEL_GIT_COMMIT_REF} != "main" ]]; then
  echo "Skipping handle generation."
	exit 0
fi

branch="content/add-handle-${VERCEL_GIT_COMMIT_SHA:0:12}"
repo="${VERCEL_GIT_REPO_OWNER}/${VERCEL_GIT_REPO_SLUG}"

files=$(git diff --diff-filter=AMR --name-only ${VERCEL_GIT_PREVIOUS_SHA} ${VERCEL_GIT_COMMIT_SHA} -- 'content/*/curricula/**/index.mdx' 'content/*/resources/**/index.mdx' ':(exclude)content/*/resources/external/**' | xargs)

if [[ -n "${files}" ]]; then
  # Two production builds can run concurrently (e.g. when two pull requests are merged
  # in quick succession) and then share the same VERCEL_GIT_PREVIOUS_SHA, so the same
  # resource can show up in both diffs. Skip resources which already have a handle
  # waiting in an open pull request, so we don't mint a second one.
  if ! pending=$(pnpm tsx ./scripts/handle/list-pending-handle-files.ts); then
    echo "Failed to list open handle pull requests."
    exit 1
  fi
fi

for file in $files; do
  if grep -qxF "${file}" <<<"${pending}"; then
    echo "Skipping ${file}, a pull request with its handle is already open."
    continue
  fi

  echo "Processing ${file}..."

  pnpm tsx ./scripts/handle/create-handle.ts --resource ${file}

  git add ${file}
done

if [[ -n "$(git diff --staged)" ]]; then
  echo "Pushing changes to github pull request..."

  origin="https://${GITHUB_TOKEN}@github.com/${VERCEL_GIT_REPO_OWNER}/${VERCEL_GIT_REPO_SLUG}.git"

  if git remote | grep -q origin; then
    git remote set-url origin "${origin}"
  else
    git remote add origin "${origin}"
  fi

  git config user.name "${GITHUB_USERNAME}"
  git config user.email "${GITHUB_EMAIL}"

  title="content: add handle"
  body="Adds generated handle metadata for content changed in ${VERCEL_GIT_COMMIT_SHA}."

  git add -A
  git commit -m "content: add handle [skip ci]"
  git push --force-with-lease origin "HEAD:${branch}"

  curl --fail --silent --show-error \
    --request POST \
    --header "Authorization: Bearer ${GITHUB_TOKEN}" \
    --header "Accept: application/vnd.github+json" \
    --header "X-GitHub-Api-Version: 2022-11-28" \
    --data "{\"title\":\"${title}\",\"head\":\"${branch}\",\"base\":\"main\",\"body\":\"${body}\"}" \
    "https://api.github.com/repos/${repo}/pulls"
fi

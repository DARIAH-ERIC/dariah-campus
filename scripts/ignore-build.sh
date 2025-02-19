#!/bin/bash

# Needs to be set in the "Ignored Build Step" project setting in the vercel dashboard
# with `bash ./scripts/ignore-build.sh`.
#
# @see https://vercel.com/docs/projects/project-configuration/git-settings#ignored-build-step

if [[ "$VERCEL_GIT_COMMIT_MESSAGE" != *"[skip ci]"* ]]; then
	echo "✅ - Build can proceed"
	exit 1;
else
  echo "🛑 - Build cancelled"
  exit 0;
fi

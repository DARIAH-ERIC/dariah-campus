#!/bin/bash
# this script controls ignored build steps

echo "NEXT_PUBLIC_GIT_BRANCH: $NEXT_PUBLIC_GIT_BRANCH"

if [[ "$NEXT_PUBLIC_GIT_BRANCH" == "main" || "$NEXT_PUBLIC_GIT_BRANCH" == "elexis"  ]] ; then
  # Proceed with the build
	echo "✅ - Build can proceed"
  exit 1;
else
  # Don't build
  echo "🛑 - Build cancelled"
  exit 0;
fi

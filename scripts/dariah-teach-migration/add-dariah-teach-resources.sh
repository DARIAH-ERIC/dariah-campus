#!/bin/bash

curricula_path="content/en/curricula"
resources_path="content/en/resources/hosted"
assets_path="public/"

folders=($(ls -d ./dariah-teach-migration/curricula/*/))

echo "Select a folder by number:"
for i in "${!folders[@]}"; do
    echo "$((i+1)). ${folders[i]%/}"
done

read input

selected_folder="${folders[$input - 1]}"

selected_folder_name=$(basename ${selected_folder})

cp -r $selected_folder $curricula_path

# curricula have related resources that need to be copied too
cp -r ./dariah-teach-migration/hosted/resources/${selected_folder_name}* $resources_path

# copy downloaded and unziped assets
if [ -e ./dariah-teach-assets/${selected_folder_name} ]; then
	cp -r ./dariah-teach-assets/${selected_folder_name}/* $assets_path
fi

# update tags in mdx files
pnpm run update:dariah-teach-tags $selected_folder_name


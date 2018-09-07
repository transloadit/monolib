#!/usr/bin/env bash
# This file:
#
#  - Takes files from ./funcs/*.js
#  - Copies them to ./packages/*/.js and inits a package.json there if needed
#
# Run as:
#
#  ./spread.sh # right before publishing
#
# Authors:
#
#  - Kevin van Zonneveld <kevin@transloadit.com>

set -o pipefail
set -o errexit
set -o nounset
# set -o xtrace

# Set magic variables for current FILE & DIR
__dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
__root="$(cd "$(dirname "${__dir}")" && pwd)"
# __file="${__dir}/$(basename "${BASH_SOURCE[0]}")"
# __base="$(basename ${__file} .sh)"

replace() {
  local file="${1}"
  local expression="${2}"
  tfn="$(mktemp file.XXXXXX)" && jq "${expression}" "${file}" > "${tfn}" && mv "${tfn}" "${file}"
}

hasher () {
  local file="${1}"
  type md5 > /dev/null && md5 "${file}" |awk '{print $NF}'
}

mkdir -p "${__root}/packages"
for i in "${__root}/packages/"*; do
  basename=$(basename "${i}" ".js")
  if [ ! -f "${__root}/funcs/${basename}.js" ]; then
    (git rm -rf "${__root}/packages/${basename}" && git commit -m "Auto-delete packages/${basename} package as funcs/${basename}.js no longer exists") || rm -rf "${__root}/packages/${basename}"
  fi
done

for i in "${__root}/funcs/"*".js"; do
  basename=$(basename "${i}" ".js")
  mkdir -p "${__root}/packages/${basename}"
  cp -vaf "${__root}/funcs/${basename}.js" "${__root}/packages/${basename}/${basename}.js"
  if [ ! -f "${__root}/packages/${basename}/package.json" ]; then
    cp -vaf "${__root}/template/package.json" "${__root}/packages/${basename}/package.json"
    replace "${__root}/template/package.json" ".version = \"0.0.1"
  fi
  
  replace "${__root}/template/package.json" ".name = \"@kvz/${basename}\""
  
  if [ ! -f "${__root}/packages/${basename}/.npmignore" ]; then
    cp -vaf "${__root}/template/.npmignore" "${__root}/packages/${basename}/.npmignore"
  fi

  # oldHash=$(cat "${__root}/packages/${basename}/hash" 2>/dev/null) || true
  # newHash=$(hasher "${__root}/funcs/${basename}.js") || true

  # echo "funcs/${basename}.js old=${oldHash} new=${newHash}"
  # if [ "${oldHash}" != "${newHash}" ]; then
  #   echo "hit"
  # fi
done
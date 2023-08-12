#!/usr/bin/env bash
set -o xtrace

git stash
git checkout "$1"
git reset --hard master
git checkout master
git stash pop
git push -f origin "$1"
#!/bin/bash

# Stage changes
git add .

# Commit changes with comment
git commit -m "$1"

# Push changes to remote repository
git push
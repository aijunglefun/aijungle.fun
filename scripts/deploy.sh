#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Load GitHub token from environment variable
if [ -z "$GITHUB_TOKEN" ]; then
    echo -e "${RED}Error: GITHUB_TOKEN environment variable is not set${NC}"
    exit 1
fi

# Get current branch name
BRANCH=$(git rev-parse --abbrev-ref HEAD)

echo -e "${GREEN}Deploying updates to GitHub...${NC}"

# Add all changes
git add .

# Prompt for commit message
echo -e "${GREEN}Enter commit message:${NC}"
read commit_msg

# Commit changes
git commit -m "$commit_msg"

# Push to GitHub using token from environment
git push "https://oauth2:$GITHUB_TOKEN@github.com/aijunglefun/aijungle.fun.git" $BRANCH

echo -e "${GREEN}Deployment complete!${NC}" 
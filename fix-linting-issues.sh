#!/bin/bash

# Print colored output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Fixing linting issues in the project${NC}"

# First, run the linter to check for issues
echo -e "${YELLOW}Running deno lint to identify issues...${NC}"
LINT_OUTPUT=$(deno lint src/ --json 2>&1)
LINT_EXIT_CODE=$?

if [ $LINT_EXIT_CODE -ne 0 ]; then
  # Count issues by type
  ANY_TYPE_COUNT=$(echo "$LINT_OUTPUT" | grep -o "any.type.is.not.allowed" | wc -l)
  UNUSED_VARS_COUNT=$(echo "$LINT_OUTPUT" | grep -o "no-unused-vars" | wc -l)
  AWAIT_ISSUES_COUNT=$(echo "$LINT_OUTPUT" | grep -o "require-await" | wc -l)

  echo -e "${RED}Found linting issues:${NC}"
  echo -e "${YELLOW}- ${ANY_TYPE_COUNT} uses of 'any' type${NC}"
  echo -e "${YELLOW}- ${UNUSED_VARS_COUNT} unused variables${NC}"
  echo -e "${YELLOW}- ${AWAIT_ISSUES_COUNT} async functions without await${NC}"

  echo -e "\n${YELLOW}Applying automatic fixes where possible...${NC}"

  # Fix unused variables by prefixing them with underscore
  FILES_WITH_UNUSED=$(echo "$LINT_OUTPUT" | grep "no-unused-vars" | awk -F '"filename": "' '{print $2}' | awk -F '",' '{print $1}' | sort | uniq | sed 's|file:///||')

  for FILE in $FILES_WITH_UNUSED; do
    VARS=$(echo "$LINT_OUTPUT" | grep -A 3 $FILE | grep "no-unused-vars" | grep -o '`[^`]*`' | sed 's/`//g')

    for VAR in $VARS; do
      echo -e "Fixing unused variable ${GREEN}$VAR${NC} in ${GREEN}$FILE${NC}"
      # Use sed to replace the variable with _variable
      # This is a simplistic approach that might need manual review
      sed -i '' "s/\b$VAR\b/_$VAR/g" "$FILE"
    done
  done

  # For the 'any' type issues, we need to be more careful and can't easily automate
  # these need manual inspection
  echo -e "\n${YELLOW}Manual fixes required:${NC}"
  echo -e "${RED}Please manually address the following issues:${NC}"
  echo -e "1. Replace 'any' types with more specific types"
  echo -e "2. Add 'await' statements to async functions or remove 'async'"
  echo -e "3. Add type='button' attributes to button elements"

  echo -e "\n${YELLOW}Specific files requiring manual attention:${NC}"
  FILES_WITH_ANY=$(echo "$LINT_OUTPUT" | grep "no-explicit-any" | awk -F '"filename": "' '{print $2}' | awk -F '",' '{print $1}' | sort | uniq | sed 's|file:///||')
  for FILE in $FILES_WITH_ANY; do
    echo -e "${GREEN}- $FILE${NC} (contains 'any' type)"
  done

  FILES_WITH_AWAIT=$(echo "$LINT_OUTPUT" | grep "require-await" | awk -F '"filename": "' '{print $2}' | awk -F '",' '{print $1}' | sort | uniq | sed 's|file:///||')
  for FILE in $FILES_WITH_AWAIT; do
    echo -e "${GREEN}- $FILE${NC} (has async functions without await)"
  done

  echo -e "\n${YELLOW}Re-running linter to check remaining issues...${NC}"
  deno lint src/ --json | jq '.diagnostics[].message' | sort | uniq -c | sort -nr

  echo -e "\n${YELLOW}For full linting details, use:${NC} deno lint src/"
else
  echo -e "${GREEN}No linting issues found!${NC}"
fi

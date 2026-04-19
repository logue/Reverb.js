#!/bin/zsh
FILE_COUNT=0
BROKEN_COUNT=0

while IFS= read -r file; do
    ((FILE_COUNT++))
    dir=$(dirname "$file")
    
    # Extract relative imports starting with .
    imports=$(grep "from '" "$file" | sed -n "s/.*from '\(\..*\)'.*/\1/p")
    
    while IFS= read -r imp; do
        [[ -z "$imp" ]] && continue
        
        target_base="$dir/$imp"
        
        # Check for .d.ts or /index.d.ts
        if [[ ! -f "${target_base}.d.ts" && ! -f "${target_base}/index.d.ts" ]]; then
            echo "BROKEN: $file -> $imp"
            ((BROKEN_COUNT++))
        fi
    done <<< "$imports"
done < <(find dist/src -type f -name '*.d.ts' | sort)

echo "FILE_COUNT: $FILE_COUNT"
echo "BROKEN_COUNT: $BROKEN_COUNT"

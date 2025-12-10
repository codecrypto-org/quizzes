#!/bin/bash

echo "🚀 Starting quiz import..."
echo ""

count=0
for file in *.json; do
  if [ "$file" != "package.json" ]; then
    echo "📝 Importing $file..."
    response=$(curl -s -X POST http://localhost:1338/quizzes \
      -H "Content-Type: application/json" \
      -d @"$file")

    title=$(echo "$response" | grep -o '"title":"[^"]*"' | head -1 | cut -d'"' -f4)

    if [ -n "$title" ]; then
      echo "   ✅ Successfully imported: $title"
      ((count++))
    else
      echo "   ❌ Failed to import $file"
      echo "   Response: $response"
    fi
    echo ""
  fi
done

echo "✨ Import complete! Imported $count quizzes."

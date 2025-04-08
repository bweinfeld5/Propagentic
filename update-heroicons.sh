#!/bin/bash

echo "Updating Heroicons imports from v1 to v2 format..."

# Find and update all files with old Heroicons imports
find src -type f \( -name "*.js" -o -name "*.jsx" \) -exec grep -l "@heroicons/react/outline" {} \; | while read file; do
  echo "Processing $file..."
  
  # Replace import path
  sed -i '' 's|@heroicons/react/outline|@heroicons/react/24/outline|g' "$file"
  
  # Replace icon names that have changed
  sed -i '' 's/ClipboardListIcon/ClipboardDocumentListIcon/g' "$file"
  sed -i '' 's/XIcon/XMarkIcon/g' "$file"
  sed -i '' 's/ExclamationIcon/ExclamationTriangleIcon/g' "$file"
  sed -i '' 's/MenuIcon/Bars3Icon/g' "$file"
  sed -i '' 's/MenuAlt2Icon/Bars3BottomLeftIcon/g' "$file"
  sed -i '' 's/DocumentAddIcon/DocumentPlusIcon/g' "$file"
  sed -i '' 's/DotsVerticalIcon/EllipsisVerticalIcon/g' "$file"
done

echo "Heroicons imports updated successfully!" 


# Create tree of backend-drf directory into structure-backend.txt
tree .\backend-drf /F /A > structure-backend.txt

# Add an empty line for spacing
"" | Out-File -Append structure-backend.txt
Write-Output "Root Files (backend-drf):" | Out-File -Append structure-backend.txt

# Add only files from the root directory (backend-drf)
Get-ChildItem -Path .\backend-drf -File | Where-Object { 
  $_.Name -notmatch 'package-lock\.json|\.DS_Store|yarn\.lock' 
} | ForEach-Object {
  $_.Name 
} >> structure-backend.txt

# Create tree of src directory in frontend-react into structure-frontend.txt
tree .\frontend-react\src /F /A > structure-frontend.txt

# Add an empty line for spacing
"" | Out-File -Append structure-frontend.txt
Write-Output "Root Files (frontend-react):" | Out-File -Append structure-frontend.txt

# Add only files from the root directory (frontend-react)
Get-ChildItem -Path .\frontend-react -File | Where-Object { 
  $_.Name -notmatch 'package-lock\.json|\.DS_Store|yarn\.lock' 
} | ForEach-Object {
  $_.Name 
} >> structure-frontend.txt

# Combine both structure-backend.txt and structure-frontend.txt into structure-project.txt
Write-Output "Backend Project Structure:" | Out-File -FilePath structure-project.txt
Get-Content structure-backend.txt | Out-File -Append structure-project.txt

Write-Output "" | Out-File -Append structure-project.txt
Write-Output "Frontend Project Structure:" | Out-File -Append structure-project.txt
Get-Content structure-frontend.txt | Out-File -Append structure-project.txt

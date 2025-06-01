# BACKEND
tree .\backend-drf /F /A | Where-Object {
    $_ -notmatch '\.jpg$|\.png$|\.jpeg$' -and
    $_ -notmatch '\\migrations\\' -and
    $_ -notmatch '\\__pycache__\\'
} > structure-backend.txt

"" | Out-File -Append structure-backend.txt
"Root Files (backend-drf):" | Out-File -Append structure-backend.txt

Get-ChildItem -Path .\backend-drf -File | Where-Object {
    $_.Name -notmatch 'package-lock\.json|\.DS_Store|yarn\.lock'
} | ForEach-Object {
    $_.Name
} >> structure-backend.txt

# FRONTEND
tree .\frontend-react\src /F /A | Where-Object {
    $_ -notmatch '\.jpg$|\.png$|\.jpeg$' -and
    $_ -notmatch '\\migrations\\' -and
    $_ -notmatch '\\__pycache__\\'
} > structure-frontend.txt

"" | Out-File -Append structure-frontend.txt
"Root Files (frontend-react):" | Out-File -Append structure-frontend.txt

Get-ChildItem -Path .\frontend-react -File | Where-Object {
    $_.Name -notmatch 'package-lock\.json|\.DS_Store|yarn\.lock'
} | ForEach-Object {
    $_.Name
} >> structure-frontend.txt

# NGINX
tree .\nginx /F /A | Where-Object {
    $_ -notmatch '\.jpg$|\.png$|\.jpeg$' -and
    $_ -notmatch '\\migrations\\' -and
    $_ -notmatch '\\__pycache__\\'
} > structure-nginx.txt

"" | Out-File -Append structure-nginx.txt
"Root Files (nginx):" | Out-File -Append structure-nginx.txt

Get-ChildItem -Path .\nginx -File | Where-Object {
    $_.Name -notmatch 'package-lock\.json|\.DS_Store|yarn\.lock'
} | ForEach-Object {
    $_.Name
} >> structure-nginx.txt

# COMBINE TO FINAL FILE
"Backend Project Structure:" | Out-File -FilePath structure-project.txt
Get-Content structure-backend.txt | Out-File -Append structure-project.txt

"" | Out-File -Append structure-project.txt
"Frontend Project Structure:" | Out-File -Append structure-project.txt
Get-Content structure-frontend.txt | Out-File -Append structure-project.txt

"" | Out-File -Append structure-project.txt
"Nginx Project Structure:" | Out-File -Append structure-project.txt
Get-Content structure-nginx.txt | Out-File -Append structure-project.txt

# Print root files of the whole project (root folder where you run the script)
"" | Out-File -Append structure-project.txt
"Root Files (project root):" | Out-File -Append structure-project.txt

Get-ChildItem -Path . -File | Where-Object {
    $_.Name -notmatch 'package-lock\.json|\.DS_Store|yarn\.lock'
} | ForEach-Object {
    $_.Name
} >> structure-project.txt

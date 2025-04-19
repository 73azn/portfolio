@echo off
REM Script to create a GitHub repository and push code

echo ===================================
echo GitHub Repository Creation Tool
echo ===================================

set /p GITHUB_USER="Enter your GitHub username: "
set /p REPO_NAME="Enter repository name (default: portfolio): "
set /p TOKEN="Enter your GitHub personal access token: "

if "%REPO_NAME%"=="" set REPO_NAME=portfolio

echo Creating repository %REPO_NAME% for user %GITHUB_USER%...

curl -X POST -H "Accept: application/vnd.github+json" -H "Authorization: token %TOKEN%" https://api.github.com/user/repos -d "{\"name\":\"%REPO_NAME%\",\"description\":\"My professional portfolio website\",\"private\":false}"

echo.
echo Repository created. Connecting local repository...

git remote add origin https://github.com/%GITHUB_USER%/%REPO_NAME%.git
git branch -M main
git push -u origin main

echo.
echo Repository created and code pushed successfully!
echo.
echo Now enabling GitHub Pages for hosting...

REM Switch to gh-pages branch for deployment
git checkout --orphan gh-pages
git add .
git commit -m "Initial gh-pages branch"
git push -u origin gh-pages

echo.
echo Visit https://github.com/%GITHUB_USER%/%REPO_NAME%/settings/pages
echo to complete the GitHub Pages setup.
echo.
echo Your site will be available at: https://%GITHUB_USER%.github.io/%REPO_NAME%/

npm run build
cp dist-package.json ./dist/package.json
cp dist-package-lock.json ./dist/package-lock.json
cp dist-server.js ./dist/server.js
cd dist
git init
git remote add heroku https://git.heroku.com/beatkelly.git
git add --all
git commit -m 'new deployment'
git push heroku master -f
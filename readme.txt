required:
npm install browserify
npm install uglifyjs

Compile new code to bundle.js:
browserify src/js/app.js | uglifyjs > src/js/bundle.js
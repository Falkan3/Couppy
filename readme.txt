required:
npm install browserify
npm install uglifyjs
npm install sass-loader

Compile new code to bundle.js:
browserify src/js/app.js | uglifyjs > src/js/bundle.js
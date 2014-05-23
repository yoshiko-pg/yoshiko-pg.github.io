# gulp-slim [![Build Status](https://travis-ci.org/cognitom/gulp-slim.svg?branch=master)](https://travis-ci.org/cognitom/gulp-slim)

A [Slim](http://slim-lang.com/) plugin for [gulp](https://github.com/wearefractal/gulp).


## Install

```bash
gem install slim
npm install gulp-slim --save-dev
```


## Usage

```javascript
var gulp = require("gulp");
var slim = require("gulp-slim");

gulp.task('slim', function(){
  gulp.src("./src/slim/*.slim")
    .pipe(slim({
      pretty: true
    }))
    .pipe(gulp.dest("./dist/html/"));
});
```

or write it in CoffeeScript.

```coffeescript
gulp = requier 'gulp'
slim = require 'gulp-slim'

gulp.task 'slim', ->
  gulp.src './src/slim/*.slim'
  .pipe slim pretty: true
  .pipe gulp.dest './dist/html/'
```


## Options

The options are the same as what's supported by `slimrb`.

- `pretty: true`
- `erb: true`
- `compile: true`
- `rails: true`
- `translator: true`
- `logicLess: true`

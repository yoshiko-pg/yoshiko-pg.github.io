var gulp = require('gulp');
var slim = require('gulp-slim');
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');
var prefixer = require('gulp-autoprefixer');

gulp.task('slim', function(){
  gulp.src('index.slim')
    .pipe(plumber())
    .pipe(slim())
    .pipe(gulp.dest('.'));
});

gulp.task('sass', function(){
  gulp.src('css/style.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(prefixer('last 2 version'))
    .pipe(gulp.dest('css'));
});

gulp.task('watch', ['slim', 'sass'], function(){
  //gulp.watch('index.slim', ['slim']);
  gulp.watch('css/style.scss', ['sass']);
});

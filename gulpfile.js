var gulp = require('gulp');
var slim = require('gulp-slim');
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');
var prefixer = require('gulp-autoprefixer');

gulp.task('slim', function(){
  gulp.src('*.slim')
    .pipe(plumber())
    .pipe(slim())
    .pipe(gulp.dest('.'));
});

gulp.task('sass', function(){
  gulp.src('css/*.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(prefixer('last 2 version'))
    .pipe(gulp.dest('css'));
});

gulp.task('default', ['slim', 'sass'], function(){
  gulp.watch('*.slim', ['slim']);
  gulp.watch('css/*.scss', ['sass']);
});

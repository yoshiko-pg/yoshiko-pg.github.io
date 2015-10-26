var gulp = require('gulp');
var slim = require('gulp-slim');
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');
var prefixer = require('gulp-autoprefixer');
var bs = require('browser-sync').create();

gulp.task('slim', function(){
  gulp.src('*.slim')
    .pipe(plumber())
    .pipe(slim())
    .pipe(gulp.dest('.'))
    .pipe(bs.stream({once: true}));
});

gulp.task('sass', function(){
  gulp.src('css/*.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(prefixer('last 2 version'))
    .pipe(gulp.dest('css'))
    .pipe(bs.stream({once: true}));
});

gulp.task('serve', function() {
  bs.init({
    logLevel: "debug",
    server: "./",
    open: true,
    port: 3000,
    online: false,
    ui: false,
    scrollProportionally: false
  });
});

gulp.task('default', ['serve', 'html', 'css', 'js'], function() {
  gulp.watch('src/style/**/*.styl', ['css']);
  gulp.watch('src/script/**/*.js', ['js']);
  gulp.watch('src/**/*.jade', ['html']);
});

gulp.task('default', ['serve', 'slim', 'sass'], function(){
  gulp.watch('*.slim', ['slim']);
  gulp.watch('css/*.scss', ['sass']);
  bs.watch('css/*.scss', ['sass']);
  gulp.watch(['index.html', '**/*.js']).on('change', bs.reload);
});

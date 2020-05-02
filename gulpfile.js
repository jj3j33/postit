const gulp = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const webserver = require('gulp-webserver');

gulp.task('pug', () => {
    return gulp.src('source/*.pug')
      .pipe(pug())
      .pipe(gulp.dest('./public/'));
  });
  
  gulp.task('sass', () => {
    return gulp.src('./source/sass/*.sass')
      .pipe(sass(
        {outputStyle: 'expanded'}
      ).on('error', sass.logError))
      .pipe(gulp.dest('./public/stylesheets'));
  });
  
  gulp.task('concat', () => {
      return gulp.src('./source/js/*.js')
      .pipe(concat('all.js'))
      .pipe(gulp.dest('./public/javascripts'));
  });
  
  gulp.task('webserver', () => {
    setTimeout(function(){
      gulp.src('./public/')
        .pipe(webserver({
          livereload: true,
          open: true,
          // host: '0.0.0.0',
          port: 3333,
          directoryListing: false,
          fallback: 'index.html'
        }));
    }, 1000);
  });
  
  gulp.task('watch', () => {
    gulp.watch('source/*.pug', gulp.series('pug'));
  });
  
  gulp.task('sass:watch', () => {
    gulp.watch('./source/sass/*.sass', gulp.series('sass')); 
  });
  
  gulp.task('js:watch', () => {
    gulp.watch('./source/js/*.js', gulp.series('concat')); 
  });
  
  gulp.task('default', gulp.series('pug', 'sass', 'concat', gulp.parallel('watch', 'sass:watch', 'js:watch', 'webserver')));
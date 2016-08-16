var buildDest = 'gulp/.builds/dev';



var browserSync = require('browser-sync').create(),
    del         = require('del'),
    gulp        = require('gulp'),
    electron    = require('electron'),
    sass        = require('gulp-sass'),
    run         = require('gulp-run'),
    watch       = require('gulp-watch'),
    runSequence = require('run-sequence');
    
    
gulp.task('default', ['dev']);

gulp.task('electron', function() {
  return run('electron src/index.html').exec();
});

gulp.task('dev', function(cb) {
   runSequence('~clean:build-dest',
               '~build:scss',
               '~copy:files',
               '~copy:libraries',
               '~server',
               '~watch',
               cb)
});

gulp.task('~server', function(cb) {
   browserSync.init({
       port: 3000,
       server: {
           baseDir: buildDest
       },
       notify: false,
       ui: false,
       open: false,
       reloadOnRestart: true,
       ghostMode: false
   }, cb) 
});

gulp.task('~watch', function() {
    watch('src/**/*.scss', function() {
        gulp.run('~build:scss');
    });
});

gulp.task('~copy:files', function() {
  return gulp.src([
    'src/**/*',
    '!src/**/*.scss',
  ])
  .pipe(gulp.dest(buildDest));
});

gulp.task('~copy:libraries', function() {
  return gulp.src([
    'libraries/angular/angular.js',
    'libraries/angular-ui-router/release/angular-ui-router.js',
    'libraries/lodash/lodash.js'
  ])
  .pipe(gulp.dest(buildDest + '/libraries'));
});

gulp.task('~build:scss', function() {
  return gulp.src('src/**/*.scss')
    .pipe(sass({
      sourceMap: false
    }))
    .pipe(gulp.dest(buildDest))
    .pipe(browserSync.stream());
});



gulp.task('~clean:build-dest', function() {
  return del(buildDest);
});
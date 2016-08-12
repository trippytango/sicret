var buildDest = 'gulp/.builds/dev';



var browserSync = require('browser-sync').create(),
    gulp        = require('gulp'),
    sass        = require('gulp-sass'),
    runSequence = require('run-sequence'),
    inject      = require('gulp-inject');
    
    
gulp.task('default', ['dev']);

gulp.task('dev', function(cb) {
//    browserSyncPort = 3000;
   runSequence('~clean:build-dest',
               'dev-deploy',
               '~server',
               '~watch',
               cb)
});


gulp.task('dev-deploy', function(cb) {
  runSequence('~build:scss',
              '~build:js',
              '~inject:css',
              '~inject:libraries',
              '~inject:js',
              '~inject:js-config',
              cb);
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
    watch('src/**/*.js');
    watch('src/**/*.html', function() {
        
    });
    watch('src/**/*.scss', function() {
        gulp.run('~build:scss');
    });
});

gulp.task('~build:scss', function() {
  return gulp.src('src/**/*.scss')
    .pipe(sass({
      sourceMap: false
    }))
    .pipe(gulp.dest(buildDest))
    .pipe(browserSync.stream());
});

gulp.task('~inject:css', function() {
  var target = gulp.src(buildDest + '/index.html'),
    sources = gulp.src([
      buildDest + '/**/*.css'
    ], { read: false });

  return target.pipe(inject(sources, {
    relative: true,
    starttag: '<!--STYLES -->',
    endtag: '<!-- include: "type": "css", "files": ["**/*.css", "!**/_*.css"] -->'
  }))
  .pipe(gulp.dest(buildDest));
});

gulp.task('~clean:build-dest', function() {
  return del(buildDest);
});
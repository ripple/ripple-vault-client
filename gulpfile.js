var gulp       = require('gulp');
var browserify = require('gulp-browserify');
var uglify     = require('gulp-uglify');
var rename     = require('gulp-rename');
var del        = require('del');
var bump       = require('gulp-bump');
var pkg        = require('./package.json');

var DEST = './build';

//clear out the build directory
gulp.task('clean', function(cb) {
  del(['build'], cb);
});

//build the web module
gulp.task('build', function() {
  gulp.src('src/web.js')
    .pipe(browserify({
      insertGlobals : true,
      //debug : !gulp.env.production
    }))
    .pipe(rename('vault-client.js'))
    .pipe(gulp.dest(DEST))
    .pipe(uglify())
    .pipe(rename({extname:'.min.js'}))
    .pipe(gulp.dest(DEST));
});

// Bower Build Steps
gulp.task('bower-build', function(callback) {
  gulp.src('src/web.js')
    .pipe(browserify({
      insertGlobals : true
    }))
    .pipe(rename('ripple-vault-client.js'))
    .pipe(gulp.dest('./dist'))
    .pipe(uglify())
    .pipe(rename('ripple-vault-client-min.js'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('bower-build-debug', function(callback) {
  gulp.src('src/web.js')
    .pipe(browserify({
      insertGlobals : true,
      debug : true
    }))
    .pipe(rename('vault-client-debug.js'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('bower-version', function() {
  gulp.src('./dist/bower.json')
  .pipe(bump({ version: pkg.version }))
  .pipe(gulp.dest('./dist/'));
});

gulp.task('bower', ['bower-build', 'bower-version']);

// Watch files For Changes
gulp.task('delta', function() {
  gulp.watch('src/*.js', ['build']);
});

gulp.task('default', ['build']);
gulp.task('watch', ['delta', 'build']);

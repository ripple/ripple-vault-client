var gulp       = require('gulp');
var browserify = require('gulp-browserify');
var uglify     = require('gulp-uglify');
var rename     = require('gulp-rename');
var del        = require('del');

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

// Watch files For Changes
gulp.task('delta', function() {
  gulp.watch('src/*.js', ['build']);
});

gulp.task('default', ['build']);
gulp.task('watch', ['delta', 'build']);
